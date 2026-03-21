import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppointmentTrendChartProps {
  data?: { date: string; count: number }[];
}

const mockData = [
  { date: 'Mon', count: 24 },
  { date: 'Tue', count: 32 },
  { date: 'Wed', count: 28 },
  { date: 'Thu', count: 41 },
  { date: 'Fri', count: 36 },
  { date: 'Sat', count: 18 },
  { date: 'Sun', count: 12 },
];

export function AppointmentTrendChart({ data }: AppointmentTrendChartProps) {
  const chartData = data ?? mockData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
