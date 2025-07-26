import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { AppSidebar } from '@/components/AppSidebar';
import { 
  Search, 
  Calendar,
  Trash2,
  Eye,
  Copy,
  Star,
  MoreVertical,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Badge } from '@/components/ui/badge';

interface SavedVisualization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  type: 'dashboard' | 'chart';
  tags: string[];
  isStarred: boolean;
  thumbnail: string;
  chartCount?: number;
}

const SavedVisualizations = () => {
  const { isDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data de visualizações salvas
  const savedVisualizations: SavedVisualization[] = [
    {
      id: '1',
      name: 'Dashboard de Vendas Q4',
      description: 'Análise completa das vendas do quarto trimestre com métricas de performance',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      type: 'dashboard',
      tags: ['vendas', 'trimestral', 'performance'],
      isStarred: true,
      thumbnail: 'dashboard-preview',
      chartCount: 8
    },
    {
      id: '2',
      name: 'Gráfico de Tráfego Web',
      description: 'Visualização do tráfego do website por fonte de origem',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18',
      type: 'chart',
      tags: ['web', 'tráfego', 'analytics'],
      isStarred: false,
      thumbnail: 'chart-preview',
    },
    {
      id: '3',
      name: 'Analytics de Marketing',
      description: 'Dashboard com métricas de campanhas de marketing digital',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19',
      type: 'dashboard',
      tags: ['marketing', 'campanhas', 'ROI'],
      isStarred: true,
      thumbnail: 'marketing-preview',
      chartCount: 12
    },
    {
      id: '4',
      name: 'Conversão de Leads',
      description: 'Funil de conversão e análise de leads por período',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-17',
      type: 'chart',
      tags: ['leads', 'conversão', 'funil'],
      isStarred: false,
      thumbnail: 'conversion-preview',
    },
    {
      id: '5',
      name: 'Dashboard Financeiro',
      description: 'Indicadores financeiros e controle de fluxo de caixa',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16',
      type: 'dashboard',
      tags: ['financeiro', 'fluxo-caixa', 'indicadores'],
      isStarred: false,
      thumbnail: 'financial-preview',
      chartCount: 6
    },
    {
      id: '6',
      name: 'Análise de Produto',
      description: 'Métricas de uso e engajamento do produto',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-15',
      type: 'dashboard',
      tags: ['produto', 'engajamento', 'uso'],
      isStarred: true,
      thumbnail: 'product-preview',
      chartCount: 9
    }
  ];

  const filteredVisualizations = savedVisualizations.filter(viz =>
    viz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    viz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    viz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDeleteVisualization = (id: string) => {
    console.log('Deletar visualização:', id);
  };

  const handleDuplicateVisualization = (id: string) => {
    console.log('Duplicar visualização:', id);
  };

  const handleToggleStar = (id: string) => {
    console.log('Toggle star:', id);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVisualizations.map((viz) => (
        <Card key={viz.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">
                  {viz.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {viz.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicateVisualization(viz.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteVisualization(viz.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Preview placeholder */}
            <div className={`h-32 rounded-lg mb-4 flex items-center justify-center text-muted-foreground ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              {viz.type === 'dashboard' ? '📊 Dashboard Preview' : '📈 Chart Preview'}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {viz.type === 'dashboard' ? `${viz.chartCount} gráficos` : 'Gráfico único'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleToggleStar(viz.id)}
                >
                  <Star 
                    className={`h-4 w-4 ${viz.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                  />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {viz.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {viz.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{viz.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Modificado: {formatDate(viz.updatedAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredVisualizations.map((viz) => (
        <Card key={viz.id} className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-muted-foreground ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  {viz.type === 'dashboard' ? '📊' : '📈'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">{viz.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {viz.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>
                      {viz.type === 'dashboard' ? `${viz.chartCount} gráficos` : 'Gráfico único'}
                    </span>
                    <span>Criado: {formatDate(viz.createdAt)}</span>
                    <span>Modificado: {formatDate(viz.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleToggleStar(viz.id)}
                >
                  <Star 
                    className={`h-4 w-4 ${viz.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                  />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateVisualization(viz.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteVisualization(viz.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">Visualizações Salvas</h1>
                      <p className="text-muted-foreground mt-1">
                        Gerencie e acesse suas dashboards e gráficos salvos
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-8 w-8 p-0"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-8 w-8 p-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Search and filters */}
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar visualizações..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  {filteredVisualizations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-semibold mb-2">Nenhuma visualização encontrada</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? 'Tente ajustar os termos de busca ou filtros.'
                          : 'Comece criando dashboards e gráficos para vê-los aqui.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">
                          {filteredVisualizations.length} visualização{filteredVisualizations.length !== 1 ? 'ões' : ''} encontrada{filteredVisualizations.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      {viewMode === 'grid' ? renderGridView() : renderListView()}
                    </>
                  )}
                </div>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
};

export default SavedVisualizations;