import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardGrid } from '@/components/DashboardGrid';
import { useDashboardLayout, DashboardItem } from '@/hooks/useDashboardLayout';
import { 
  Send, 
  Upload, 
  FileUp,
  Link,
  X,
  Moon,
  Sun,
  ArrowLeft,
  Plug,
  Menu
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'Seja bem vindo a Lux, sua IA analista de dados e especialista em Business Intelligence!😉 Faça upload de uma planilha e me peça para criar visualizações dos seus dados!' },
  ]);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url' | 'api'>('file');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState('');
  const [selectedFacebookUser, setSelectedFacebookUser] = useState('');
  const [selectedAdAccount, setSelectedAdAccount] = useState('');
  const [lastUploadedSheet, setLastUploadedSheet] = useState<{ url?: string; file?: File | null }>({});
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Mock data
  const salesData = [
    { month: 'Jan', sales: 89500, visitors: 24700 },
    { month: 'Fev', sales: 67200, visitors: 18900 },
    { month: 'Mar', sales: 78900, visitors: 22100 },
    { month: 'Apr', sales: 85600, visitors: 25300 },
    { month: 'Mai', sales: 92400, visitors: 28600 },
    { month: 'Jun', sales: 71800, visitors: 21400 }
  ];

  const trafficData = [
    { name: 'Google', value: 4700, color: '#3B82F6' },
    { name: 'Facebook', value: 3400, color: '#8B5CF6' },
    { name: 'Direct', value: 2800, color: '#10B981' },
    { name: 'Others', value: 1900, color: '#F59E0B' }
  ];

  const dailyVisitors = [
    { day: 1, visitors: 150 }, { day: 2, visitors: 200 }, { day: 3, visitors: 180 },
    { day: 4, visitors: 220 }, { day: 5, visitors: 190 }, { day: 6, visitors: 250 },
    { day: 7, visitors: 280 }, { day: 8, visitors: 100 }, { day: 9, visitors: 210 },
    { day: 10, visitors: 400 }, { day: 11, visitors: 270 }, { day: 12, visitors: 110 },
    { day: 13, visitors: 120 }, { day: 14, visitors: 200 }, { day: 15, visitors: 180 }
  ];

  // Mock data for Facebook users and ad accounts
  const facebookUsers = [
    { id: 'user1', name: 'João Silva (joao@empresa.com)' },
    { id: 'user2', name: 'Maria Santos (maria@marketing.com)' },
    { id: 'user3', name: 'Pedro Costa (pedro@agencia.com)' }
  ];

  const adAccountsByUser = {
    'user1': [
      { id: 'act_123456789', name: 'Loja Virtual - Vendas Online' },
      { id: 'act_123456790', name: 'Campanha Black Friday' }
    ],
    'user2': [
      { id: 'act_987654321', name: 'Marketing Digital - Leads' },
      { id: 'act_987654322', name: 'Branding - Awareness' }
    ],
    'user3': [
      { id: 'act_555444333', name: 'Agência - Cliente A' },
      { id: 'act_555444334', name: 'Agência - Cliente B' },
      { id: 'act_555444335', name: 'Agência - Cliente C' }
    ]
  };

  // Initialize dashboard with default items
  const initialDashboardItems: DashboardItem[] = [
    {
      id: 'metric-1',
      type: 'metric',
      title: 'Visitantes Únicos',
      layout: { x: 0, y: 0, w: 3, h: 2 }
    },
    {
      id: 'metric-2',
      type: 'metric',
      title: 'Total Pageviews',
      layout: { x: 3, y: 0, w: 3, h: 2 }
    },
    {
      id: 'metric-3',
      type: 'metric',
      title: 'Taxa de Rejeição',
      layout: { x: 6, y: 0, w: 3, h: 2 }
    },
    {
      id: 'metric-4',
      type: 'metric',
      title: 'Duração da Visita',
      layout: { x: 9, y: 0, w: 3, h: 2 }
    },
    {
      id: 'sales-chart',
      type: 'chart',
      chartType: 'bar',
      title: 'Vendas por Mês',
      data: salesData,
      config: { xKey: 'month', yKey: 'sales' },
      layout: { x: 0, y: 2, w: 6, h: 4 }
    },
    {
      id: 'traffic-chart',
      type: 'chart',
      chartType: 'pie',
      title: 'Fontes de Tráfego',
      data: trafficData,
      config: { dataKey: 'value' },
      layout: { x: 6, y: 2, w: 6, h: 4 }
    },
    {
      id: 'daily-visitors-chart',
      type: 'chart',
      chartType: 'line',
      title: 'Visitantes Diários - Últimos 15 dias',
      data: dailyVisitors,
      config: { xKey: 'day', yKey: 'visitors' },
      layout: { x: 0, y: 6, w: 12, h: 4 }
    }
  ];

  const { items: dashboardItems, addItem, removeItem, updateLayouts } = useDashboardLayout(initialDashboardItems);

  const isChartRequest = (pergunta: string): boolean => {
    const chartKeywords = [
      'gráfico', 'grafico', 'chart', 'visualização', 'visualizacao',
      'plot', 'dashboard', 'barra', 'linha', 'pizza', 'pie',
      'bar', 'line', 'mostrar', 'plotar', 'criar gráfico'
    ];
    
    return chartKeywords.some(keyword => 
      pergunta.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', content: message }]);
    const currentMessage = message;
    setMessage('');
    setIsAiLoading(true);

    try {
      if (isChartRequest(currentMessage) && (lastUploadedSheet.url || lastUploadedSheet.file)) {
        await Promise.all([
          handleChartRequest(currentMessage),
          handleRegularRequest(currentMessage)
        ]);
      } else {
        await handleRegularRequest(currentMessage);
      }
    } catch (error) {
      console.error('Erro geral:', error);
      setChatMessages(prev => [...prev, { type: 'ai', content: 'Erro ao se comunicar com o servidor.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleChartRequest = async (pergunta: string) => {
    try {
      const body = {
        pedido: pergunta,
        google_sheets_url: lastUploadedSheet.url || undefined
      };

      const response = await fetch('http://127.0.0.1:8000/gerar-grafico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const chartConfig = await response.json();

      if (chartConfig && chartConfig.type) {
        const newChart: DashboardItem = {
          id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'chart',
          chartType: chartConfig.type,
          title: chartConfig.title || 'Gráfico Gerado',
          data: chartConfig.data || [],
          config: chartConfig.config,
          layout: { x: 0, y: 0, w: 6, h: 4 }
        };

        addItem(newChart);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: `📊 Gráfico "${newChart.title}" foi adicionado à dashboard!`
        }]);
      } else {
        console.error('Erro na configuração do gráfico:', chartConfig);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: 'Não foi possível gerar o gráfico solicitado. Tente reformular sua pergunta.'
        }]);
      }
    } catch (error) {
      console.error('Erro ao gerar gráfico:', error);
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: 'Ocorreu um erro ao gerar o gráfico.'
      }]);
    }
  };

  const handleRegularRequest = async (pergunta: string) => {
    try {
      let formData = new FormData();
      formData.append('pergunta', pergunta);

      if (lastUploadedSheet.url) {
        formData.append('google_sheets_url', lastUploadedSheet.url);
      } else if (lastUploadedSheet.file) {
        formData.append('file', lastUploadedSheet.file);
      }

      const response = await fetch('http://127.0.0.1:8000/perguntar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.resposta) {
        setChatMessages(prev => [...prev, { type: 'ai', content: data.resposta }]);
      } else {
        setChatMessages(prev => [...prev, { type: 'ai', content: 'Ocorreu um erro ao obter a resposta.' }]);
      }
    } catch (error) {
      console.error('Erro na pergunta regular:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    setIsUploadDialogOpen(false);
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: 'Processando a planilha, um momento...'
    }]);

    try {
      const formData = new FormData();

      if (uploadType === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else if (uploadType === 'url' && spreadsheetUrl) {
        formData.append('google_sheets_url', spreadsheetUrl);
      } else {
        return;
      }

      const previewResponse = await fetch('http://127.0.0.1:8000/preview', {
        method: 'POST',
        body: formData,
      });

      const previewData = await previewResponse.json();

      if (previewData?.columns && previewData?.data?.length > 0) {
        const html = generateHtmlTable(previewData.columns, previewData.data);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: `<p><strong>Prévia da planilha carregada:</strong></p>${html}<p>Agora você pode me pedir para criar gráficos baseados nos seus dados! Por exemplo: "Crie um gráfico de barras dos valores por categoria" ou "Mostre um gráfico de pizza da distribuição de dados".</p>`
        }]);

        setLastUploadedSheet({
          file: uploadType === 'file' ? selectedFile : null,
          url: uploadType === 'url' ? spreadsheetUrl : undefined,
        });
      } else {
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: 'Não foi possível gerar a prévia da planilha.'
        }]);
      }

    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: 'Erro ao se comunicar com o servidor. Verifique a conexão.'
      }]);
    }

    setSelectedFile(null);
    setSpreadsheetUrl('');
  };

  function generateHtmlTable(columns: string[], data: any[]): string {
    const headers = columns.map(col => `<th class="px-3 py-2 text-left font-medium text-sm text-gray-600">${col}</th>`).join('');
    const rows = data.slice(0, 10).map(row => {
      const cells = columns.map(col => `<td class="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">${row[col] ?? ''}</td>`).join('');
      return `<tr class="border-t">${cells}</tr>`;
    }).join('');

    return `
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded-md overflow-hidden shadow-sm text-sm">
          <thead class="bg-gray-100">
            <tr>${headers}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        ${data.length > 10 ? `<p class="text-xs text-gray-500 mt-2">Mostrando 10 de ${data.length} registros</p>` : ''}
      </div>
    `;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-gray-900 transition-colors">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-4 w-4" />
                </SidebarTrigger>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DashboardAI
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Analytics Dashboard</div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600" />
                  )}
                </Button>

                {/* Voltar Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>

                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      <Upload className="w-4 h-4 mr-2" />
                      Nova Planilha
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Carregar Nova Planilha</DialogTitle>
                      <DialogDescription className="dark:text-gray-300">
                        Escolha como você gostaria de adicionar sua planilha para análise.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Toggle between file, URL and API */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={uploadType === 'file' ? 'default' : 'outline'}
                          onClick={() => setUploadType('file')}
                          className="flex-1"
                        >
                          <FileUp className="w-4 h-4 mr-2" />
                          Arquivo Local
                        </Button>
                        <Button
                          variant={uploadType === 'url' ? 'default' : 'outline'}
                          onClick={() => setUploadType('url')}
                          className="flex-1"
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Link/URL
                        </Button>
                        <Button
                          variant={uploadType === 'api' ? 'default' : 'outline'}
                          onClick={() => setUploadType('api')}
                          className="flex-1"
                        >
                          <Plug className="w-4 h-4 mr-2" />
                          API
                        </Button>
                      </div>

                      {/* File upload */}
                      {uploadType === 'file' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium dark:text-gray-200">Selecionar arquivo</label>
                          <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                          {selectedFile && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Arquivo selecionado: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      )}

                      {/* URL input */}
                      {uploadType === 'url' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium dark:text-gray-200">URL do Google Sheets</label>
                          <Input
                            type="url"
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            value={spreadsheetUrl}
                            onChange={(e) => setSpreadsheetUrl(e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      )}

                      {/* API integrations */}
                      {uploadType === 'api' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-gray-200">Selecionar Integração</label>
                            <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
                              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                                <SelectValue placeholder="Escolha uma integração" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facebook-ads-1">Meta Ads (Facebook/Instagram)</SelectItem>
                                <SelectItem value="google-ads-1">Google Ads</SelectItem>
                                <SelectItem value="google-analytics-1">Google Analytics</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedIntegration === 'facebook-ads-1' && (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm font-medium dark:text-gray-200">Usuário Facebook</label>
                                <Select value={selectedFacebookUser} onValueChange={setSelectedFacebookUser}>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Selecione um usuário" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {facebookUsers.map(user => (
                                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {selectedFacebookUser && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium dark:text-gray-200">Conta de Anúncios</label>
                                  <Select value={selectedAdAccount} onValueChange={setSelectedAdAccount}>
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                                      <SelectValue placeholder="Selecione uma conta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {adAccountsByUser[selectedFacebookUser as keyof typeof adAccountsByUser]?.map(account => (
                                        <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <Button 
                        onClick={handleUploadSubmit}
                        disabled={
                          (uploadType === 'file' && !selectedFile) || 
                          (uploadType === 'url' && !spreadsheetUrl) ||
                          (uploadType === 'api' && !selectedIntegration) ||
                          (uploadType === 'api' && selectedIntegration === 'facebook-ads-1' && (!selectedFacebookUser || !selectedAdAccount))
                        }
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadType === 'api' ? 'Importar Dados' : 'Carregar Planilha'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          <div className="flex h-[calc(100vh-80px)]">
            {/* Main Dashboard */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Analytics</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Arraste e redimensione os widgets para personalizar seu dashboard
                  </p>
                </div>

                {/* Dynamic Dashboard Grid */}
                <DashboardGrid
                  items={dashboardItems}
                  onLayoutChange={updateLayouts}
                  onItemRemove={removeItem}
                  isDarkMode={isDarkMode}
                  isEditable={true}
                />
              </div>
            </div>

            {/* Chat Panel */}
            <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">🤖 Assistente IA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Converse com a IA para criar visualizações</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                    disabled={isAiLoading}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!message.trim() || isAiLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Product;