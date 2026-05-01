import { useState, useEffect } from 'react';
import { getStats } from '../api/dashboardApi';
import { Briefcase, FileText, UserCheck, Users, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(({ data }) => setStats(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!stats) return null;

  const barData = Object.entries(stats.applicationsByMonth || {}).map(([m, c]) => ({
    month: MONTHS[parseInt(m)] || m, count: c,
  }));

  const pieData = Object.entries(stats.applicationsByStatus || {}).map(([name, value]) => ({ name, value }));

  const statCards = [
    { label: 'Open Jobs', value: stats.openJobs, icon: Briefcase, color: 'blue' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'purple' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: UserCheck, color: 'yellow' },
    { label: 'Hired', value: stats.hired, icon: TrendingUp, color: 'green' },
    { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'cyan' },
    { label: 'Upcoming Interviews', value: stats.upcomingInterviews, icon: Calendar, color: 'rose' },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your recruitment pipeline</p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="stat-icon"><Icon size={24} /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Applications by Month</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No data yet</p></div>
          )}
        </div>

        <div className="chart-card">
          <h3>Applications by Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No data yet</p></div>
          )}
        </div>
      </div>
    </>
  );
}
