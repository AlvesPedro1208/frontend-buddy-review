import { useState, useCallback, useEffect } from 'react';

export interface DashboardItem {
  id: string;
  type: 'chart' | 'metric' | 'custom';
  title: string;
  data?: any;
  chartType?: 'bar' | 'line' | 'pie';
  config?: any;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface LayoutsByBreakpoint {
  lg: any[];
  md: any[];
  sm: any[];
  xs: any[];
  xxs: any[];
}

export const useDashboardLayout = (initialItems: DashboardItem[] = []) => {
  const [items, setItems] = useState<DashboardItem[]>(initialItems);
  const [layouts, setLayouts] = useState<LayoutsByBreakpoint>({
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: []
  });

  // Load layouts from localStorage on mount
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboard-layouts');
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (error) {
        console.warn('Failed to parse saved layouts:', error);
      }
    }
  }, []);

  // Save layouts to localStorage when they change
  const saveLayoutsToStorage = useCallback((newLayouts: LayoutsByBreakpoint) => {
    localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts));
    setLayouts(newLayouts);
  }, []);

  const addItem = useCallback((newItem: Omit<DashboardItem, 'layout'>) => {
    const newLayout = findOptimalPosition(items);
    const item: DashboardItem = {
      ...newItem,
      layout: newLayout
    };
    setItems(prev => [...prev, item]);
  }, [items]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    // Also remove from saved layouts
    const updatedLayouts = { ...layouts };
    Object.keys(updatedLayouts).forEach(breakpoint => {
      updatedLayouts[breakpoint as keyof LayoutsByBreakpoint] = 
        updatedLayouts[breakpoint as keyof LayoutsByBreakpoint].filter((layout: any) => layout.i !== id);
    });
    saveLayoutsToStorage(updatedLayouts);
  }, [layouts, saveLayoutsToStorage]);

  const updateItemLayout = useCallback((id: string, layout: { x: number; y: number; w: number; h: number }) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, layout } : item
    ));
  }, []);

  const updateLayouts = useCallback((newLayouts: LayoutsByBreakpoint) => {
    saveLayoutsToStorage(newLayouts);
    
    // Update items with the current layout info
    setItems(prev => prev.map(item => {
      // Use lg layout as default
      const newLayout = newLayouts.lg.find((l: any) => l.i === item.id);
      return newLayout ? { ...item, layout: newLayout } : item;
    }));
  }, [saveLayoutsToStorage]);

  return {
    items,
    layouts,
    addItem,
    removeItem,
    updateItemLayout,
    updateLayouts
  };
};

// Função para encontrar posição ótima para novos itens
const findOptimalPosition = (existingItems: DashboardItem[]): { x: number; y: number; w: number; h: number } => {
  const defaultSize = { w: 6, h: 4 };
  
  if (existingItems.length === 0) {
    return { x: 0, y: 0, ...defaultSize };
  }

  // Encontra a posição mais baixa disponível
  const maxY = Math.max(...existingItems.map(item => item.layout.y + item.layout.h));
  
  return {
    x: 0,
    y: maxY,
    ...defaultSize
  };
};