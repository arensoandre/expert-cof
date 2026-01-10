from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import shutil
import PyPDF2
from pathlib import Path
from supabase import create_client, Client
import google.generativeai as genai
import json
import stripe
from pydantic import BaseModel

load_dotenv()

# Stripe Configuration
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# Initialize Supabase Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_KEY not found in environment variables.")

supabase: Client = create_client(url, key) if url and key else None

# Initialize Gemini
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")

app = FastAPI(title="Expert COF API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Welcome to Expert COF API"}

@app.get("/health")
async def health_check():
    # Verify Supabase connection
    db_status = "disconnected"
    if supabase:
        try:
            # Try to fetch 1 row from users table to verify connection
            # Using count='exact', head=True to be efficient
            response = supabase.table("users").select("count", count="exact").execute()
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
    
    return {"status": "healthy", "database": db_status}

import hashlib
from datetime import datetime, timezone, timedelta

# ... (imports)

@app.post("/api/cof/upload")
async def upload_cof(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    token = authorization.replace("Bearer ", "")
    user_id = None
    
    # Validate User
    if supabase:
        try:
            user_response = supabase.auth.get_user(token)
            if user_response and user_response.user:
                user_id = user_response.user.id
        except Exception as auth_err:
            print(f"Auth validation failed: {auth_err}")
            raise HTTPException(status_code=401, detail="Invalid token")

    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    # CHECK USER PLAN AND LIMITS
    if supabase:
        try:
            # 1. Get User Plan
            user_data = supabase.table("users").select("plan").eq("id", user_id).execute()
            
            # Default to free if user record not found or plan not set
            plan = 'free'
            if user_data.data and len(user_data.data) > 0:
                plan = user_data.data[0].get("plan", "free")
            
            if plan == 'free':
                # 2. Check Daily Limit (1 per day)
                # Calculate start of day (UTC)
                now_utc = datetime.now(timezone.utc)
                start_of_day = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
                
                # Query ALL analyses created by this user (Total Lifetime Count)
                lifetime_count = supabase.table("analyses") \
                    .select("id", count="exact") \
                    .eq("user_id", user_id) \
                    .execute()
                
                count = lifetime_count.count if lifetime_count.count is not None else len(lifetime_count.data)
                
                if count >= 3:
                    print(f"User {user_id} reached lifetime limit (Free). Count: {count}")
                    raise HTTPException(
                        status_code=403, 
                        detail="Limite de 3 análises gratuitas atingido. Assine o plano Profissional para continuar."
                    )
        except HTTPException as he:
            raise he
        except Exception as limit_err:
            print(f"Error checking limits: {limit_err}")
            # Fail safe: allow if check fails to avoid blocking users due to bugs
            pass

    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = UPLOAD_DIR / file.filename
    
    try:
        # Save uploaded file temporarily
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Calculate SHA-256 Hash
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        file_hash = sha256_hash.hexdigest()

        # Check if this file hash already exists in Supabase
        if supabase:
            try:
                # Check if THIS user already analyzed this file (or if we want global deduplication?)
                # For now, global deduplication is better for performance, but we must re-insert for this user if they haven't done it.
                # Let's check if there is ANY analysis with this hash.
                existing_analysis = supabase.table("analyses").select("*").eq("file_hash", file_hash).execute()
                
                if existing_analysis.data and len(existing_analysis.data) > 0:
                    # Found a cached analysis!
                    cached_record = existing_analysis.data[0]
                    print(f"File already analyzed globally. Hash: {file_hash}")
                    
                    result = cached_record.get("risk_analysis")
                    
                    # Now check if THIS user already has it. If not, link it to them.
                    user_analysis = supabase.table("analyses").select("id").eq("file_hash", file_hash).eq("user_id", user_id).execute()
                    
                    if not user_analysis.data:
                        # User hasn't analyzed this yet, but we have the data. 
                        # Insert a new record for this user with the CACHED data (no AI cost).
                        new_record = {
                            "user_id": user_id,
                            "franchise_name": cached_record.get("franchise_name"),
                            "file_path": str(file_path),
                            "file_hash": file_hash,
                            "risk_analysis": result,
                            "status": "completed",
                            "extracted_data": cached_record.get("extracted_data")
                        }
                        supabase.table("analyses").insert(new_record).execute()
                        print("Saved cached analysis for new user.")
                    
                    if result:
                        result["from_cache"] = True
                        result["franchise_name"] = cached_record.get("franchise_name")
                        return result
            except Exception as db_err:
                print(f"Database check failed: {db_err}")

        # Extract text from PDF
        text = ""
        try:
            with open(file_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                # Optimize: Only read first 50 pages or until we have enough text
                MAX_PAGES = 50
                MAX_CHARS = 60000
                
                for i, page in enumerate(pdf_reader.pages):
                    if i >= MAX_PAGES:
                        break
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
                    if len(text) > MAX_CHARS:
                        break
            
            if len(text.strip()) < 100:
                print("Warning: Text too short, potential scanned PDF.")
                # We removed OCR for now to improve performance stability.
                # AI will receive empty text and likely return an error/warning analysis.
        except Exception as pdf_err:
            print(f"PDF extraction error: {pdf_err}")
        
        # Analyze with Gemini if Key is available
        if GOOGLE_API_KEY:
            try:
                # Trying a lighter/preview model to avoid rate limits
                # Fallback list: gemini-2.0-flash-lite-preview-02-05 -> gemini-flash-latest
                model_name = 'gemini-2.0-flash-lite-preview-02-05'
                model = genai.GenerativeModel(model_name)
                
                prompt = f"""
                Você é um advogado especialista em franchising brasileiro (Lei 13.966/2019) e analista financeiro sênior. 
                Sua tarefa é analisar a Circular de Oferta de Franquia (COF) fornecida e extrair informações críticas com alta precisão.

                OBJETIVO: Identificar riscos jurídicos, obrigações financeiras ocultas e avaliar a viabilidade do negócio.

                EXTRAÇÃO DE DADOS (JSON ESTRITO):
                1. **Identificação**:
                   - Nome da Franquia (Razão Social e Nome Fantasia).
                   - CNPJ da Franqueadora (Formato XX.XXX.XXX/XXXX-XX). Se houver múltiplos, liste o principal.
                
                2. **Análise Financeira (Seja preciso com valores e moedas)**:
                   - Investimento Inicial Total: Valor mínimo e máximo estimado (R$). Inclua taxa de franquia + capital de giro + instalação.
                   - Taxa de Franquia: Valor cobrado na assinatura (R$).
                   - Royalties: Base de cálculo (ex: % sobre Faturamento Bruto) ou valor fixo mensal.
                   - Fundo de Propaganda: Base de cálculo (ex: % sobre Faturamento Bruto) ou valor fixo.
                   - Payback (Retorno): Prazo estimado em meses (ex: "18 a 24 meses").
                   - Rentabilidade/Lucratividade: % média mensal ou valor líquido estimado.

                3. **Análise de Riscos (Crucial)**:
                   - Classifique os riscos em: "Alto" (Cláusulas abusivas, multas desproporcionais, insegurança jurídica), "Médio" (Restrições operacionais rígidas) ou "Baixo" (Padrão de mercado).
                   - Para cada risco, forneça um título curto e uma descrição explicativa baseada na lei ou boas práticas.

                4. **Conformidade e Ausências**:
                   - Verifique se a COF contém: Balanços dos últimos 2 anos, Pendências Judiciais, Relação de Franqueados (ativos e desligados), Marca registrada no INPI.
                   - Liste explicitamente o que estiver faltando ou incompleto.

                FORMATO DE SAÍDA (JSON):
                {{
                    "franchise_name": "Nome Fantasia (Razão Social)",
                    "cnpj": "00.000.000/0000-00",
                    "score": <inteiro 0-100 baseada na segurança jurídica e atratividade financeira>,
                    "summary": "Resumo executivo profissional começando com 'Análise da COF da franquia [NOME]...'. Destaque os pontos fortes e os alertas críticos em 2-3 parágrafos.",
                    "financials": {{
                        "initial_investment": "R$ X a R$ Y",
                        "franchise_fee": "R$ X",
                        "royalties": "X% sobre Faturamento Bruto",
                        "advertising_fund": "X% sobre Faturamento Bruto",
                        "payback_period": "X a Y meses",
                        "profitability": "X% a Y% a.m."
                    }},
                    "risks": [
                        {{
                            "severity": "high|medium|low",
                            "title": "Título do Risco",
                            "description": "Explicação detalhada do porquê isso é um risco para o franqueado."
                        }}
                    ],
                    "missingClauses": [
                        "Item obrigatório não encontrado 1",
                        "Item obrigatório não encontrado 2"
                    ],
                    "recommendations": [
                        "Ação prática recomendada 1 (ex: Negociar cláusula X)",
                        "Ação prática recomendada 2"
                    ]
                }}

                Texto da COF para análise (Primeiros 50k caracteres):
                {text[:50000]} 
                """
                # Reduced to 50k chars to avoid Free Tier TPM limits

                response = model.generate_content(prompt)
                
                # Extract JSON from response
                response_text = response.text.replace('```json', '').replace('```', '').strip()
                analysis_result = json.loads(response_text)
                
                # Add metadata
                analysis_result["filename"] = file.filename
                analysis_result["uploadDate"] = datetime.now().isoformat()
                
                # Save to Supabase (User ID is now guaranteed)
                if supabase:
                    try:
                        new_record = {
                            "user_id": user_id,
                            "franchise_name": analysis_result.get("franchise_name", "Desconhecida"),
                            "file_path": str(file_path),
                            "file_hash": file_hash,
                            "risk_analysis": analysis_result,
                            "status": "completed",
                            "extracted_data": {"cnpj": analysis_result.get("cnpj")}
                        }
                        supabase.table("analyses").insert(new_record).execute()
                        print("Analysis saved to database.")
                    except Exception as save_err:
                        print(f"Failed to save to database: {save_err}")
                
                return analysis_result

            except Exception as ai_error:
                print(f"AI Analysis failed with {model_name}: {str(ai_error)}")
                # Try fallback model if first one fails
                try:
                    print("Retrying with gemini-flash-latest...")
                    model = genai.GenerativeModel('gemini-flash-latest')
                    response = model.generate_content(prompt)
                    response_text = response.text.replace('```json', '').replace('```', '').strip()
                    analysis_result = json.loads(response_text)
                    analysis_result["filename"] = file.filename
                    analysis_result["uploadDate"] = datetime.now().isoformat()
                    
                    # Save fallback result to DB too!
                    if supabase:
                        try:
                            new_record = {
                                "user_id": user_id,
                                "franchise_name": analysis_result.get("franchise_name", "Desconhecida"),
                                "file_path": str(file_path),
                                "file_hash": file_hash,
                                "risk_analysis": analysis_result,
                                "status": "completed",
                                "extracted_data": {"cnpj": analysis_result.get("cnpj")}
                            }
                            supabase.table("analyses").insert(new_record).execute()
                            print("Analysis saved to database (fallback model).")
                        except Exception as save_err:
                            print(f"Failed to save to database: {save_err}")

                    return analysis_result
                except Exception as retry_error:
                     print(f"Retry failed: {str(retry_error)}")
                     pass



        # MOCK ANALYSIS (Fallback)
        # This simulates what the AI would return
        mock_analysis = {
            "filename": file.filename,
            "uploadDate": "2024-01-06",
            "score": 0,
            "summary": "ERRO NA ANÁLISE AUTOMÁTICA (FALLBACK). Não foi possível conectar com a Inteligência Artificial neste momento. Os dados abaixo são apenas um exemplo ilustrativo e NÃO correspondem ao documento enviado. Por favor, verifique a chave de API ou tente novamente mais tarde.",
            "franchise_name": "ERRO - DADOS SIMULADOS",
            "cnpj": "00.000.000/0000-00",
            "risks": [
                {
                    "severity": "high",
                    "title": "Multa Rescisória",
                    "description": "A multa por rescisão antecipada é de 50% do valor total do contrato restante, o que é considerado abusivo pela jurisprudência recente."
                },
                {
                    "severity": "medium",
                    "title": "Território Não Exclusivo",
                    "description": "A franqueadora se reserva o direito de abrir unidades próprias ou licenciar outras franquias na mesma zona de influência primária."
                },
                {
                    "severity": "low",
                    "title": "Taxa de Renovação",
                    "description": "A taxa de renovação não está fixada em valor, sendo definida a critério da franqueadora no momento da renovação."
                }
            ],
            "missingClauses": [
                "Balanços financeiros dos últimos 2 exercícios",
                "Situação da marca no INPI (apenas protocolo informado)",
                "Perfil do franqueado ideal detalhado"
            ],
            "recommendations": [
                "Negociar a redução da multa rescisória para um patamar de 20%.",
                "Solicitar cláusula de preferência para novas unidades no território.",
                "Exigir a apresentação dos balanços auditados antes da assinatura."
            ]
        }
        
        return mock_analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# STRIPE ENDPOINTS

class CheckoutRequest(BaseModel):
    user_id: str
    price_id: str

class PortalRequest(BaseModel):
    user_id: str

@app.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    try:
        user_data = supabase.table("users").select("stripe_customer_id, email").eq("id", request.user_id).single().execute()
        customer_id = None
        email = None
        if user_data.data:
            customer_id = user_data.data.get("stripe_customer_id")
            email = user_data.data.get("email")

        if not customer_id:
            # Create Customer
            customer = stripe.Customer.create(email=email, metadata={"user_id": request.user_id})
            customer_id = customer.id
            # Save to Supabase
            supabase.table("users").update({"stripe_customer_id": customer_id}).eq("id", request.user_id).execute()

        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            line_items=[
                {
                    'price': request.price_id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='http://localhost:5174/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5174/profile',
        )
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Checkout Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create-portal-session")
async def create_portal_session(request: PortalRequest):
    try:
        user_data = supabase.table("users").select("stripe_customer_id, email").eq("id", request.user_id).single().execute()
        customer_id = None
        email = None
        if user_data.data:
            customer_id = user_data.data.get("stripe_customer_id")
            email = user_data.data.get("email")

        if not customer_id:
             # Create Customer if missing
             customer = stripe.Customer.create(email=email, metadata={"user_id": request.user_id})
             customer_id = customer.id
             # Save to Supabase
             supabase.table("users").update({"stripe_customer_id": customer_id}).eq("id", request.user_id).execute()

        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url='http://localhost:5174/profile',
        )
        return {"url": portal_session.url}
    except Exception as e:
        print(f"Stripe Portal Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class VerifySessionRequest(BaseModel):
    session_id: str
    user_id: str

class CancelSubscriptionRequest(BaseModel):
    user_id: str

@app.post("/api/verify-checkout-session")
async def verify_checkout_session(request: VerifySessionRequest):
    try:
        session = stripe.checkout.Session.retrieve(request.session_id)
        
        if session.payment_status == 'paid':
            # Update User Plan to Premium
            supabase.table("users").update({"plan": "premium"}).eq("id", request.user_id).execute()
            return {"status": "success", "plan": "premium"}
        else:
            return {"status": "pending", "plan": "free"}
    except Exception as e:
        print(f"Verification Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cancel-subscription")
async def cancel_subscription(request: CancelSubscriptionRequest):
    try:
        print(f"Cancelling subscription for user: {request.user_id}")
        
        # 1. Try to cancel Stripe Subscription (Best Effort)
        try:
            user_data = supabase.table("users").select("stripe_customer_id").eq("id", request.user_id).single().execute()
            customer_id = user_data.data.get("stripe_customer_id") if user_data.data else None

            if customer_id:
                print(f"Found Stripe Customer ID: {customer_id}")
                # Find active subscriptions
                subscriptions = stripe.Subscription.list(customer=customer_id, status='active', limit=1)
                if subscriptions.data:
                    sub_id = subscriptions.data[0].id
                    stripe.Subscription.delete(sub_id)
                    print(f"Stripe subscription {sub_id} cancelled.")
                else:
                    print("No active Stripe subscription found.")
        except Exception as stripe_err:
            print(f"Stripe cancellation failed (ignoring to allow local downgrade): {stripe_err}")

        # 2. Always downgrade locally in Supabase
        supabase.table("users").update({"plan": "free"}).eq("id", request.user_id).execute()
        print("Local plan downgraded to 'free'.")
        
        return {"status": "success", "message": "Subscription cancelled and plan downgraded."}
    except Exception as e:
        print(f"Cancellation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

