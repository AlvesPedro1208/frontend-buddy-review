# Exemplo de implementação FastAPI para integração OAuth com Facebook
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
from datetime import datetime

app = FastAPI()

# Modelos Pydantic
class FacebookAccountData(BaseModel):
    plataforma: str
    tipo: str
    token: str
    identificador_conta: str
    nome_conta: str
    ativo: bool
    metadata: Optional[dict] = None

class FacebookImportRequest(BaseModel):
    access_token: str
    accounts: List[FacebookAccountData]

class FacebookOAuthRequest(BaseModel):
    access_token: str

# Configurações do Facebook
FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")

@app.post("/oauth/facebook/import")
async def import_facebook_accounts(request: FacebookImportRequest):
    """
    Importa contas do Facebook automaticamente via OAuth
    """
    try:
        # Validar token de acesso
        if not await validate_facebook_token(request.access_token):
            raise HTTPException(status_code=401, detail="Token inválido")
        
        # Salvar contas no banco de dados
        imported_accounts = []
        for account_data in request.accounts:
            # Verificar se a conta já existe
            existing_account = await get_account_by_identifier(account_data.identificador_conta)
            
            if existing_account:
                # Atualizar conta existente
                updated_account = await update_account(existing_account.id, account_data)
                imported_accounts.append(updated_account)
            else:
                # Criar nova conta
                new_account = await create_account(account_data)
                imported_accounts.append(new_account)
        
        return {
            "message": f"{len(imported_accounts)} contas importadas com sucesso",
            "accounts": imported_accounts
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/oauth/facebook/refresh")
async def refresh_facebook_accounts(request: FacebookOAuthRequest):
    """
    Atualiza a lista de contas do Facebook para um token específico
    """
    try:
        # Buscar contas do Facebook via Graph API
        accounts = await fetch_facebook_accounts(request.access_token)
        
        # Atualizar contas no banco
        updated_accounts = []
        for fb_account in accounts:
            account_data = FacebookAccountData(
                plataforma="Facebook Ads",
                tipo="facebook",
                token=request.access_token,
                identificador_conta=fb_account["account_id"],
                nome_conta=fb_account["name"],
                ativo=fb_account["account_status"] == 1,
                metadata={
                    "currency": fb_account.get("currency"),
                    "business_name": fb_account.get("business_name"),
                    "business_id": fb_account.get("business_id")
                }
            )
            
            # Verificar se existe e atualizar ou criar
            existing = await get_account_by_identifier(account_data.identificador_conta)
            if existing:
                updated = await update_account(existing.id, account_data)
                updated_accounts.append(updated)
            else:
                created = await create_account(account_data)
                updated_accounts.append(created)
        
        return {
            "message": f"{len(updated_accounts)} contas atualizadas",
            "accounts": updated_accounts
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def validate_facebook_token(access_token: str) -> bool:
    """
    Valida se o token do Facebook é válido
    """
    try:
        response = requests.get(
            f"https://graph.facebook.com/v18.0/me?access_token={access_token}"
        )
        return response.status_code == 200
    except:
        return False

async def fetch_facebook_accounts(access_token: str) -> List[dict]:
    """
    Busca todas as contas de anúncios do Facebook
    """
    try:
        response = requests.get(
            f"https://graph.facebook.com/v18.0/me/adaccounts",
            params={
                "fields": "id,name,account_id,account_status,currency,business_name,business",
                "access_token": access_token
            }
        )
        
        if response.status_code != 200:
            raise Exception(f"Erro ao buscar contas: {response.text}")
        
        data = response.json()
        return data.get("data", [])
    
    except Exception as e:
        raise Exception(f"Erro na API do Facebook: {str(e)}")

# Funções do banco de dados (implementar com SQLAlchemy)
async def get_account_by_identifier(identifier: str):
    """
    Busca conta pelo identificador
    """
    # Implementar com SQLAlchemy
    pass

async def create_account(account_data: FacebookAccountData):
    """
    Cria nova conta no banco
    """
    # Implementar com SQLAlchemy
    pass

async def update_account(account_id: int, account_data: FacebookAccountData):
    """
    Atualiza conta existente
    """
    # Implementar com SQLAlchemy
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)