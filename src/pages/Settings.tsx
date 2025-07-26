import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { AppSidebar } from '@/components/AppSidebar';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Moon,
  Sun,
  Mail,
  Key,
  Trash2,
  Download,
  Upload,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Estados para configurações gerais
  const [userSettings, setUserSettings] = useState({
    name: 'João Silva',
    email: 'joao@empresa.com',
    company: 'Minha Empresa',
    role: 'Administrador'
  });

  // Estados para notificações
  const [notifications, setNotifications] = useState({
    emailReports: true,
    dashboardAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyReports: true
  });

  // Estados para configurações de dados
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    retentionPeriod: '12',
    exportFormat: 'xlsx',
    timezone: 'America/Sao_Paulo'
  });

  // Estados para configurações de API
  const [apiSettings, setApiSettings] = useState({
    apiKey: 'sk-1234567890abcdef',
    webhookUrl: '',
    rateLimit: '1000'
  });

  const handleSaveProfile = () => {
    // Aqui seria a chamada para salvar no backend
    toast({
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram salvas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    // Aqui seria a chamada para salvar no backend
    toast({
      title: "Preferências salvas",
      description: "Suas configurações de notificação foram atualizadas.",
    });
  };

  const handleSaveDataSettings = () => {
    // Aqui seria a chamada para salvar no backend
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de dados foram atualizadas.",
    });
  };

  const handleSaveApiSettings = () => {
    // Aqui seria a chamada para salvar no backend
    toast({
      title: "API configurada",
      description: "Suas configurações de API foram salvas.",
    });
  };

  const handleGenerateNewApiKey = () => {
    const newApiKey = 'sk-' + Math.random().toString(36).substr(2, 20);
    setApiSettings(prev => ({ ...prev, apiKey: newApiKey }));
    toast({
      title: "Nova chave gerada",
      description: "Uma nova chave de API foi gerada com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados estão sendo preparados para download.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Conta excluída",
      description: "Sua conta e todos os dados foram removidos permanentemente.",
      variant: "destructive",
    });
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
              {/* Header */}
              <header className="bg-card border-b border-border p-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                  <p className="text-muted-foreground mt-1">
                    Gerencie suas preferências e configurações da plataforma.
                  </p>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Perfil
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notificações
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Aparência
                      </TabsTrigger>
                      <TabsTrigger value="data" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Dados
                      </TabsTrigger>
                      <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Segurança
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab: Perfil */}
                    <TabsContent value="profile" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informações Pessoais
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nome Completo</Label>
                              <Input
                                id="name"
                                value={userSettings.name}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">E-mail</Label>
                              <Input
                                id="email"
                                type="email"
                                value={userSettings.email}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company">Empresa</Label>
                              <Input
                                id="company"
                                value={userSettings.company}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, company: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role">Cargo</Label>
                              <Input
                                id="role"
                                value={userSettings.role}
                                onChange={(e) => setUserSettings(prev => ({ ...prev, role: e.target.value }))}
                              />
                            </div>
                          </div>
                          <Button onClick={handleSaveProfile} className="w-fit">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Tab: Notificações */}
                    <TabsContent value="notifications" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Preferências de Notificação
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Relatórios por E-mail</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receba relatórios periódicos por e-mail
                                </p>
                              </div>
                              <Switch
                                checked={notifications.emailReports}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({ ...prev, emailReports: checked }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Alertas do Dashboard</Label>
                                <p className="text-sm text-muted-foreground">
                                  Notificações quando métricas importantes mudam
                                </p>
                              </div>
                              <Switch
                                checked={notifications.dashboardAlerts}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({ ...prev, dashboardAlerts: checked }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Atualizações do Sistema</Label>
                                <p className="text-sm text-muted-foreground">
                                  Informações sobre novas funcionalidades
                                </p>
                              </div>
                              <Switch
                                checked={notifications.systemUpdates}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>E-mails de Marketing</Label>
                                <p className="text-sm text-muted-foreground">
                                  Dicas, tutoriais e promoções
                                </p>
                              </div>
                              <Switch
                                checked={notifications.marketingEmails}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Relatório Semanal</Label>
                                <p className="text-sm text-muted-foreground">
                                  Resumo semanal das suas métricas
                                </p>
                              </div>
                              <Switch
                                checked={notifications.weeklyReports}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                                }
                              />
                            </div>
                          </div>
                          <Button onClick={handleSaveNotifications} className="w-fit">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Preferências
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Tab: Aparência */}
                    <TabsContent value="appearance" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Tema e Aparência
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Tema Escuro</Label>
                              <p className="text-sm text-muted-foreground">
                                Alterne entre tema claro e escuro
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              <Switch
                                checked={isDarkMode}
                                onCheckedChange={toggleDarkMode}
                              />
                              <Moon className="h-4 w-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Tab: Dados */}
                    <TabsContent value="data" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Configurações de Dados
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Backup Automático</Label>
                                <p className="text-sm text-muted-foreground">
                                  Backup diário dos seus dados
                                </p>
                              </div>
                              <Switch
                                checked={dataSettings.autoBackup}
                                onCheckedChange={(checked) => 
                                  setDataSettings(prev => ({ ...prev, autoBackup: checked }))
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="retention">Período de Retenção (meses)</Label>
                                <Select
                                  value={dataSettings.retentionPeriod}
                                  onValueChange={(value) => 
                                    setDataSettings(prev => ({ ...prev, retentionPeriod: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3 meses</SelectItem>
                                    <SelectItem value="6">6 meses</SelectItem>
                                    <SelectItem value="12">12 meses</SelectItem>
                                    <SelectItem value="24">24 meses</SelectItem>
                                    <SelectItem value="-1">Ilimitado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="format">Formato de Exportação</Label>
                                <Select
                                  value={dataSettings.exportFormat}
                                  onValueChange={(value) => 
                                    setDataSettings(prev => ({ ...prev, exportFormat: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                                    <SelectItem value="json">JSON (.json)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Fuso Horário</Label>
                              <Select
                                value={dataSettings.timezone}
                                onValueChange={(value) => 
                                  setDataSettings(prev => ({ ...prev, timezone: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                                  <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                                  <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">Tóquio (UTC+9)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveDataSettings} className="w-fit">
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Configurações
                            </Button>
                            <Button onClick={handleExportData} variant="outline" className="w-fit">
                              <Download className="h-4 w-4 mr-2" />
                              Exportar Dados
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Tab: Segurança */}
                    <TabsContent value="security" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Chave de API
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="apiKey">Chave Atual</Label>
                            <div className="flex gap-2">
                              <Input
                                id="apiKey"
                                value={apiSettings.apiKey}
                                readOnly
                                className="font-mono"
                              />
                              <Button onClick={handleGenerateNewApiKey} variant="outline">
                                Gerar Nova
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="webhook">URL do Webhook</Label>
                            <Input
                              id="webhook"
                              placeholder="https://api.exemplo.com/webhook"
                              value={apiSettings.webhookUrl}
                              onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rateLimit">Limite de Requisições (por hora)</Label>
                            <Input
                              id="rateLimit"
                              type="number"
                              value={apiSettings.rateLimit}
                              onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: e.target.value }))}
                            />
                          </div>
                          <Button onClick={handleSaveApiSettings} className="w-fit">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Configurações
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-destructive">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Zona de Perigo
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Excluir Conta</Label>
                            <p className="text-sm text-muted-foreground">
                              Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir Conta
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                                  e removerá todos os seus dados dos nossos servidores.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteAccount}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sim, excluir conta
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
};

export default Settings;