import { useState, useMemo, useCallback } from "react";
import {
  Settings,
  Database,
  BarChart3,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plug,
  TrendingUp,
  BookmarkIcon
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
  { title: "LinkedIn Ads", icon: Linkedin },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const [integrationsOpen, setIntegrationsOpen] = useState(true);

  const currentPath = location.pathname;

  const isActive = useCallback((path: string) => {
    return currentPath === path || (path === "/product" && currentPath === "/product");
  }, [currentPath]);

  const handleIntegrationsToggle = useCallback(() => {
    setIntegrationsOpen(prev => !prev);
  }, []);

  return (
    <div className="h-full bg-background border-r border-border flex flex-col">
      {/* Header with Toggle */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
        <SidebarTrigger />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
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
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-accent text-accent-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.title}</span>
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
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-200">
                <span>Integrações Ativas</span>
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  integrationsOpen && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {integrationItems.map((item) => (
                <div 
                  key={item.title}
                  className="flex items-center gap-3 px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded-md transition-all duration-200 cursor-pointer"
                >
                  <item.icon className="h-3 w-3 flex-shrink-0" />
                  <span>{item.title}</span>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}