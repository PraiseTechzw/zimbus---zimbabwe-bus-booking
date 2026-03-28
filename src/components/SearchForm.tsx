import React, { useState } from 'react';
import { Search, MapPin, Calendar, ArrowRightLeft, ChevronDown } from 'lucide-react';
import { ZIM_CITIES } from '../constants';

interface SearchFormProps {
  onSearch: (from: string, to: string, date: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to, date);
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-morphism p-8 rounded-3xl shadow-2xl shadow-orange-500/10 max-w-5xl mx-auto -mt-24 relative z-20 border-white/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <MapPin size={10} className="text-orange-500" /> Origin
          </label>
          <div className="relative">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none font-bold text-gray-900 cursor-pointer"
              required
            >
              <option value="">Select City</option>
              {ZIM_CITIES.map((city) => (
                <option key={city.code} value={city.name}>{city.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="flex justify-center md:pb-2">
          <button
            type="button"
            onClick={swapCities}
            className="p-3 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:rotate-180 shadow-sm border border-orange-100/50 group-hover:shadow-orange-200"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <MapPin size={10} className="text-orange-500" /> Destination
          </label>
          <div className="relative">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none font-bold text-gray-900 cursor-pointer"
              required
            >
              <option value="">Select City</option>
              {ZIM_CITIES.map((city) => (
                <option key={city.code} value={city.name}>{city.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <Calendar size={10} className="text-orange-500" /> Travel Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 cursor-pointer"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full custom-gradient text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-orange-500/20"
      >
        <Search size={22} className="stroke-[3px]" /> 
        <span className="tracking-tight">Find My Bus</span>
      </button>
    </form>
  );
};
