import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { AppointmentTrendChart } from '@/components/charts/AppointmentTrendChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { PatientGrowthChart } from '@/components/charts/PatientGrowthChart';
import { SpecialtyPieChart } from '@/components/charts/SpecialtyPieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExport } from '@/hooks/useExport';
import { formatCurrency } from '@/lib/utils';
import { Download, FileSpreadsheet, FileText, Star } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock data
const doctorPerformance = [
  { doctorId: '1', doctorName: 'Dr. Michael Chen', specialization: 'Cardiology', totalAppointments: 245, completedAppointments: 220, cancelledAppointments: 15, averageRating: 4.8, revenue: 48500 },
  { doctorId: '2', doctorName: 'Dr. Emily Brown', specialization: 'Dermatology', totalAppointments: 198, completedAppointments: 180, cancelledAppointments: 10, averageRating: 4.6, revenue: 36200 },
  { doctorId: '3', doctorName: 'Dr. David Kim', specialization: 'Neurology', totalAppointments: 167, completedAppointments: 155, cancelledAppointments: 8, averageRating: 4.9, revenue: 52100 },
  { doctorId: '4', doctorName: 'Dr. Lisa Wang', specialization: 'Pediatrics', totalAppointments: 312, completedAppointments: 290, cancelledAppointments: 12, averageRating: 4.7, revenue: 41800 },
  { doctorId: '5', doctorName: 'Dr. James Patel', specialization: 'Orthopedics', totalAppointments: 145, completedAppointments: 130, cancelledAppointments: 9, averageRating: 4.5, revenue: 32400 },
];

const dailyBookings = [
  { day: 'Mon', bookings: 45 },
  { day: 'Tue', bookings: 52 },
  { day: 'Wed', bookings: 38 },
  { day: 'Thu', bookings: 65 },
  { day: 'Fri', bookings: 48 },
  { day: 'Sat', bookings: 22 },
  { day: 'Sun', bookings: 10 },
];

const statusDistribution = [
  { status: 'Completed', count: 450, color: '#10b981' },
  { status: 'Scheduled', count: 120, color: '#3b82f6' },
  { status: 'Confirmed', count: 80, color: '#f59e0b' },
  { status: 'Cancelled', count: 45, color: '#ef4444' },
  { status: 'No Show', count: 15, color: '#6b7280' },
];

export default function Analytics() {
  const [tab, setTab] = useState('overview');
  const { downloadCSV, downloadPDF } = useExport();

  const handleExportCSV = () => {
    downloadCSV(
      doctorPerformance,
      'doctor-performance',
      [
        { key: 'doctorName', header: 'Doctor' },
        { key: 'specialization', header: 'Specialty' },
        { key: 'totalAppointments', header: 'Total Appts' },
        { key: 'completedAppointments', header: 'Completed' },
        { key: 'averageRating', header: 'Rating' },
        { key: 'revenue', header: 'Revenue' },
      ],
    );
  };

  const handleExportPDF = () => {
    downloadPDF(
      'Doctor Performance Report',
      [
        { header: 'Doctor', dataKey: 'doctorName' },
        { header: 'Specialty', dataKey: 'specialization' },
        { header: 'Total Appts', dataKey: 'totalAppointments' },
        { header: 'Completed', dataKey: 'completedAppointments' },
        { header: 'Rating', dataKey: 'averageRating' },
        { header: 'Revenue', dataKey: 'revenue' },
      ],
      doctorPerformance,
      'doctor-performance-report',
    );
  };

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Insights and performance metrics"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileSpreadsheet className="mr-1 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="mr-1 h-4 w-4" /> Export PDF
            </Button>
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doctors">Doctor Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Daily bookings bar chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyBookings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <AppointmentTrendChart />

              {/* Status distribution pie */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          nameKey="status"
                          label={({ status, count }) => `${status}: ${count}`}
                        >
                          {statusDistribution.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <PatientGrowthChart />
          </div>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Doctor Performance</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Total Appts</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Cancelled</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorPerformance.map((doc) => (
                    <TableRow key={doc.doctorId}>
                      <TableCell className="font-medium">{doc.doctorName}</TableCell>
                      <TableCell>
                        <Badge variant="default">{doc.specialization}</Badge>
                      </TableCell>
                      <TableCell>{doc.totalAppointments}</TableCell>
                      <TableCell className="text-green-600">{doc.completedAppointments}</TableCell>
                      <TableCell className="text-red-600">{doc.cancelledAppointments}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {doc.averageRating}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(doc.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="space-y-6">
            <RevenueChart />
            <SpecialtyPieChart />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
