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
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  TrendingUp,
  CreditCard,
  BarChart
} from 'lucide-react';
import { FacebookOAuthService, getAllFacebookUsers, getUserAdAccountsFromBackend, FacebookUser, FacebookAccount } from '@/services/oauth';
import { getContas } from '@/services/integrations';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { AppSidebar } from '@/components/AppSidebar';

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
    type: 'other' as const,
    name: 'Outras Plataformas',
    icon: Layers,
    description: 'Conecte outras plataformas e ferramentas',
    color: 'bg-purple-600',
    fields: []
  }
];

const otherPlatforms = [
  {
    id: 'vturb',
    name: 'VTurb',
    icon: TrendingUp,
    description: 'Plataforma de otimização de tráfego',
    color: 'bg-orange-600',
    fields: [
      { key: 'apiKey', label: 'API Key', required: true },
      { key: 'userId', label: 'User ID', required: true }
    ]
  },
  {
    id: 'utmify',
    name: 'UTMify',
    icon: BarChart,
    description: 'Gerenciamento de UTMs e tracking',
    color: 'bg-green-600',
    fields: [
      { key: 'accessToken', label: 'Access Token', required: true },
      { key: 'workspaceId', label: 'Workspace ID', required: true }
    ]
  },
  {
    id: 'payt',
    name: 'Payt',
    icon: CreditCard,
    description: 'Checkout de pagamentos',
    color: 'bg-blue-600',
    fields: [
      { key: 'apiKey', label: 'API Key', required: true },
      { key: 'merchantId', label: 'Merchant ID', required: true }
    ]
  },
  {
    id: 'custom',
    name: 'Plataforma Personalizada',
    icon: Settings,
    description: 'Configure uma conexão personalizada',
    color: 'bg-gray-600',
    fields: [
      { key: 'name', label: 'Nome da Plataforma', required: true },
      { key: 'apiUrl', label: 'URL da API', required: true },
      { key: 'apiKey', label: 'API Key', required: true }
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
  const [users, setUsers] = useState<FacebookUser[]>([]);
  const [selectedFacebookId, setSelectedFacebookId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<FacebookAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOtherPlatformsOpen, setIsOtherPlatformsOpen] = useState(false);
  const [selectedOtherPlatform, setSelectedOtherPlatform] = useState<typeof otherPlatforms[0] | null>(null);
  const accountsPerPage = 10;

  // Lógica de paginação
  const filteredAccounts = accounts.filter(account => 
    (account.name || account.nome_conta || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const startIndex = (currentPage - 1) * accountsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + accountsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await getContas();
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

    const fetchUsers = async () => {
      try {
        const data = await getAllFacebookUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setUsers([]);
      }
    };

    fetchIntegrations();
    fetchUsers();
  }, []);

  const handleSearchAccounts = async () => {
    if (!selectedFacebookId) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await getUserAdAccountsFromBackend(selectedFacebookId);
      setAccounts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (id: string, newStatus: boolean) => {
    try {
      await fetch(`http://localhost:8000/contas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    }
  };

  const handleDeleteIntegration = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/contas/${id}`, { method: 'DELETE' });
      setIntegrations(prev => prev.filter(integration => integration.id !== String(id)));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a integração.",
      });
    }
  };

  const handleOAuthIntegration = (type: typeof integrationTypes[0]) => {
    setSelectedIntegrationType(type);
    setIsOAuthDialogOpen(true);
  };

  const handleOtherPlatformsClick = () => {
    setIsOtherPlatformsOpen(true);
  };

  const handleOtherPlatformSelect = (platform: typeof otherPlatforms[0]) => {
    setSelectedOtherPlatform(platform);
    setIsOtherPlatformsOpen(false);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleAddIntegration = (type: typeof integrationTypes[0]) => {
    if (type.type === 'other') {
      handleOtherPlatformsClick();
      return;
    }
    setSelectedIntegrationType(type);
    setFormData({});
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
          <ResizablePanel defaultSize={16} minSize={12} maxSize={25}>
            <AppSidebar />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={84} minSize={75}>
            <div className="flex flex-col h-full">
              <header className="bg-card border-b border-border p-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
                  <p className="text-muted-foreground mt-1">
                    Conecte suas contas de anúncios e plataformas para importar dados automaticamente.
                  </p>
                </div>
              </header>

              <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
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

                  {/* Integrações Ativas */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold">Integrações Ativas</h2>
                        <p className="text-sm text-muted-foreground">Gerencie suas conexões ativas</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <select
                          value={selectedFacebookId || ''}
                          onChange={(e) => setSelectedFacebookId(e.target.value || null)}
                          className="px-3 py-2 border rounded-md text-sm bg-background"
                        >
                          <option value="">Selecionar usuário</option>
                          {users.map((user) => (
                            <option key={user.facebook_id} value={user.facebook_id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                        
                        <Button onClick={handleSearchAccounts} disabled={!selectedFacebookId}>
                          <Search className="h-4 w-4 mr-2" />
                          {loading ? 'Buscando...' : 'Buscar Contas'}
                        </Button>
                      </div>
                    </div>

                    {/* Lista de contas */}
                    {!loading && !selectedFacebookId && (
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Selecione um usuário</h3>
                        <p className="text-gray-500">Escolha um usuário para visualizar suas integrações.</p>
                      </div>
                    )}

                    {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Carregando contas...</p>
                      </div>
                    )}

                    {!loading && paginatedAccounts.length > 0 && (
                      <div className="divide-y">
                        {paginatedAccounts.map((conta) => (
                          <div key={conta.id} className="py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 rounded-lg bg-blue-600">
                                <Facebook className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">{conta.name || conta.nome_conta}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ID: {conta.account_id || conta.identificador_conta}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={conta.ativo}
                                onCheckedChange={(checked) => handleToggleIntegration(String(conta.id), checked)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteIntegration(conta.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Modal para Outras Plataformas */}
        <Dialog open={isOtherPlatformsOpen} onOpenChange={setIsOtherPlatformsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Outras Plataformas</DialogTitle>
              <DialogDescription>
                Escolha uma plataforma para conectar
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {otherPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Card 
                    key={platform.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleOtherPlatformSelect(platform)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${platform.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {platform.description}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para configuração de integração normal */}
        <Dialog open={isDialogOpen && !selectedOtherPlatform} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedIntegrationType ? `Conectar ${selectedIntegrationType.name}` : 'Nova Integração'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados necessários para conectar sua conta.
              </DialogDescription>
            </DialogHeader>
            {selectedIntegrationType && (
              <div className="space-y-4">
                {selectedIntegrationType.fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  </div>
                ))}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Conectar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal para configuração de outras plataformas */}
        <Dialog open={isDialogOpen && !!selectedOtherPlatform} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedOtherPlatform(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedOtherPlatform ? `Conectar ${selectedOtherPlatform.name}` : 'Nova Integração'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados necessários para conectar sua conta.
              </DialogDescription>
            </DialogHeader>
            {selectedOtherPlatform && (
              <div className="space-y-4">
                {selectedOtherPlatform.fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  </div>
                ))}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedOtherPlatform(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button>
                    Conectar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Integrations;