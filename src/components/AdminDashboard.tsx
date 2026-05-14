import React, { useState, useEffect } from 'react';
import {
  BarChart3, DollarSign, Users, Bus as BusIcon, TrendingUp, ChevronLeft,
  Search, Filter, Download, Settings, Eye, EyeOff, AlertCircle, CheckCircle2,
  Calendar, Clock, MapPin, CreditCard, Trash2, Edit2, Plus, X,
  PieChart, Activity, Zap, Target, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Bus, Booking } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onBack: () => void;
  isAdmin: boolean;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalPassengers: number;
  activeOperators: number;
  completedTrips: number;
  pendingPayments: number;
  cancelledBookings: number;
  refundsIssued: number;
}

type AdminTab = 'overview' | 'bookings' | 'payments' | 'users' | 'operators' | 'reports';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled' | 'pending'>('all');
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalPassengers: 0,
    activeOperators: 0,
    completedTrips: 0,
    pendingPayments: 0,
    cancelledBookings: 0,
    refundsIssued: 0
  });

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mt-2">You don't have admin permissions to access this dashboard</p>
        <button
          onClick={onBack}
          className="mt-6 custom-gradient text-white px-6 py-3 rounded-lg font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Mock data fetch
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: 'BK001',
        busId: 'BUS001',
        userId: 'user1',
        passengerName: 'John Doe',
        passengerEmail: 'john@example.com',
        passengerPhone: '+263771234567',
        seatNumber: 'A1',
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        totalPrice: 125,
        paymentStatus: 'completed',
        paymentMethod: 'paynow',
        numberOfPassengers: 1
      },
      {
        id: 'BK002',
        busId: 'BUS002',
        userId: 'user2',
        passengerName: 'Jane Smith',
        passengerEmail: 'jane@example.com',
        passengerPhone: '+263781234567',
        seatNumber: 'B3',
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        totalPrice: 150,
        paymentStatus: 'completed',
        paymentMethod: 'card',
        numberOfPassengers: 1
      },
      {
        id: 'BK003',
        busId: 'BUS001',
        userId: 'user3',
        passengerName: 'David Wilson',
        passengerEmail: 'david@example.com',
        passengerPhone: '+263791234567',
        seatNumber: 'C2',
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        totalPrice: 200,
        paymentStatus: 'pending',
        paymentMethod: 'paynow',
        numberOfPassengers: 2
      },
      {
        id: 'BK004',
        busId: 'BUS003',
        userId: 'user4',
        passengerName: 'Sarah Johnson',
        passengerEmail: 'sarah@example.com',
        passengerPhone: '+263801234567',
        seatNumber: 'D1',
        bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        totalPrice: 180,
        paymentStatus: 'refunded',
        paymentMethod: 'card',
        cancelledDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        cancellationReason: 'Change of plans',
        numberOfPassengers: 1
      },
      {
        id: 'BK005',
        busId: 'BUS002',
        userId: 'user5',
        passengerName: 'Michael Brown',
        passengerEmail: 'michael@example.com',
        passengerPhone: '+263711234567',
        seatNumber: 'E4',
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        totalPrice: 175,
        paymentStatus: 'completed',
        paymentMethod: 'wallet',
        numberOfPassengers: 1
      }
    ];

    const mockStats: DashboardStats = {
      totalBookings: 456,
      totalRevenue: 68420,
      totalPassengers: 892,
      activeOperators: 12,
      completedTrips: 234,
      pendingPayments: 15,
      cancelledBookings: 23,
      refundsIssued: 3480
    };

    setBookings(mockBookings);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900">💼 Admin Dashboard</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw size={24} className="text-gray-600 hover:animate-spin" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={<DollarSign size={28} />}
              label="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change="+12.5%"
              color="orange"
            />
            <StatCard
              icon={<Users size={28} />}
              label="Total Passengers"
              value={stats.totalPassengers.toString()}
              change="+8.2%"
              color="blue"
            />
            <StatCard
              icon={<BusIcon size={28} />}
              label="Total Bookings"
              value={stats.totalBookings.toString()}
              change="+15.3%"
              color="green"
            />
            <StatCard
              icon={<AlertCircle size={28} />}
              label="Pending Payments"
              value={`$${(stats.pendingPayments * 150).toLocaleString()}`}
              change={`${stats.pendingPayments} bookings`}
              color="red"
            />
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
          {(['overview', 'bookings', 'payments', 'users', 'operators', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all uppercase tracking-widest ${
                activeTab === tab
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab stats={stats} bookings={bookings} />}
          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={filteredBookings}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              loading={loading}
            />
          )}
          {activeTab === 'payments' && <PaymentsTab bookings={bookings} stats={stats} />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'operators' && <OperatorsTab stats={stats} />}
          {activeTab === 'reports' && <ReportsTab stats={stats} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: 'orange' | 'blue' | 'green' | 'red';
}> = ({ icon, label, value, change, color }) => {
  const colors = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
      <p className="text-xs font-bold text-gray-500 mt-2">{change} from last month</p>
    </motion.div>
  );
};

// Overview Tab
const OverviewTab: React.FC<{ stats: DashboardStats; bookings: Booking[] }> = ({ stats, bookings }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-black text-lg text-gray-900 mb-4">📋 Recent Bookings</h3>
        <div className="space-y-3">
          {bookings.slice(0, 5).map(booking => (
            <motion.div key={booking.id} whileHover={{ x: 4 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">{booking.passengerName}</p>
                <p className="text-xs text-gray-500">{booking.id} • {booking.seatNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-orange-600">${booking.totalPrice}</p>
                <span className={`text-xs font-bold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-gray-500'}`}>
                  ✓ {booking.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-black text-lg text-gray-900 mb-4">💵 Revenue Breakdown</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-xs text-green-700 font-bold uppercase">Completed Payments</p>
            <p className="text-2xl font-black text-green-600">${bookings.filter(b => b.paymentStatus === 'completed').reduce((sum, b) => sum + b.totalPrice, 0)}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-xs text-yellow-700 font-bold uppercase">Pending Payments</p>
            <p className="text-2xl font-black text-yellow-600">${bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalPrice, 0)}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <p className="text-xs text-red-700 font-bold uppercase">Refunded</p>
            <p className="text-2xl font-black text-red-600">${bookings.filter(b => b.paymentStatus === 'refunded').reduce((sum, b) => sum + b.totalPrice, 0)}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Key Metrics */}
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="font-black text-lg text-gray-900 mb-6">📊 Key Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox label="Completed Trips" value={stats.completedTrips} icon={<CheckCircle2 className="text-green-600" />} />
        <MetricBox label="Active Operators" value={stats.activeOperators} icon={<BusIcon className="text-blue-600" />} />
        <MetricBox label="Cancelled" value={stats.cancelledBookings} icon={<X className="text-red-600" />} />
        <MetricBox label="Refunds Issued" value={`$${stats.refundsIssued}`} icon={<DollarSign className="text-orange-600" />} />
      </div>
    </div>
  </motion.div>
);

const MetricBox: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-2xl font-black text-gray-900">{value}</p>
    <p className="text-xs text-gray-600 font-bold mt-1">{label}</p>
  </div>
);

// Bookings Tab
const BookingsTab: React.FC<{
  bookings: Booking[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: string;
  setFilterStatus: (s: any) => void;
  loading: boolean;
}> = ({ bookings, searchQuery, setSearchQuery, filterStatus, setFilterStatus, loading }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    {/* Search & Filter */}
    <div className="flex gap-4 flex-wrap">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="🔍 Search by name or booking ID..."
        className="flex-1 min-w-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold"
      />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold"
      >
        <option value="all">All Status</option>
        <option value="confirmed">✓ Confirmed</option>
        <option value="pending">⏳ Pending</option>
        <option value="cancelled">✕ Cancelled</option>
      </select>
      <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
        <Download size={18} /> Export CSV
      </button>
    </div>

    {/* Bookings Table */}
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-black text-gray-900">Booking ID</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Passenger</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Seat</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Payment</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Method</th>
              <th className="px-6 py-4 text-left font-black text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(booking => (
              <motion.tr key={booking.id} whileHover={{ backgroundColor: '#f9fafb' }} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{booking.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-900">{booking.passengerName}</p>
                    <p className="text-xs text-gray-500">{booking.passengerEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{booking.seatNumber}</td>
                <td className="px-6 py-4 font-black text-orange-600">${booking.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status === 'confirmed' ? '✓' : booking.status === 'cancelled' ? '✕' : '⏳'} {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' :
                    booking.paymentStatus === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {booking.paymentStatus?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 capitalize">{booking.paymentMethod || 'N/A'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                    <Eye size={16} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

// Payments Tab
const PaymentsTab: React.FC<{ bookings: Booking[]; stats: DashboardStats }> = ({ bookings, stats }) => {
  const payments = bookings.map(b => ({
    id: b.id,
    passenger: b.passengerName,
    amount: b.totalPrice,
    method: b.paymentMethod || 'N/A',
    status: b.paymentStatus || 'pending',
    date: b.bookingDate
  }));

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <p className="text-green-700 text-sm font-bold uppercase tracking-widest mb-2">✓ Completed</p>
          <p className="text-4xl font-black text-green-700">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <p className="text-yellow-700 text-sm font-bold uppercase tracking-widest mb-2">⏳ Pending</p>
          <p className="text-4xl font-black text-yellow-700">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <p className="text-red-700 text-sm font-bold uppercase tracking-widest mb-2">↩️ Refunded</p>
          <p className="text-4xl font-black text-red-700">${totalRefunded.toLocaleString()}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-black text-gray-900">Payment ID</th>
                <th className="px-6 py-4 text-left font-black text-gray-900">Passenger</th>
                <th className="px-6 py-4 text-left font-black text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left font-black text-gray-900">Method</th>
                <th className="px-6 py-4 text-left font-black text-gray-900">Status</th>
                <th className="px-6 py-4 text-left font-black text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(payment => (
                <motion.tr key={payment.id} whileHover={{ backgroundColor: '#f9fafb' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{payment.passenger}</td>
                  <td className="px-6 py-4 font-black text-orange-600">${payment.amount}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 capitalize">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Users Tab
const UsersTab: React.FC = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 border border-gray-100">
    <h3 className="font-black text-lg text-gray-900 mb-4">👥 User Management</h3>
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900">Total Users: 1,250</p>
          <p className="text-sm text-gray-600">Active this month: 892</p>
        </div>
        <Users size={32} className="text-blue-600" />
      </div>
      <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
        View All Users
      </button>
    </div>
  </motion.div>
);

// Operators Tab
const OperatorsTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-black text-lg text-gray-900 mb-4">🚌 Active Operators</h3>
        <p className="text-4xl font-black text-green-600">{stats.activeOperators}</p>
        <p className="text-sm text-gray-600 mt-2">Bus operators actively running services</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-black text-lg text-gray-900 mb-4">✓ Completed Trips</h3>
        <p className="text-4xl font-black text-orange-600">{stats.completedTrips}</p>
        <p className="text-sm text-gray-600 mt-2">Successfully completed journeys</p>
      </div>
    </div>
    <button className="w-full px-6 py-3 custom-gradient text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
      <Plus size={18} /> Add New Operator
    </button>
  </motion.div>
);

// Reports Tab
const ReportsTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="bg-white rounded-2xl p-8 border border-gray-100">
      <h3 className="font-black text-lg text-gray-900 mb-6">📈 System Reports</h3>
      <div className="space-y-4">
        <ReportOption title="📊 Revenue Report" description="Detailed revenue breakdown by operator and route" />
        <ReportOption title="📈 Booking Analytics" description="Booking trends, patterns, and peak hours" />
        <ReportOption title="👥 Customer Report" description="User behavior and satisfaction metrics" />
        <ReportOption title="💰 Financial Summary" description="Complete financial overview and forecasts" />
      </div>
    </div>
  </motion.div>
);

const ReportOption: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-orange-400 hover:bg-orange-50 transition-all"
  >
    <p className="font-bold text-gray-900">{title}</p>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.button>
);
