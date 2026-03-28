import React from 'react';
import { Bus as BusIcon, Clock, Users, Wifi, Wind, Zap, Coffee } from 'lucide-react';
import { Bus } from '../types';

interface BusCardProps {
  bus: Bus;
  onSelect: (bus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onSelect }) => {
  const amenityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi size={14} />,
    'AC': <Wind size={14} />,
    'Charging': <Zap size={14} />,
    'Refreshments': <Coffee size={14} />,
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 card-hover-effect group shadow-sm hover:shadow-xl hover:shadow-orange-500/10">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
              <BusIcon size={28} />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{bus.operator}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
                <Users size={14} className="text-orange-500" />
                <span>{bus.availableSeats} seats available</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 py-4 bg-gray-50/50 rounded-2xl px-6 border border-gray-50">
            <div className="text-left">
              <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-1">{bus.departureTime}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{bus.from}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-orange-500 shadow-sm" />
              </div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] animate-pulse">On Time</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-1">{bus.arrivalTime}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{bus.to}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {bus.amenities.map((amenity) => (
              <span key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-orange-200 hover:text-orange-600 transition-all cursor-default">
                <span className="text-orange-500">{amenityIcons[amenity]}</span>
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end md:w-48 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Fare</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-orange-600">$</span>
              <span className="text-5xl font-black text-gray-900 tracking-tighter">{bus.price}</span>
            </div>
          </div>
          <button
            onClick={() => onSelect(bus)}
            className="w-full custom-gradient text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Choose Seat
          </button>
        </div>
      </div>
    </div>
  );
};
