
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from './ThemeProvider';

interface SalesDataPoint {
  name: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Colors based on the theme
  const textColor = isDarkMode ? '#e2e8f0' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Weekly Sales</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor }} 
              tickLine={{ stroke: textColor }}
            />
            <YAxis 
              tick={{ fill: textColor }}
              tickLine={{ stroke: textColor }}
              tickFormatter={(value) => `KSH ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#222' : '#fff',
                borderColor: isDarkMode ? '#444' : '#ccc',
                color: textColor,
              }}
              formatter={(value) => [`KSH ${value}`, 'Sales']}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
