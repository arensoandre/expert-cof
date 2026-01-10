# Expert COF - Análise de Circular de Oferta de Franquia com IA

## 📋 Visão Geral do Projeto

O **Expert COF** é uma plataforma SaaS que utiliza **Inteligência Artificial (Google Gemini)** para analisar Circulares de Oferta de Franquia (COF) e fornecer insights valiosos para potenciais franqueados. A solução automatiza a análise de documentos complexos, identificando riscos, projeções financeiras e permitindo comparações entre diferentes oportunidades de franquia.

### 🎯 Problema que Resolve
- Análise manual de COFs é demorada e sujeita a erros
- Dificuldade em comparar diferentes oportunidades de franquia
- Falta de ferramentas especializadas para avaliação de riscos em franquias

### 👥 Público-Alvo
- Potenciais franqueados
- Consultores de franquia
- Investidores interessados em oportunidades de franquia
- Advogados especializados em franquias

## ✨ Funcionalidades Principais

### 🚀 Recursos do Sistema
1. **Upload de Documentos**
   - Upload de PDFs de Circulares de Oferta de Franquia
   - Processamento de texto para análise

2. **Análise de Riscos com IA**
   - Identificação automática de cláusulas de risco
   - Análise de obrigações do franqueado
   - Avaliação de restrições e penalidades
   - Geração de relatórios de risco personalizados

3. **Projeções Financeiras**
   - Extração de dados financeiros do COF
   - Cálculo de ROI e payback
   - Projeções de faturamento
   - Análise de investimento inicial vs retorno

4. **Comparativo e Benchmarking**
   - Comparação entre múltiplas franquias lado a lado
   - Rankings personalizados por critérios (Score, Financeiro, Riscos)
   - Dashboard com métricas consolidadas

5. **Modelo Freemium e Assinaturas**
   - Plano gratuito com análise básica
   - Planos premium com recursos avançados
   - Integração com **Stripe** para pagamentos
   - Gestão de assinaturas integrada

## 📖 Guia de Uso

Este guia explica como utilizar o **Expert COF** para analisar documentos de franquia.

### 1. Acesso à Plataforma
1.  Abra o navegador e acesse a aplicação.
2.  Na **Página Inicial**, você verá uma visão geral dos benefícios e planos.
3.  Clique em **"Entrar"** se já tiver conta, ou **"Começar Grátis"** para criar um novo cadastro.

### 2. Cadastro de Usuário
1.  Preencha seu **Nome**, **Email** e **Senha**.
2.  Selecione seu perfil (Franqueado, Consultor ou Advogado).
3.  Clique em **"Criar Conta"**. Você será redirecionado para o Dashboard.

### 3. Realizando uma Análise
1.  No Dashboard, clique na área de **"Nova Análise"** ou arraste um arquivo PDF.
2.  O sistema processará o arquivo utilizando IA.
3.  Após alguns instantes, você receberá um **Relatório de Análise** contendo:
    *   **Score de Risco**: Nível de segurança do investimento (0-100).
    *   **Alertas**: Cláusulas perigosas classificadas por severidade (Alto, Médio, Baixo).
    *   **Financeiro**: Estimativa de ROI, Payback, Royalties e Taxas.
    *   **Conformidade**: Verificação de itens obrigatórios pela Lei de Franquias.

### 4. Interpretando o Dashboard
- **Análises Recentes**: Histórico dos documentos que você já enviou.
- **Status**: Acompanhe suas análises.
- **Comparar**: Selecione múltiplas análises para visualizar um comparativo detalhado.

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Vite** como build tool
- **React Router DOM** para navegação
- **Zustand** para gerenciamento de estado
- **Lucide React** para ícones

### Backend
- **Python 3.11**
- **FastAPI** para APIs REST
- **PyPDF2** para processamento de PDFs
- **Google Gemini API** para análise com IA generativa
- **Stripe** para processamento de pagamentos

### Banco de Dados e Autenticação
- **Supabase** (PostgreSQL)
- **Supabase Auth** para autenticação
- **Row Level Security** para segurança de dados

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e pnpm
- Python 3.11+ e pip
- Conta no Supabase
- Chave de API do Google Gemini
- Conta no Stripe (para pagamentos)

### Frontend (React)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/expert-cof.git
cd expert-cof

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Execute o servidor de desenvolvimento
pnpm dev
```

### Backend (Python)

```bash
# Navegue para a pasta do backend
cd api

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Execute o servidor backend
uvicorn main:app --reload --port 8000
```

## 🔐 Variáveis de Ambiente

### Frontend (.env)
```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### Backend (.env)
```bash
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_service_key_do_supabase
GOOGLE_API_KEY=sua_chave_gemini
DATABASE_URL=sua_url_do_postgresql
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📁 Estrutura do Projeto

```
expert-cof/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   │   ├── Dashboard/     # Componentes do Dashboard
│   │   ├── Landing/       # Componentes da landing page
│   │   ├── Layout/        # Componentes de layout
│   │   └── ui/            # Componentes UI reutilizáveis
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários e configurações
│   ├── pages/             # Páginas da aplicação
│   └── App.tsx            # Componente principal
├── api/                    # Backend Python
│   ├── main.py            # Aplicação FastAPI principal
│   └── requirements.txt   # Dependências Python
├── supabase/              # Configurações do Supabase
│   └── migrations/        # Migrações do banco de dados
├── public/                # Assets públicos
└── README.md              # Este arquivo
```

## 🤝 Como Contribuir

1. **Fork o projeto**
   - Crie um fork do repositório em seu GitHub

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

3. **Faça suas alterações**
   - Adicione testes para novas funcionalidades
   - Mantenha o código limpo e documentado
   - Siga os padrões do projeto

4. **Commit suas mudanças**
   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```

5. **Push para a branch**
   ```bash
   git push origin feature/nova-funcionalidade
   ```

6. **Abra um Pull Request**
   - Descreva claramente as mudanças realizadas
   - Adicione screenshots se aplicável
   - Link issues relacionadas

### Diretrizes de Contribuição

- **Código limpo**: Mantenha o código limpo e bem documentado
- **Testes**: Adicione testes para novas funcionalidades
- **Commits semânticos**: Use commits semânticos (feat:, fix:, docs:, etc.)
- **TypeScript**: Use TypeScript para garantir type safety
- **Padrões de código**: Siga os padrões ESLint configurados

### Reportando Bugs

- Use as issues do GitHub para reportar bugs
- Forneça o máximo de detalhes possível
- Inclua passos para reproduzir o problema
- Adicione screenshots ou logs relevantes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: contato@expertcof.com.br
- **Website**: https://expertcof.com.br
- **LinkedIn**: https://linkedin.com/company/expert-cof

---

**Desenvolvido com ❤️ pela equipe Expert COF**
