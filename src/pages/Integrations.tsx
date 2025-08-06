
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Facebook, 
  Globe, 
  Instagram, 
  Linkedin, 
  Plus,
  Settings,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const integrationCards = [
  {
    id: 'facebook-ads',
    title: 'Facebook Ads',
    description: 'Conecte suas contas automaticamente',
    icon: Facebook,
    color: 'bg-blue-600',
    status: 'available'
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    description: 'Importe dados de campanhas do Google Ads',
    icon: Globe,
    color: 'bg-green-600',
    status: 'available'
  },
  {
    id: 'instagram',
    title: 'Instagram Business',
    description: 'Importe métricas do Instagram Business',
    icon: Instagram,
    color: 'bg-pink-600',
    status: 'available'
  },
  {
    id: 'outras',
    title: 'Outras Plataformas',
    description: 'Conecte outras plataformas e ferramentas',
    icon: Settings,
    color: 'bg-purple-600',
    status: 'available'
  },
];

const Integrations: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte suas contas de anúncios e plataformas para importar dados automaticamente.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationCards.map((integration) => (
          <Card key={integration.id} className="relative hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${integration.color}`}>
                  <integration.icon className="h-6 w-6 text-white" />
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{integration.title}</CardTitle>
              <CardDescription className="text-sm">
                {integration.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Active Integrations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Integrações Ativas</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas conexões ativas</p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Selecionar usuário</SelectItem>
                <SelectItem value="user1">Usuário 1</SelectItem>
                <SelectItem value="user2">Usuário 2</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Buscar Contas
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Selecione um usuário</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Escolha um usuário para visualizar suas integrações.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;
