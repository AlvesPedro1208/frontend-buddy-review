import { useState, useCallback } from 'react';

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

export const useDashboardLayout = (initialItems: DashboardItem[] = []) => {
  const [items, setItems] = useState<DashboardItem[]>(initialItems);

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
  }, []);

  const updateItemLayout = useCallback((id: string, layout: { x: number; y: number; w: number; h: number }) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, layout } : item
    ));
  }, []);

  const updateLayouts = useCallback((layouts: any[]) => {
    setItems(prev => prev.map(item => {
      const newLayout = layouts.find(l => l.i === item.id);
      return newLayout ? { ...item, layout: newLayout } : item;
    }));
  }, []);

  return {
    items,
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