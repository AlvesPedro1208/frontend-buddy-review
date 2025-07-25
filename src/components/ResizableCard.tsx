import React, { useState } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import 'react-resizable/css/styles.css';

interface ResizableCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

export const ResizableCard: React.FC<ResizableCardProps> = ({
  id,
  title,
  children,
  onRemove,
  initialWidth = 400,
  initialHeight = 350,
  minWidth = 300,
  minHeight = 250,
  maxWidth = 800,
  maxHeight = 600,
  className = ""
}) => {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);

  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    setSize(size);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize({ width: initialWidth, height: initialHeight });
    } else {
      setSize({ width: maxWidth, height: maxHeight });
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div className={`relative ${className}`}>
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[minWidth, minHeight]}
        maxConstraints={[maxWidth, maxHeight]}
        onResize={handleResize}
        resizeHandles={['se', 'e', 's']}
        className="resizable-card-container"
      >
        <Card className="h-full w-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaximize}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <div className="h-full w-full overflow-auto">
              {children}
            </div>
          </CardContent>
        </Card>
      </ResizableBox>
      
      {/* Resize Handle Styles */}
      <style>{`
        .resizable-card-container .react-resizable-handle {
          background: none !important;
          border: none !important;
        }
        
        .resizable-card-container .react-resizable-handle-se {
          bottom: 0;
          right: 0;
          width: 20px;
          height: 20px;
          background: linear-gradient(-45deg, transparent 40%, #9CA3AF 40%, #9CA3AF 60%, transparent 60%);
          cursor: se-resize;
        }
        
        .resizable-card-container .react-resizable-handle-e {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 20px;
          background: #9CA3AF;
          cursor: e-resize;
          border-radius: 2px 0 0 2px;
          opacity: 0.7;
        }
        
        .resizable-card-container .react-resizable-handle-s {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 10px;
          background: #9CA3AF;
          cursor: s-resize;
          border-radius: 2px 2px 0 0;
          opacity: 0.7;
        }
        
        .resizable-card-container:hover .react-resizable-handle-e,
        .resizable-card-container:hover .react-resizable-handle-s {
          opacity: 1;
        }
        
        .dark .resizable-card-container .react-resizable-handle-se {
          background: linear-gradient(-45deg, transparent 40%, #6B7280 40%, #6B7280 60%, transparent 60%);
        }
        
        .dark .resizable-card-container .react-resizable-handle-e,
        .dark .resizable-card-container .react-resizable-handle-s {
          background: #6B7280;
        }
      `}</style>
    </div>
  );
};