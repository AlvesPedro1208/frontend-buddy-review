import React, { useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { ChartWidget } from './ChartWidget';
import { DashboardItem } from '@/hooks/useDashboardLayout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  items: DashboardItem[];
  layouts?: any;
  onLayoutChange: (layouts: any) => void;
  onItemRemove?: (id: string) => void;
  isDarkMode?: boolean;
  isEditable?: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  layouts: savedLayouts,
  onLayoutChange,
  onItemRemove,
  isDarkMode = false,
  isEditable = true
}) => {
  // Convert dashboard items to grid layouts and merge with saved layouts
  const layouts = useMemo(() => {
    const gridLayouts = items.map(item => ({
      i: item.id,
      x: item.layout.x,
      y: item.layout.y,
      w: item.layout.w,
      h: item.layout.h,
      minW: 2,
      minH: 2,
      maxW: 12,
      maxH: 8
    }));
    
    // Use saved layouts if available, otherwise use generated layouts
    return {
      lg: savedLayouts?.lg?.length > 0 ? savedLayouts.lg : gridLayouts,
      md: savedLayouts?.md?.length > 0 ? savedLayouts.md : gridLayouts.map(layout => ({ ...layout, w: Math.min(layout.w, 8) })),
      sm: savedLayouts?.sm?.length > 0 ? savedLayouts.sm : gridLayouts.map(layout => ({ ...layout, w: Math.min(layout.w, 6) })),
      xs: savedLayouts?.xs?.length > 0 ? savedLayouts.xs : gridLayouts.map(layout => ({ ...layout, w: 4, x: 0 })),
      xxs: savedLayouts?.xxs?.length > 0 ? savedLayouts.xxs : gridLayouts.map(layout => ({ ...layout, w: 2, x: 0 }))
    };
  }, [items, savedLayouts]);

  const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  };

  const cols = {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  };

  const handleLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    // Save all breakpoint layouts
    onLayoutChange(allLayouts);
  };

  return (
    <div className="dashboard-grid-container">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".cursor-move"
        resizeHandles={['se', 'e', 's']}
        compactType="vertical"
        preventCollision={false}
      >
        {items.map((item) => (
          <div key={item.id} className="grid-item group">
            <ChartWidget
              id={item.id}
              title={item.title}
              type={item.type === 'custom' ? 'chart' : item.type}
              chartType={item.chartType}
              data={item.data}
              config={item.config}
              onRemove={onItemRemove}
              isDarkMode={isDarkMode}
              className="h-full"
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      <style>{`
        .dashboard-grid-container {
          position: relative;
          background: #f8fafc;
        }

        .dark .dashboard-grid-container {
          background: #0f172a;
        }

        .react-grid-layout {
          position: relative;
          min-height: 100vh;
        }

        .react-grid-item {
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          transition-property: left, top, transform;
        }

        .react-grid-item.cssTransforms {
          transition-property: transform;
        }

        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          padding: 0 3px 3px 0;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .react-grid-item:hover > .react-resizable-handle {
          opacity: 1;
        }

        .react-grid-item.react-grid-placeholder {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          opacity: 0.15;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
          border-radius: 12px;
          border: 2px dashed rgba(79, 70, 229, 0.4);
        }

        .react-grid-item > .react-resizable-handle::after {
          content: '';
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 12px;
          height: 12px;
          background: #6b7280;
          border-radius: 2px;
          opacity: 0.6;
          mask: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3e%3cpath d='M6 9l6 6 6-6' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e") no-repeat center;
          mask-size: contain;
          transform: rotate(-45deg);
        }

        .dark .react-grid-item > .react-resizable-handle::after {
          background: #9ca3af;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
          transform: rotate(2deg) !important;
        }

        .react-grid-item.react-resizable-resizing {
          transition: none;
          z-index: 3;
        }

        /* Grid item container */
        .grid-item {
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
        }

        .grid-item:hover {
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
        }

        .dark .grid-item {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        }

        .dark .grid-item:hover {
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.4);
        }

        /* Handle do drag - estilo Metabase */
        .cursor-move {
          cursor: grab;
        }

        .cursor-move:active {
          cursor: grabbing;
        }

        /* Melhor indicador de resize */
        .react-grid-item > .react-resizable-handle {
          background: linear-gradient(135deg, transparent 40%, #e5e7eb 40%, #e5e7eb 60%, transparent 60%);
          background-size: 8px 8px;
          background-position: right bottom;
        }

        .dark .react-grid-item > .react-resizable-handle {
          background: linear-gradient(135deg, transparent 40%, #374151 40%, #374151 60%, transparent 60%);
          background-size: 8px 8px;
          background-position: right bottom;
        }
      `}</style>
    </div>
  );
};