import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Clock, Shield, 
  ChevronLeft, Bus as BusIcon, Info, Phone, 
  MessageSquare, Radio, Wind, Zap, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus } from '../types';

interface LiveTrackingProps {
  bus: Bus;
  onBack: () => void;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({ bus, onBack }) => {
  const [progress, setProgress] = useState(45); // Simulated bus progress
  const [status, setStatus] = useState<'on-time' | 'slight-delay' | 'heavy-traffic'>('on-time');

  // Simulated live movement
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 0.1 : p));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-gray-400 hover:text-orange-600 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-white border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 shadow-sm">
            <ChevronLeft size={20} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest">Back to Trip</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
            <Radio size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Signal</span>
          </div>
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg flex items-center gap-2">
             <Clock size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">ETA: 45m</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Visualization (Simulated) */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-4 border border-gray-100 shadow-2xl relative min-h-[500px] overflow-hidden">
           {/* Static Map Background (Decorative) */}
           <div className="absolute inset-0 bg-[#F5F5F5] opacity-50">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           </div>

           {/* Simulated Route Line */}
           <div className="absolute top-1/2 left-10 right-10 h-2 bg-gray-200 rounded-full -translate-y-1/2 overflow-hidden shadow-inner">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="h-full custom-gradient"
             />
           </div>

           {/* Start & End Points */}
           <div className="absolute top-1/2 left-10 -translate-y-1/2 -translate-x-1/2 space-y-3 text-center">
             <div className="w-6 h-6 bg-white border-4 border-gray-900 rounded-full shadow-lg mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">{bus.from}</p>
           </div>
           
           <div className="absolute top-1/2 right-10 -translate-y-1/2 translate-x-1/2 space-y-3 text-center">
             <div className="w-6 h-6 bg-orange-600 border-4 border-white rounded-full shadow-lg mx-auto animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">{bus.to}</p>
           </div>

           {/* Bus Marker */}
           <motion.div 
             animate={{ left: `${progress}%` }}
             style={{ x: '-50%' }}
             transition={{ type: 'spring', damping: 20 }}
             className="absolute top-1/2 -translate-y-1/2 z-10"
           >
             <div className="relative group">
                <div className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
                <div className="p-4 bg-gray-900 text-white rounded-[1.5rem] shadow-2xl shadow-orange-900/40 relative">
                  <BusIcon size={24} />
                </div>
                {/* Tooltip */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white border border-gray-100 p-3 rounded-xl shadow-xl whitespace-nowrap opacity-100 scale-100 transition-all pointer-events-none">
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-sm font-black text-gray-900">{status === 'on-time' ? 'On Time' : 'Delayed'}</p>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
                </div>
             </div>
           </motion.div>
        </div>

        {/* Details & Controls */}
        <aside className="space-y-8">
           <div className="glass-morphism rounded-[3rem] p-10 border-white/50 shadow-2xl space-y-8 animate-in slide-in-from-right duration-700">
             <div className="space-y-1">
               <h3 className="text-2xl font-black text-gray-900 tracking-tight">{bus.operator}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{bus.id.slice(0, 8)}</p>
             </div>

             <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-white/50 rounded-2xl border border-white/50">
                   <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Navigation size={20} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Location</p>
                      <p className="text-sm font-black text-gray-900">Between Mvuma & Chivhu</p>
                   </div>
                </div>

                <div className="flex gap-4 p-4 bg-white/50 rounded-2xl border border-white/50">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Clock size={20} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Probability</p>
                      <p className="text-sm font-black text-green-600">98% (High confidence)</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-500/30 transition-all group">
                 <Phone size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Driver</span>
               </button>
               <button className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-500/30 transition-all group">
                 <MessageSquare size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Support</span>
               </button>
             </div>

             <div className="pt-6 border-t border-white/50 space-y-4">
                <div className="flex items-center gap-3 text-orange-600">
                   <Shield size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Secure Tracking Active</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Live location is broadcasted using the vehicle's onboard GPS. Timings are estimated based on local traffic conditions.
                </p>
             </div>
           </div>

           {/* Weather/External Data Integration (Simulated) */}
           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="flex items-center gap-3">
                 <Wind size={20} className="text-orange-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Local Conditions</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-300">Route Weather</p>
                    <p className="text-lg font-black tracking-tight">28°C Clear</p>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-300">Traffic Density</p>
                    <p className="text-lg font-black text-green-500 tracking-tight">Low</p>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};
