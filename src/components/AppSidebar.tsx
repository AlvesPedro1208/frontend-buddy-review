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
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
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
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/product"}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                        isActive 
                          ? "bg-accent text-accent-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible 
            open={integrationsOpen} 
            onOpenChange={handleIntegrationsToggle}
          >
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label cursor-pointer hover:text-foreground">
                <span>Integrações Ativas</span>
                <ChevronDown className={cn(
                  "ml-auto h-3 w-3 transition-transform duration-200",
                  integrationsOpen && "rotate-180"
                )} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {integrationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className="w-full pl-6">
                        <item.icon className="h-3 w-3 flex-shrink-0" />
                        <span className="text-sm">{item.title}</span>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}