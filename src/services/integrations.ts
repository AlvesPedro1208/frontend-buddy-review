import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface ContaAPI {
  id: number;
  plataforma: string;
  tipo: 'facebook' | 'google' | 'instagram' | 'linkedin';
  token?: string;
  identificador_conta: string;
  nome_conta: string;
  data_conexao: string;
  ativo: boolean;
}

export const getContas = async (): Promise<ContaAPI[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contas`);
    return response.data;
  } catch (error) {
    console.warn('Backend não disponível, usando dados mock:', error);
    // Retorna dados mock quando a API não estiver disponível
    return [
      {
        id: 1,
        plataforma: "Meta Ads",
        tipo: "facebook",
        token: "mock_token_123",
        identificador_conta: "act_123456789",
        nome_conta: "Conta Principal Meta Ads",
        data_conexao: "2025-07-25T00:00:00Z",
        ativo: true
      },
      {
        id: 2,
        plataforma: "Facebook Ads",
        tipo: "facebook",
        token: "mock_token_456",
        identificador_conta: "act_987654321",
        nome_conta: "Conta Secundária Facebook",
        data_conexao: "2025-07-20T00:00:00Z",
        ativo: true
      },
      {
        id: 3,
        plataforma: "Google Ads",
        tipo: "google",
        token: "mock_token_789",
        identificador_conta: "123-456-7890",
        nome_conta: "Conta Google Ads",
        data_conexao: "2025-07-18T00:00:00Z",
        ativo: false
      }
    ];
  }
};

export const criarConta = async (dados: Omit<ContaAPI, 'id' | 'data_conexao'>): Promise<void> => {
  await axios.post(`${API_BASE_URL}/contas`, dados);
};

export const atualizarStatusConta = async (id: number, ativo: boolean): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/contas/${id}`, { ativo });
};

export const deletarConta = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/contas/${id}`);
};