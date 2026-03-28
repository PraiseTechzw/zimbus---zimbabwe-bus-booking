import React from 'react';
import { Bus, City } from '../types';
import { ZIM_CITIES, MOCK_BUSES } from '../constants';
import { MapPin, ArrowRightLeft, Clock, ChevronLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface RoutesListProps {
  onBack: () => void;
  onSearch: (from: string, to: string, date: string) => void;
}

export const RoutesList: React.FC<RoutesListProps> = ({ onBack, onSearch }) => {
  // Generate a list of popular routes from mock data and cities
  const popularRoutes = [
    { from: 'Harare', to: 'Bulawayo', price: 15, time: '6h 00m', frequency: 'Daily' },
    { from: 'Harare', to: 'Mutare', price: 10, time: '4h 30m', frequency: 'Daily' },
    { from: 'Bulawayo', to: 'Victoria Falls', price: 20, time: '7h 00m', frequency: 'Daily' },
    { from: 'Harare', to: 'Gweru', price: 12, time: '4h 00m', frequency: 'Daily' },
    { from: 'Harare', to: 'Beitbridge', price: 25, time: '9h 00m', frequency: 'Daily' },
    { from: 'Bulawayo', to: 'Gweru', price: 8, time: '2h 30m', frequency: 'Daily' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-wider">Back to Home</span>
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-gray-900">Routes & Schedules</h2>
          <p className="text-gray-500 font-medium">Explore all available bus routes across Zimbabwe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularRoutes.map((route, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onSearch(route.from, route.to, new Date().toISOString().split('T')[0])}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">{route.frequency}</span>
              <span className="text-2xl font-black text-gray-900">${route.price}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">From</p>
                <p className="text-xl font-black text-gray-900">{route.from}</p>
              </div>
              <div className="text-gray-200 group-hover:text-orange-500 transition-colors">
                <ArrowRightLeft size={20} />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</p>
                <p className="text-xl font-black text-gray-900">{route.to}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <Clock size={14} className="text-orange-500" />
                <span>{route.time}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                <span>Book Now</span>
                <Search size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-3xl p-12 text-center space-y-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-black text-white">Can't find your route?</h3>
          <p className="text-gray-400 font-medium max-w-xl mx-auto">
            We are constantly adding new operators and routes. Contact our support team if you need help planning your trip.
          </p>
          <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
