import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { FacebookOAuthService } from '@/services/oauth';
import { useToast } from '@/hooks/use-toast';
import { ProductLayout } from '@/components/ProductLayout';

interface Integration {
  id: string;
  name: string;
  type: 'facebook' | 'google' | 'instagram' | 'linkedin';
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  accessToken?: string;
  accountId?: string;
  lastSync?: string;
  isActive: boolean;
}

const integrationTypes = [
  {
    type: 'facebook' as const,
    name: 'Facebook Ads',
    icon: Facebook,
    description: 'Importe dados de campanhas do Facebook Ads',
    color: 'bg-blue-600',
    fields: [
      { key: 'accessToken', label: 'Access Token', required: true },
      { key: 'accountId', label: 'Account ID', required: true }
    ]
  },
  {
    type: 'google' as const,
    name: 'Google Ads',
    icon: Globe,
    description: 'Importe dados de campanhas do Google Ads',
    color: 'bg-green-600',
    fields: [
      { key: 'apiKey', label: 'API Key', required: true },
      { key: 'accountId', label: 'Customer ID', required: true }
    ]
  },
  {
    type: 'instagram' as const,
    name: 'Instagram Business',
    icon: Instagram,
    description: 'Importe métricas do Instagram Business',
    color: 'bg-pink-600',
    fields: [
      { key: 'accessToken', label: 'Access Token', required: true },
      { key: 'accountId', label: 'Business Account ID', required: true }
    ]
  },
  {
    type: 'linkedin' as const,
    name: 'LinkedIn Ads',
    icon: Linkedin,
    description: 'Importe dados de campanhas do LinkedIn',
    color: 'bg-blue-700',
    fields: [
      { key: 'accessToken', label: 'Access Token', required: true },
      { key: 'accountId', label: 'Ad Account ID', required: true }
    ]
  }
];

const Integrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const [selectedIntegrationType, setSelectedIntegrationType] = useState<typeof integrationTypes[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isOAuthDialogOpen, setIsOAuthDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<Array<{id: string, name: string, email: string}>>([]);

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      if (response.ok) {
        const data = await response.json();
        // Garantir que data é um array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.warn('Resposta de usuários não é um array:', data);
          setUsers([]);
        }
      } else {
        console.warn('Endpoint /users não encontrado, usando array vazio');
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      // Manter users como array vazio em caso de erro
      setUsers([]);
    }
  };

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('http://localhost:8000/contas');
      const data = await response.json();

      const parsed: Integration[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.nome_conta,
        type: item.tipo,
        status: 'connected',
        accessToken: item.token,
        accountId: item.identificador_conta,
        lastSync: item.data_conexao,
        isActive: item.ativo,
      }));

      setIntegrations(parsed);
    } catch (error) {
      console.error("Erro ao buscar integrações:", error);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    fetchUsers();
  }, []);

  // Limpar estado de importação quando o componente for desmontado
  useEffect(() => {
    return () => {
      setIsImporting(false);
    };
  }, []);

  // Limpar estado de importação quando a página for fechada/recarregada
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsImporting(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isImporting) {
        setIsImporting(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isImporting]);


  const handleAddIntegration = (type: typeof integrationTypes[0]) => {
    setSelectedIntegrationType(type);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleSubmitIntegration = async () => {
    if (!selectedIntegrationType) return;

    const newIntegration = {
      plataforma: selectedIntegrationType.name,
      tipo: selectedIntegrationType.type,
      token: formData.accessToken || formData.apiKey || '',
      identificador_conta: formData.accountId || '',
      nome_conta: `${selectedIntegrationType.name} - ${formData.accountId || 'Nova Conta'}`,
      data_conexao: new Date().toISOString(),
      ativo: true
    };

    try {
      const response = await fetch('http://localhost:8000/contas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIntegration),
      });
      
      if (!response.ok) throw new Error('Erro ao salvar no banco');

      toast({
        title: "Integração salva",
        description: `${newIntegration.nome_conta} foi conectada com sucesso.`,
      });

      await fetchIntegrations();

      setIsDialogOpen(false);
      setFormData({});

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a integração no banco.",
      });
      console.error(error);
    }
  };

  const handleToggleIntegration = async (id: string, newStatus: boolean) => {
    console.log("🔁 Atualizando integração com ID:", id); 
    try {
      await fetch(`http://localhost:8000/contas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: newStatus }),
      });

      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === id 
            ? { ...integration, isActive: newStatus }
            : integration
        )
      );
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da integração.",
      });
      console.error(error);
    }
  };

  const handleDeleteIntegration = async (id: number) => {
  try {
      console.log("Deletando integração com ID:", id);
      await fetch(`http://localhost:8000/contas/${id}`, {
        method: 'DELETE',
      });
      setIntegrations(prev => prev.filter(integration => integration.id !== String(id)));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a integração.",
      });
      console.error(error);
    }
  };

  const formatLastSync = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  // OAuth Functions
  const handleOAuthIntegration = (type: typeof integrationTypes[0]) => {
    setSelectedIntegrationType(type);
    setIsOAuthDialogOpen(true);
  };

  const handleFacebookOAuth = async () => {
    setIsImporting(true);
    setIsOAuthDialogOpen(false);
    
    try {
      const oauthUrl = FacebookOAuthService.getOAuthUrl();
      
      // Abrir popup para OAuth
      const popup = window.open(oauthUrl, 'facebook-oauth', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        setIsImporting(false);
        throw new Error('Popup bloqueado pelo navegador');
      }

      let isComplete = false;
      let checkClosedInterval: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      // Cleanup function
      const cleanup = () => {
        if (!isComplete) {
          isComplete = true;
          setIsImporting(false);
          window.removeEventListener('message', handleMessage);
          if (checkClosedInterval) clearInterval(checkClosedInterval);
          if (timeoutId) clearTimeout(timeoutId);
        }
      };

      // Aguardar mensagem do callback
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || isComplete) return;
        
        if (event.data.type === 'OAUTH_SUCCESS') {
          cleanup();
          
          toast({
            title: "Integração concluída!",
            description: `${event.data.data.accounts.length} contas importadas com sucesso.`,
          });
          
          // Recarregar integrações
          fetchIntegrations();
          
        } else if (event.data.type === 'OAUTH_ERROR') {
          cleanup();
          
          toast({
            title: "Erro na integração",
            description: event.data.error?.message || "Não foi possível conectar com o Facebook.",
            variant: "destructive",
          });
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Sem detecção automática - apenas controle manual via botão Cancelar

      // Timeout de segurança (2 minutos)
      timeoutId = setTimeout(() => {
        if (!isComplete) {
          cleanup();
          if (!popup.closed) popup.close();
          toast({
            title: "Timeout na integração",
            description: "A autenticação demorou muito para ser concluída.",
            variant: "destructive",
          });
        }
      }, 120000);
      
    } catch (error) {
      setIsImporting(false);
      toast({
        title: "Erro na integração",
        description: error instanceof Error ? error.message : "Não foi possível conectar com o Facebook.",
        variant: "destructive",
      });
    }
  };

  const handleImportFacebookAccounts = async (accessToken: string) => {
    try {
      const response = await fetch('http://localhost:8000/oauth/facebook/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });
      
      if (response.ok) {
        await fetchIntegrations();
        toast({
          title: "Contas importadas!",
          description: "Todas as contas do Facebook foram importadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao importar contas:', error);
    }
  };

  return (
    <ProductLayout title="Integrações de API">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie suas conexões com plataformas de marketing e dados
            </p>
          </div>
        </div>

        {/* Available Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrationTypes.map((type) => {
            const Icon = type.icon;
            const isFacebook = type.type === 'facebook';
            
            return (
              <Card 
                key={type.type} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => isFacebook ? handleOAuthIntegration(type) : handleAddIntegration(type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isFacebook ? 'Conecte suas contas automaticamente' : type.description}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Filter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Integrações Ativas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visualize e gerencie suas conexões ativas
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <label htmlFor="user-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por usuário:
            </label>
            <select
              id="user-filter"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] z-10"
            >
              <option value="all">Todos os usuários</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Integrations */}
        <div>
          
          {integrations.filter(integration => 
            selectedUser === 'all' || integration.accountId?.includes(selectedUser)
          ).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Settings className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma integração configurada
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedUser === 'all' 
                    ? 'Adicione sua primeira integração clicando em uma das opções acima'
                    : 'Nenhuma integração encontrada para este usuário'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {integrations.filter(integration => 
                selectedUser === 'all' || integration.accountId?.includes(selectedUser)
              ).map((integration) => {
                const integationType = integrationTypes.find(t => t.type === integration.type);
                const Icon = integationType?.icon || Settings;
                
                return (
                  <Card key={integration.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${integationType?.color || 'bg-gray-600'}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {integration.name}
                              </h3>
                              {getStatusIcon(integration.status)}
                              {getStatusBadge(integration.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>Account ID: {integration.accountId}</span>
                              <span>Última sincronização: {formatLastSync(integration.lastSync || '')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                              Ativo
                            </Label>
                            <Switch
                              id={`toggle-${integration.id}`}
                              checked={integration.isActive}
                              onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteIntegration(Number(integration.id))}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* OAuth Integration Dialog */}
        <Dialog open={isOAuthDialogOpen} onOpenChange={setIsOAuthDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Facebook className="h-6 w-6 text-white" />
                </div>
              </div>
              <DialogTitle className="text-xl font-semibold">
                Conectar {selectedIntegrationType?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                Escolha como deseja conectar sua conta {selectedIntegrationType?.name} para importar dados de campanhas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-6">
              <Button 
                onClick={handleFacebookOAuth}
                disabled={isImporting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-medium rounded-lg"
                size="lg"
              >
                <Globe className="h-5 w-5 mr-3" />
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Conectando...
                  </>
                ) : (
                  'Continuar neste navegador'
                )}
              </Button>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 px-4">
                Será aberta uma nova janela para autenticação segura com o Facebook
              </p>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-gray-500 dark:text-gray-400 font-medium">OU</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => {
                  const oauthUrl = FacebookOAuthService.getOAuthUrl();
                  navigator.clipboard.writeText(oauthUrl);
                  toast({
                    title: "Link copiado!",
                    description: "Cole o link em outro navegador para conectar sua conta.",
                  });
                }}
                className="w-full py-4 text-base font-medium rounded-lg border-2"
                size="lg"
                disabled={isImporting}
              >
                <Settings className="h-5 w-5 mr-3" />
                Copiar link para navegador multilogin
              </Button>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
                Use esta opção para conectar em um navegador com múltiplas contas ou compartilhar com colaboradores
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Loading Overlay */}
        {isImporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm mx-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-900 dark:text-white font-medium mb-2">Importando contas...</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Aguarde enquanto importamos suas contas do Facebook</p>
              
              <Button 
                variant="outline" 
                onClick={() => setIsImporting(false)}
                className="w-full"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Add Integration Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Conectar {selectedIntegrationType?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedIntegrationType?.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedIntegrationType?.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.key.includes('Token') || field.key.includes('Key') ? 'password' : 'text'}
                    placeholder={`Digite seu ${field.label.toLowerCase()}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [field.key]: e.target.value
                    }))}
                  />
                </div>
              ))}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleSubmitIntegration}
                  disabled={!selectedIntegrationType?.fields.every(field => 
                    !field.required || formData[field.key]
                  )}
                  className="flex-1"
                >
                  Conectar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProductLayout>
  );
};

export default Integrations;