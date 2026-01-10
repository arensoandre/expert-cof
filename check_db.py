import os
from supabase import create_client
from dotenv import load_dotenv
import json

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Missing credentials")
    exit(1)

try:
    supabase = create_client(url, key)
    
    # Check Users
    users = supabase.table("users").select("*").execute()
    print(f"Users found: {len(users.data)}")
    for u in users.data:
        print(f" - User: {u['id']} ({u['email']})")

    # Check Analyses
    print("\nChecking Analyses...")
    analyses = supabase.table("analyses").select("*").execute()
    print(f"Analyses found: {len(analyses.data)}")
    for a in analyses.data:
        print(f" - Analysis: {a['id']}")
        print(f"   User: {a['user_id']}")
        print(f"   Franchise: {a['franchise_name']}")
        print(f"   Created: {a['created_at']}")
        print("---")

except Exception as e:
    print(f"Error: {e}")
