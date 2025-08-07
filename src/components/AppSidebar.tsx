import { useState, useMemo, useCallback } from "react";
import {
  Settings,
  Database,
  BarChart3,
  Globe,
  Facebook,
  Instagram,
  Grid3x3,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plug,
  TrendingUp,
  BookmarkIcon,
  PanelLeftClose,
  PanelLeft,
  User,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const menuItems = [
  { title: "Dashboard", url: "/product", icon: BarChart3 },
  { title: "Visualizações Salvas", url: "/product/saved-visualizations", icon: BookmarkIcon },
  { title: "Fluxo de Funil", url: "/product/funnel-flow", icon: TrendingUp },
  { title: "Dados Disponíveis", url: "/product/meta/dados", icon: Database },
  { title: "Integrações", url: "/product/integrations", icon: Plug },
  { title: "Configurações", url: "/product/settings", icon: Settings },
] as const;

const integrationItems = [
  { title: "Facebook Ads", icon: Facebook },
  { title: "Google Ads", icon: Globe },
  { title: "Instagram", icon: Instagram },
  { title: "Outras Plataformas", icon: Grid3x3 },
] as const;

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();
  const [integrationsOpen, setIntegrationsOpen] = useState(true);
  const { user, logout } = useAuth();

  const currentPath = location.pathname;

  const isActive = useCallback((path: string) => {
    return currentPath === path || (path === "/product" && currentPath === "/product");
  }, [currentPath]);

  const handleIntegrationsToggle = useCallback(() => {
    setIntegrationsOpen(prev => !prev);
  }, []);

  return (
    <div className="h-full bg-card border-r border-border flex flex-col shadow-sm">
      {/* Header with Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">DashboardAI</span>
              <span className="text-xs text-muted-foreground">Analytics Platform</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 hover:bg-accent/50"
          >
            {state === "expanded" ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            Navegação
          </h3>
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/product"}
            >
              {({ isActive }) => (
                <div className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
                  )} />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Integrations Section */}
        <div className="space-y-2">
          <Collapsible 
            open={integrationsOpen} 
            onOpenChange={handleIntegrationsToggle}
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 group">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Integrações Ativas
                </span>
                <ChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                  integrationsOpen && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {integrationItems.map((item) => (
                <div 
                  key={item.title}
                  className="flex items-center gap-3 px-4 py-2.5 ml-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 cursor-pointer group border-l-2 border-border hover:border-primary/50"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Ativo</span>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-border bg-accent/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent/50 rounded-xl">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col items-start text-left flex-1">
                <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50 shadow-lg">
            <div className="flex items-center justify-start gap-3 p-3 bg-accent/30">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 m-1 rounded-md">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}