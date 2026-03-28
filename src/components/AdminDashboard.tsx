import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bus as BusIcon, Users, Calendar, 
  TrendingUp, Plus, Search, Edit2, Trash2, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  MoreVertical, CheckCircle2, XCircle, Clock,
  MapPin, DollarSign, Filter, Download, Info
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Bus, Booking } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onExit: () => void;
}

type AdminTab = 'overview' | 'fleet' | 'bookings' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBus, setIsAddingBus] = useState(false);

  // New Bus Form State
  const [newBus, setNewBus] = useState<Partial<Bus>>({
    operator: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['WiFi', 'AC']
  });

  useEffect(() => {
    // Subscribe to Buses
    const busesUnsubscribe = onSnapshot(collection(db, 'buses'), (snapshot) => {
      setBuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bus)));
    });

    // Subscribe to Bookings
    const bookingsUnsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      setIsLoading(false);
    });

    return () => {
      busesUnsubscribe();
      bookingsUnsubscribe();
    };
  }, []);

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'buses'), newBus);
      setIsAddingBus(false);
      setNewBus({
        operator: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        price: 0,
        totalSeats: 40,
        availableSeats: 40,
        amenities: ['WiFi', 'AC']
      });
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  };

  const handleDeleteBus = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this bus from the fleet?')) {
      try {
        await deleteDoc(doc(db, 'buses', id));
      } catch (error) {
        console.error('Error deleting bus:', error);
      }
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `$${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Buses', value: buses.length, icon: BusIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Registered Users', value: '1,284', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-100">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">Admin Portal</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <TrendingUp size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'fleet' ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BusIcon size={20} /> Fleet Management
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Calendar size={20} /> All Bookings
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Users size={20} /> User CRM
          </button>
        </nav>

        <button 
          onClick={onExit}
          className="text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-gray-900 transition-colors pt-10 border-t border-gray-50 text-center"
        >
          Exit Dashboard
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'fleet' && 'Fleet Management'}
              {activeTab === 'bookings' && 'Reservations'}
              {activeTab === 'users' && 'User Management'}
            </h1>
            <p className="text-gray-500 font-medium">Monitoring platform activity in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:text-gray-900 transition-all shadow-sm">
              <Download size={20} />
            </button>
            <button className="p-3 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:text-gray-900 transition-all shadow-sm">
              <Filter size={20} />
            </button>
            {activeTab === 'fleet' && (
              <button 
                onClick={() => setIsAddingBus(true)}
                className="flex items-center gap-3 bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95"
              >
                <Plus size={20} /> Add Bus
              </button>
            )}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Bookings</h3>
                  <button className="text-orange-600 font-bold text-xs uppercase tracking-widest hover:underline" onClick={() => setActiveTab('bookings')}>View All</button>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-all group border border-transparent hover:border-orange-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm font-black">
                          #{booking.seatNumber}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{booking.passengerName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(booking.bookingDate).toLocaleDateString()} at {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">${booking.totalPrice}</p>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Confirmed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Popular Destinations</h3>
                  <button className="text-orange-600 font-bold text-xs uppercase tracking-widest hover:underline">Download Report</button>
                </div>
                <div className="space-y-6 pt-4">
                   {[
                     { city: 'Harare', share: '45%', count: 852, color: 'bg-orange-600' },
                     { city: 'Bulawayo', share: '32%', count: 624, color: 'bg-blue-600' },
                     { city: 'Victoria Falls', share: '15%', count: 321, color: 'bg-purple-600' },
                     { city: 'Gweru', share: '8%', count: 154, color: 'bg-green-600' },
                   ].map((dest, i) => (
                     <div key={i} className="space-y-3">
                       <div className="flex justify-between text-sm font-bold">
                         <span className="text-gray-900">{dest.city}</span>
                         <span className="text-gray-500">{dest.count} trips ({dest.share})</span>
                       </div>
                       <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                         <div className={`h-full ${dest.color}`} style={{ width: dest.share }} />
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {buses.map((bus) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={bus.id} 
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 group hover:border-orange-200 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <BusIcon size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-gray-900 tracking-tight">{bus.operator}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fleet ID: {bus.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBus(bus.id)}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 py-4 border-y border-gray-50">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</p>
                      <p className="font-black text-gray-900">{bus.from}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex-1 text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</p>
                      <p className="font-black text-gray-900">{bus.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inventory</p>
                      <p className="font-black text-gray-900">{bus.availableSeats}/{bus.totalSeats} Seats</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unit Price</p>
                      <p className="font-black text-gray-900">${bus.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* User CRM & Full Bookings List could go here */}
        {(activeTab === 'bookings' || activeTab === 'users') && (
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center p-20 gap-6 text-center">
              <div className="p-6 bg-orange-50 text-orange-600 rounded-[2rem] shadow-sm">
                <Clock size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Expansion in Progress</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">This module is currently being optimized for large-scale data visualization in the next build.</p>
              </div>
           </div>
        )}
      </main>

      {/* Add Bus Modal */}
      <AnimatePresence>
        {isAddingBus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingBus(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 custom-gradient" />
              
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Add New Bus</h3>
                  <p className="text-gray-500 font-medium pt-2">Register a new unit to the fleet.</p>
                </div>
                <button 
                  onClick={() => setIsAddingBus(false)}
                  className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleAddBus} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Operator Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. City Link"
                      value={newBus.operator}
                      onChange={(e) => setNewBus({...newBus, operator: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Base Price ($)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="e.g. 25"
                      value={newBus.price}
                      onChange={(e) => setNewBus({...newBus, price: Number(e.target.value)})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Departure City</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Harare"
                      value={newBus.from}
                      onChange={(e) => setNewBus({...newBus, from: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Arrival City</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Bulawayo"
                      value={newBus.to}
                      onChange={(e) => setNewBus({...newBus, to: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Departure Time</label>
                    <input 
                      required
                      type="time" 
                      value={newBus.departureTime}
                      onChange={(e) => setNewBus({...newBus, departureTime: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Arrival Time</label>
                    <input 
                      required
                      type="time" 
                      value={newBus.arrivalTime}
                      onChange={(e) => setNewBus({...newBus, arrivalTime: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-5 text-gray-900 font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingBus(false)}
                    className="flex-1 bg-gray-100 text-gray-500 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gray-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                  >
                    Confirm & Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
