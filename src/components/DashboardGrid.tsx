import React, { useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { ChartWidget } from './ChartWidget';
import { DashboardItem } from '@/hooks/useDashboardLayout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  items: DashboardItem[];
  onLayoutChange: (layouts: Layout[]) => void;
  onItemRemove?: (id: string) => void;
  isDarkMode?: boolean;
  isEditable?: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  onLayoutChange,
  onItemRemove,
  isDarkMode = false,
  isEditable = true
}) => {
  // Convert dashboard items to grid layouts
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
    
    return {
      lg: gridLayouts,
      md: gridLayouts,
      sm: gridLayouts.map(layout => ({ ...layout, w: Math.min(layout.w, 6) })),
      xs: gridLayouts.map(layout => ({ ...layout, w: 4, x: 0 })),
      xxs: gridLayouts.map(layout => ({ ...layout, w: 2, x: 0 }))
    };
  }, [items]);

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

  const handleLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    // Update the current breakpoint layout
    onLayoutChange(layout);
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
        }

        .react-grid-layout {
          position: relative;
        }

        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
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
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjNmI3MjgwIiBvcGFjaXR5PSIwLjQiLz4KPHN2Zz4K');
          background-position: bottom right;
          padding: 0 3px 3px 0;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .react-grid-item:hover > .react-resizable-handle {
          opacity: 1;
        }

        .react-grid-item.react-grid-placeholder {
          background: #3B82F6;
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
          border-radius: 8px;
        }

        .react-grid-item > .react-resizable-handle::after {
          content: '';
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid rgba(0, 0, 0, 0.4);
          border-bottom: 2px solid rgba(0, 0, 0, 0.4);
        }

        .dark .react-grid-item > .react-resizable-handle::after {
          border-right: 2px solid rgba(255, 255, 255, 0.4);
          border-bottom: 2px solid rgba(255, 255, 255, 0.4);
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
        }

        .react-grid-item.react-resizable-resizing {
          transition: none;
          z-index: 3;
        }

        /* Custom styles for better UX */
        .grid-item {
          overflow: hidden;
          border-radius: 8px;
        }

        .react-grid-item.react-grid-placeholder {
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};