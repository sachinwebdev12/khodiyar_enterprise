import React from 'react';
import { Users, FileText, DollarSign, AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import { useData } from '../../hooks/useData';

const Dashboard: React.FC = () => {
  const { getDashboardStats } = useData();
  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/new-bill"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Bill</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Bills"
          value={stats.totalBills}
          icon={FileText}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-500"
        />
        <StatsCard
          title="Pending Amount"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={20} />
          This Month's Revenue: ₹{stats.thisMonthRevenue.toLocaleString()}
        </h3>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800">
            Great job! Keep up the excellent work managing your transport business.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity
        recentClients={stats.recentClients}
        recentBills={stats.recentBills}
        recentPayments={stats.recentPayments}
      />
    </div>
  );
};

export default Dashboard;