
import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Facebook, 
  Globe, 
  CreditCard, 
  Plus, 
  Save, 
  Download, 
  Upload,
  Settings,
  Trash2
} from "lucide-react";
import { FunnelNodeTypes } from "@/components/FunnelFlow/FunnelNodeTypes";
import { toast } from "sonner";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const createNodeTypes = (deleteNode: (id: string) => void) => ({
  facebookAds: (props: any) => <FunnelNodeTypes.FacebookAdsNode {...props} onDelete={deleteNode} />,
  googleAds: (props: any) => <FunnelNodeTypes.GoogleAdsNode {...props} onDelete={deleteNode} />,
  vturb: (props: any) => <FunnelNodeTypes.VTurbNode {...props} onDelete={deleteNode} />,
  utmify: (props: any) => <FunnelNodeTypes.UTMifyNode {...props} onDelete={deleteNode} />,
  payt: (props: any) => <FunnelNodeTypes.PaytNode {...props} onDelete={deleteNode} />,
  custom: (props: any) => <FunnelNodeTypes.CustomNode {...props} onDelete={deleteNode} />,
});

export default function FunnelFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    toast.success('Nó removido do fluxo');
  }, [setNodes, setEdges]);

  const nodeTypes = useMemo(() => createNodeTypes(deleteNode), [deleteNode]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTemplates = useMemo(() => [
    {
      id: 'facebook-ads',
      type: 'facebookAds',
      label: 'Facebook Ads',
      icon: Facebook,
      category: 'TOPO',
      description: 'Extração de dados de campanhas do Facebook',
      color: 'bg-blue-500',
    },
    {
      id: 'google-ads', 
      type: 'googleAds',
      label: 'Google Ads',
      icon: Globe,
      category: 'TOPO',
      description: 'Extração de dados de campanhas do Google',
      color: 'bg-green-500',
    },
    {
      id: 'vturb',
      type: 'vturb', 
      label: 'VTurb',
      icon: Settings,
      category: 'MEIO',
      description: 'Dados da plataforma VTurb',
      color: 'bg-purple-500',
    },
    {
      id: 'utmify',
      type: 'utmify',
      label: 'UTMify', 
      icon: Settings,
      category: 'MEIO',
      description: 'Dados da plataforma UTMify',
      color: 'bg-orange-500',
    },
    {
      id: 'payt',
      type: 'payt',
      label: 'Payt',
      icon: CreditCard,
      category: 'FUNDO',
      description: 'Dados do checkout Payt',
      color: 'bg-red-500',
    },
  ], []);

  const addNode = useCallback((template: typeof nodeTemplates[0]) => {
    const newNode: Node = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { 
        label: template.label,
        category: template.category,
        description: template.description,
        config: {}
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
    toast.success(`${template.label} adicionado ao fluxo`);
  }, [setNodes]);

  const saveFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    // Aqui você pode fazer uma chamada para sua API backend
    console.log('Salvando fluxo:', flowData);
    toast.success('Fluxo salvo com sucesso!');
  }, [nodes, edges]);

  const exportFlow = useCallback(() => {
    const flowData = { nodes, edges };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'funil-flow.json';
    link.click();
    
    toast.success('Fluxo exportado!');
  }, [nodes, edges]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-12 flex items-center border-b px-4 bg-background">
              <h1 className="text-lg font-semibold">Fluxo de Funil</h1>
            </div>
            
            <div className="flex-1 flex">
              {/* Main Flow Editor */}
              <div className="flex-1 flex flex-col">
                {/* Action Buttons Header */}
                <div className="h-14 border-b border-border flex items-center justify-end px-6">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportFlow}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar
                    </Button>
                    <Button size="sm" onClick={saveFlow}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Fluxo
                    </Button>
                  </div>
                </div>

                {/* React Flow Editor */}
                <div className="flex-1 relative">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    className="bg-background"
                  >
                    <Background />
                  </ReactFlow>
                  
                  {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Card className="p-8 text-center max-w-md">
                        <CardContent>
                          <div className="text-muted-foreground">
                            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">Crie seu fluxo de funil</h3>
                            <p className="text-sm">
                              Adicione componentes da barra lateral para começar a construir 
                              seu fluxo de extração de dados.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Components */}
              <div className="w-80 border-l border-border bg-background p-4 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      COMPONENTES DO FUNIL
                    </h3>
                    
                    <div className="space-y-4">
                      {['TOPO', 'MEIO', 'FUNDO'].map((category) => (
                        <div key={category}>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {nodeTemplates
                              .filter((template) => template.category === category)
                              .map((template) => (
                                <Card 
                                  key={template.id}
                                  className="cursor-pointer hover:bg-accent transition-colors"
                                  onClick={() => addNode(template)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-start gap-3">
                                      <div className={`p-1.5 rounded ${template.color}`}>
                                        <template.icon className="h-4 w-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-medium truncate">
                                          {template.label}
                                        </h5>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {template.description}
                                        </p>
                                        <Badge variant="secondary" className="mt-2 text-xs">
                                          {template.category}
                                        </Badge>
                                      </div>
                                      <Plus className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flow Statistics */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Estatísticas do Fluxo</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Nós totais:</span>
                        <span className="font-medium">{nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conexões:</span>
                        <span className="font-medium">{edges.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TOPO:</span>
                        <span className="font-medium">
                          {nodes.filter(n => n.data.category === 'TOPO').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>MEIO:</span>
                        <span className="font-medium">
                          {nodes.filter(n => n.data.category === 'MEIO').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>FUNDO:</span>
                        <span className="font-medium">
                          {nodes.filter(n => n.data.category === 'FUNDO').length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
