import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import ChartCard from './ChartCard';
import { Users, Eye, BarChart3, Clock } from 'lucide-react';

interface DashboardChartsGridProps {
  isDarkMode: boolean;
}

const DashboardChartsGrid: React.FC<DashboardChartsGridProps> = ({ isDarkMode }) => {
  // Sample data - replace with your actual data
  const salesData = [
    { month: 'Jan', sales: 95000 },
    { month: 'Fev', sales: 80000 },
    { month: 'Mar', sales: 98000 },
    { month: 'Abr', sales: 108000 },
    { month: 'Mai', sales: 115000 },
    { month: 'Jun', sales: 85000 },
  ];

  const trafficData = [
    { name: 'Google', value: 4700, color: '#4285F4' },
    { name: 'Facebook', value: 3400, color: '#1877F2' },
    { name: 'Direct', value: 2800, color: '#10B981' },
    { name: 'Others', value: 1900, color: '#F59E0B' },
  ];

  const visitorsData = [
    { day: '1', visitors: 150 },
    { day: '2', visitors: 180 },
    { day: '3', visitors: 220 },
    { day: '4', visitors: 190 },
    { day: '5', visitors: 280 },
    { day: '6', visitors: 250 },
    { day: '7', visitors: 420 },
    { day: '8', visitors: 380 },
    { day: '9', visitors: 100 },
    { day: '10', visitors: 120 },
    { day: '11', visitors: 180 },
    { day: '12', visitors: 110 },
    { day: '13', visitors: 130 },
    { day: '14', visitors: 200 },
    { day: '15', visitors: 180 },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChartCard
          id="metric-1"
          title="Visitantes Únicos"
          type="bar"
          icon={<Users className="h-4 w-4 text-blue-600 mr-2" />}
          metric={{
            value: "24.7K",
            change: 20,
            changeLabel: "vs mês anterior"
          }}
        >
          <div></div>
        </ChartCard>

        <ChartCard
          id="metric-2"
          title="Total Pageviews"
          type="bar"
          icon={<Eye className="h-4 w-4 text-purple-600 mr-2" />}
          metric={{
            value: "55.9K",
            change: 4,
            changeLabel: "vs mês anterior"
          }}
        >
          <div></div>
        </ChartCard>

        <ChartCard
          id="metric-3"
          title="Taxa de Rejeição"
          type="bar"
          icon={<BarChart3 className="h-4 w-4 text-red-600 mr-2" />}
          metric={{
            value: "54%",
            change: -1.5,
            changeLabel: "vs mês anterior"
          }}
        >
          <div></div>
        </ChartCard>

        <ChartCard
          id="metric-4"
          title="Duração da Visita"
          type="bar"
          icon={<Clock className="h-4 w-4 text-green-600 mr-2" />}
          metric={{
            value: "2m 56s",
            change: 7,
            changeLabel: "vs mês anterior"
          }}
        >
          <div></div>
        </ChartCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          id="sales-chart"
          title="Vendas por Mês"
          type="bar"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Vendas']} 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          id="traffic-chart"
          title="Fontes de Tráfego"
          type="pie"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
        </ChartCard>
      </div>

      {/* Full Width Chart */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          id="visitors-chart"
          title="Visitantes Diários - Últimos 15 dias"
          type="line"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Visitantes']} 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardChartsGrid;