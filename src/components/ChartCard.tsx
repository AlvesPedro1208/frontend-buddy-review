import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ChartCardProps {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie';
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: (id: string) => void;
  metric?: {
    value: string | number;
    change?: number;
    changeLabel?: string;
  };
  icon?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  id,
  title,
  type,
  children,
  removable = false,
  onRemove,
  metric,
  icon
}) => {
  const getChartIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'bar':
        return <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />;
      case 'line':
        return <LineChartIcon className="h-5 w-5 mr-2 text-green-600" />;
      case 'pie':
        return <PieChartIcon className="h-5 w-5 mr-2 text-purple-600" />;
      default:
        return <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />;
    }
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-500 dark:text-gray-400';
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change >= 0 
      ? <TrendingUp className="h-3 w-3 mr-1" />
      : <TrendingDown className="h-3 w-3 mr-1" />;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative dark:bg-gray-800 dark:border-gray-700 group">
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-gray-700"
          onClick={() => onRemove(id)}
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </Button>
      )}
      
      <CardHeader className={metric ? "pb-2" : "pb-4"}>
        <CardTitle className="flex items-center text-lg dark:text-gray-200">
          {getChartIcon()}
          {title}
        </CardTitle>
        
        {metric && (
          <div className="mt-2">
            <div className="text-2xl font-bold dark:text-white">
              {metric.value}
            </div>
            {metric.change !== undefined && (
              <p className={`text-xs flex items-center mt-1 ${getChangeColor(metric.change)}`}>
                {getChangeIcon(metric.change)}
                {metric.change >= 0 ? '+' : ''}{metric.change}% {metric.changeLabel || 'vs período anterior'}
              </p>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;