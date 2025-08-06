import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Globe, 
  CreditCard, 
  Settings, 
  Trash2,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NodeData extends Record<string, unknown> {
  label: string;
  category: 'TOPO' | 'MEIO' | 'FUNDO';
  description: string;
  config?: Record<string, any>;
}

const BaseNode = memo(({ 
  data, 
  id, 
  icon: Icon, 
  color, 
  onDelete 
}: NodeProps & { 
  icon: any; 
  color: string;
  onDelete?: (id: string) => void;
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TOPO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEIO': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FUNDO': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="min-w-[250px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${color}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{(data as NodeData).label}</h4>
              <Badge variant="outline" className={`text-xs ${getCategoryColor((data as NodeData).category)}`}>
                {(data as NodeData).category}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-3 w-3 mr-2" />
                Configurar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(id)}
                className="text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3">
          {(data as NodeData).description}
        </p>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Status:</div>
          <Badge variant="secondary" className="text-xs">
            Configurado
          </Badge>
        </div>
      </CardContent>

      {/* Handles para conexões */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground !border-2 !border-background !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground !border-2 !border-background !w-3 !h-3"
      />
    </Card>
  );
});

const FacebookAdsNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={Facebook} 
    color="bg-blue-500"
  />
));

const GoogleAdsNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={Globe} 
    color="bg-green-500"
  />
));

const VTurbNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={Settings} 
    color="bg-purple-500"
  />
));

const UTMifyNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={Settings} 
    color="bg-orange-500"
  />
));

const PaytNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={CreditCard} 
    color="bg-red-500"
  />
));

const CustomNode = memo((props: NodeProps) => (
  <BaseNode 
    {...props} 
    icon={Settings} 
    color="bg-gray-500"
  />
));

FacebookAdsNode.displayName = 'FacebookAdsNode';
GoogleAdsNode.displayName = 'GoogleAdsNode';
VTurbNode.displayName = 'VTurbNode';
UTMifyNode.displayName = 'UTMifyNode';
PaytNode.displayName = 'PaytNode';
CustomNode.displayName = 'CustomNode';

export const FunnelNodeTypes = {
  FacebookAdsNode,
  GoogleAdsNode,
  VTurbNode,
  UTMifyNode,
  PaytNode,
  CustomNode,
};