import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data?: { month: string; revenue: number }[];
}

const mockData = [
  { month: 'Jan', revenue: 45200 },
  { month: 'Feb', revenue: 52100 },
  { month: 'Mar', revenue: 48300 },
  { month: 'Apr', revenue: 61500 },
  { month: 'May', revenue: 55800 },
  { month: 'Jun', revenue: 67200 },
  { month: 'Jul', revenue: 72100 },
  { month: 'Aug', revenue: 68400 },
  { month: 'Sep', revenue: 74500 },
  { month: 'Oct', revenue: 71200 },
  { month: 'Nov', revenue: 78900 },
  { month: 'Dec', revenue: 82300 },
];

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data ?? mockData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
