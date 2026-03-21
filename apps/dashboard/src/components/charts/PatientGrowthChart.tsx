import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PatientGrowthChartProps {
  data?: { month: string; total: number; newPatients: number }[];
}

const mockData = [
  { month: 'Jan', total: 320, newPatients: 45 },
  { month: 'Feb', total: 358, newPatients: 38 },
  { month: 'Mar', total: 402, newPatients: 44 },
  { month: 'Apr', total: 455, newPatients: 53 },
  { month: 'May', total: 510, newPatients: 55 },
  { month: 'Jun', total: 578, newPatients: 68 },
  { month: 'Jul', total: 640, newPatients: 62 },
  { month: 'Aug', total: 695, newPatients: 55 },
  { month: 'Sep', total: 760, newPatients: 65 },
  { month: 'Oct', total: 832, newPatients: 72 },
  { month: 'Nov', total: 905, newPatients: 73 },
  { month: 'Dec', total: 980, newPatients: 75 },
];

export function PatientGrowthChart({ data }: PatientGrowthChartProps) {
  const chartData = data ?? mockData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorTotal)"
                name="Total Patients"
              />
              <Area
                type="monotone"
                dataKey="newPatients"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorNew)"
                name="New Patients"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
