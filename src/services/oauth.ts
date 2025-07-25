// Serviço para integração OAuth com Facebook/Meta
export interface FacebookApiAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  currency: string;
  business_name?: string;
  business_id?: string;
}

export interface FacebookOAuthResponse {
  access_token: string;
  accounts: FacebookApiAccount[];
  user_id: string;
  user_name: string;
}

export class FacebookOAuthService {
  private static readonly FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';
  private static readonly FACEBOOK_APP_SECRET = 'YOUR_FACEBOOK_APP_SECRET';
  private static readonly REDIRECT_URI = window.location.origin + '/oauth/callback';

  static getOAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.FACEBOOK_APP_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: 'ads_read,ads_management',
      response_type: 'code',
      state: 'facebook_oauth_' + Date.now(), // Para segurança
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.FACEBOOK_APP_ID,
      client_secret: this.FACEBOOK_APP_SECRET,
      redirect_uri: this.REDIRECT_URI,
      code,
    });

    const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao obter token');
    }

    return data.access_token;
  }

  static async getUserAdAccounts(accessToken: string): Promise<FacebookApiAccount[]> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_id,account_status,currency,business_name,business&access_token=${accessToken}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao buscar contas');
    }

    return data.data || [];
  }

  static async importAccountsToBackend(accessToken: string, accounts: FacebookApiAccount[]): Promise<void> {
    const response = await fetch('http://localhost:8000/oauth/facebook/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        accounts: accounts.map(account => ({
          plataforma: 'Facebook Ads',
          tipo: 'facebook',
          token: accessToken,
          identificador_conta: account.account_id,
          nome_conta: account.name,
          ativo: account.account_status === 1,
          metadata: {
            currency: account.currency,
            business_name: account.business_name,
            business_id: account.business_id,
          }
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao importar contas para o backend');
    }
  }
}

// Exemplo de uso na página de callback OAuth
export const handleOAuthCallback = async (code: string): Promise<FacebookOAuthResponse> => {
  try {
    // 1. Trocar code por access_token
    const accessToken = await FacebookOAuthService.exchangeCodeForToken(code);
    
    // 2. Buscar contas do usuário
    const accounts = await FacebookOAuthService.getUserAdAccounts(accessToken);
    
    // 3. Importar para o backend
    await FacebookOAuthService.importAccountsToBackend(accessToken, accounts);
    
    return {
      access_token: accessToken,
      accounts,
      user_id: 'user_id_from_token',
      user_name: 'User Name'
    };
  } catch (error) {
    console.error('Erro no callback OAuth:', error);
    throw error;
  }
};

// Novas interfaces e funções para buscar dados do backend
export interface FacebookUser {
  facebook_id: string;
  username: string;
  email: string;
}

export interface FacebookAccount {
  id: number;
  plataforma: string;
  tipo: string;
  token?: string;
  identificador_conta: string;
  nome_conta: string;
  data_conexao: string;
  ativo: boolean;
  // Compatibilidade com campos alternativos
  account_id?: string;
  name?: string;
}

export const getAllFacebookUsers = async (): Promise<FacebookUser[]> => {
  try {
    const response = await fetch('http://localhost:8000/users');
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const getUserAdAccountsFromBackend = async (facebookId: string): Promise<FacebookAccount[]> => {
  try {
    const response = await fetch(`http://localhost:8000/contas?facebook_id=${facebookId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contas do usuário');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar contas do usuário:', error);
    return [];
  }
};