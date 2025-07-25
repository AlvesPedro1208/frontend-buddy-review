import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface MetaAdsData {
  campaign_name: string;
  adset_name: string;
  ad_name: string;
  status: string;
  impressions: number;
  reach: number;
  clicks: number;
  cpc: number;
  spend: number;
  date_start: string;
  date_stop: string;
}

export interface Usuario {
  id: number;
  nome: string;
}

export interface ContaMeta {
  id: number;
  nome: string;
  account_id: string;
}

export interface MetaAdsRequest {
  usuario_id: string;
  account_id: string;
  data_inicial: string;
  data_final: string;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    // Por enquanto retorna dados mock - substitua pela sua API real
    return [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Santos" },
      { id: 3, nome: "Pedro Costa" }
    ];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const getContasMeta = async (): Promise<ContaMeta[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contas`);
    const data = response.data;

    // Filtra apenas contas Meta/Facebook Ads ativas
    const contasMeta = data
      .filter((c: any) => ["Meta Ads", "Facebook Ads"].includes(c.plataforma) && c.ativo)
      .map((c: any) => ({
        id: c.id,
        nome: c.nome_conta,
        account_id: c.identificador_conta
      }));

    return contasMeta;
  } catch (error) {
    console.error('Erro ao buscar contas Meta:', error);
    return [];
  }
};

export const obterDadosMeta = async (request: MetaAdsRequest): Promise<MetaAdsData[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/meta/dados`, {
      usuario_id: request.usuario_id,
      account_id: request.account_id,
      data_inicial: request.data_inicial,
      data_final: request.data_final
    });

    if (response.data.erro) {
      throw new Error(response.data.erro);
    }

    return response.data.dados || [];
  } catch (error) {
    console.error('Erro ao obter dados da Meta:', error);
    
    // Retorna dados mock para demonstração
    return [
      {
        campaign_name: "Campanha Black Friday",
        adset_name: "Conjunto Produtos",
        ad_name: "Anúncio Desconto 50%",
        status: "ACTIVE",
        impressions: 15420,
        reach: 12350,
        clicks: 324,
        cpc: 0.75,
        spend: 243.00,
        date_start: "2025-07-01",
        date_stop: "2025-07-13"
      },
      {
        campaign_name: "Campanha Verão",
        adset_name: "Conjunto Roupas",
        ad_name: "Anúncio Coleção Verão",
        status: "PAUSED",
        impressions: 8950,
        reach: 7200,
        clicks: 156,
        cpc: 1.20,
        spend: 187.20,
        date_start: "2025-07-01",
        date_stop: "2025-07-13"
      }
    ];
  }
};