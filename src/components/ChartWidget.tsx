import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  GripVertical,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Eye,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartWidgetProps {
  id: string;
  title: string;
  type: 'chart' | 'metric';
  chartType?: 'bar' | 'line' | 'pie';
  data?: any;
  config?: any;
  onRemove?: (id: string) => void;
  isDarkMode?: boolean;
  className?: string;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  id,
  title,
  type,
  chartType,
  data,
  config,
  onRemove,
  isDarkMode = false,
  className = ""
}) => {
  const renderChart = () => {
    if (type === 'metric') {
      // Render metric cards
      return renderMetricContent();
    }

    if (!data || !chartType) return <div className="flex items-center justify-center h-full text-gray-500">Dados não disponíveis</div>;

    const colors = config?.colors || ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey={config?.xKey || 'name'} tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Bar 
                dataKey={config?.yKey || 'value'} 
                fill={colors[0]} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey={config?.xKey || 'name'} tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={config?.yKey || 'value'} 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey={config?.dataKey || 'value'}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="flex items-center justify-center h-full text-gray-500">Tipo de gráfico não suportado</div>;
    }
  };

  const renderMetricContent = () => {
    // Render different metric types based on title
    const getMetricIcon = () => {
      if (title.includes('Visitantes')) return <Users className="h-6 w-6 text-blue-600" />;
      if (title.includes('Pageviews')) return <Eye className="h-6 w-6 text-purple-600" />;
      if (title.includes('Rejeição')) return <BarChart3 className="h-6 w-6 text-red-600" />;
      if (title.includes('Duração')) return <Clock className="h-6 w-6 text-green-600" />;
      return <TrendingUp className="h-6 w-6 text-blue-600" />;
    };

    const getMetricValue = () => {
      if (title.includes('Visitantes')) return '24.7K';
      if (title.includes('Pageviews')) return '55.9K';
      if (title.includes('Rejeição')) return '54%';
      if (title.includes('Duração')) return '2m 56s';
      return '0';
    };

    const getMetricChange = () => {
      if (title.includes('Visitantes')) return '+20% vs mês anterior';
      if (title.includes('Pageviews')) return '+4% vs mês anterior';
      if (title.includes('Rejeição')) return '-1.5% vs mês anterior';
      if (title.includes('Duração')) return '+7% vs mês anterior';
      return '+0% vs mês anterior';
    };

    const isPositive = !title.includes('Rejeição');

    return (
      <div className="flex flex-col h-full p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </div>
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {getMetricIcon()}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {getMetricValue()}
          </div>
          <div className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            {getMetricChange()}
          </div>
        </div>
      </div>
    );
  };

  const getChartIcon = () => {
    if (type === 'metric') return null;
    if (chartType === 'bar') return <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />;
    if (chartType === 'line') return <LineChartIcon className="h-5 w-5 mr-2 text-green-600" />;
    if (chartType === 'pie') return <PieChartIcon className="h-5 w-5 mr-2 text-purple-600" />;
    return null;
  };

  return (
    <Card className={`h-full w-full group bg-white dark:bg-gray-900 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden ${className}`}>
      {/* Widget Header - Estilo Metabase */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center cursor-move flex-1">
          <div className="flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-2">
            <GripVertical className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate flex items-center">
            {type === 'chart' && getChartIcon()}
            {title}
          </h3>
        </div>
        
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md"
          >
            <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
          </Button>
        )}
      </div>

      {/* Widget Content */}
      <div className="p-4 h-[calc(100%-60px)] bg-white dark:bg-gray-900">
        <div className="h-full w-full">
          {renderChart()}
        </div>
      </div>
    </Card>
  );
};