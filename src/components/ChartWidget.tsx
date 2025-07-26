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
      <div className="flex flex-col justify-center h-full p-4">
        <div className="flex items-center justify-end mb-4">
          {getMetricIcon()}
        </div>
        <div className="text-3xl font-bold dark:text-white mb-2">{getMetricValue()}</div>
        <p className={`text-sm flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <TrendingUp className="h-4 w-4 mr-1" />
          {getMetricChange()}
        </p>
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
    <Card className={`h-full w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
      {/* Widget Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 cursor-move">
        <div className="flex items-center">
          <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate flex items-center">
            {getChartIcon()}
            {title}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(id)}
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Widget Content */}
      <CardContent className="flex-1 p-4 h-[calc(100%-80px)]">
        <div className="h-full w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};