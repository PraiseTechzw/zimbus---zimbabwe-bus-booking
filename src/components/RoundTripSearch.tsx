import React, { useState } from 'react';
import { Bus as BusIcon, MapPin, Calendar, ArrowRightLeft, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ZIM_CITIES } from '../constants';
import { motion } from 'motion/react';

interface RoundTripSearchProps {
  onSearch: (searchParams: RoundTripSearchParams) => void;
  isLoading?: boolean;
}

export interface RoundTripSearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  isRoundTrip: true;
}

export const RoundTripSearch: React.FC<RoundTripSearchProps> = ({ onSearch, isLoading = false }) => {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const newErrors: Record<string, string> = {};

    if (departureDate < today) {
      newErrors.departureDate = 'Departure date must be in the future';
    }

    if (tripType === 'roundtrip') {
      if (!returnDate) {
        newErrors.returnDate = 'Return date is required for round trips';
      } else if (returnDate < departureDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!from || !to) {
      setErrors({
        from: !from ? 'Please select origin' : '',
        to: !to ? 'Please select destination' : ''
      });
      return;
    }

    if (!validateDates()) {
      return;
    }

    if (tripType === 'oneway') {
      onSearch({
        from,
        to,
        departureDate,
        returnDate: '',
        isRoundTrip: false as any
      });
    } else {
      onSearch({
        from,
        to,
        departureDate,
        returnDate,
        isRoundTrip: true
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-morphism p-8 rounded-3xl shadow-2xl shadow-orange-500/10 max-w-5xl mx-auto -mt-24 relative z-20 border-white/50">
      {/* Trip Type Selection */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-6">
        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={`px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${
            tripType === 'oneway'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          One Way
        </button>
        <button
          type="button"
          onClick={() => setTripType('roundtrip')}
          className={`px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${
            tripType === 'roundtrip'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArrowRightLeft size={16} className="inline mr-2" /> Round Trip
        </button>
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* From */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <MapPin size={10} className="text-orange-500" /> From
          </label>
          <div className="relative">
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setErrors({ ...errors, from: '' });
              }}
              className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all appearance-none font-bold text-gray-900 cursor-pointer ${
                errors.from
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
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
          {errors.from && <p className="text-xs text-red-500 font-bold">{errors.from}</p>}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:pb-2">
          <button
            type="button"
            onClick={swapCities}
            className="p-3 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:rotate-180 shadow-sm border border-orange-100/50"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <MapPin size={10} className="text-orange-500" /> To
          </label>
          <div className="relative">
            <select
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setErrors({ ...errors, to: '' });
              }}
              className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all appearance-none font-bold text-gray-900 cursor-pointer ${
                errors.to
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
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
          {errors.to && <p className="text-xs text-red-500 font-bold">{errors.to}</p>}
        </div>

        {/* Departure Date */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
            <Calendar size={10} className="text-orange-500" /> Departure
          </label>
          <input
            type="date"
            value={departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDepartureDate(e.target.value);
              setErrors({ ...errors, departureDate: '' });
            }}
            className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all font-bold text-gray-900 cursor-pointer ${
              errors.departureDate
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
            }`}
            required
          />
          {errors.departureDate && <p className="text-xs text-red-500 font-bold">{errors.departureDate}</p>}
        </div>
      </div>

      {/* Return Date - Only show for round trips */}
      {tripType === 'roundtrip' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mt-6"
        >
          <div className="md:col-span-3" />
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
              <Calendar size={10} className="text-orange-500" /> Return
            </label>
            <input
              type="date"
              value={returnDate}
              min={departureDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setErrors({ ...errors, returnDate: '' });
              }}
              className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all font-bold text-gray-900 cursor-pointer ${
                errors.returnDate
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
              required
            />
            {errors.returnDate && <p className="text-xs text-red-500 font-bold">{errors.returnDate}</p>}
          </div>
        </motion.div>
      )}

      {/* Info Message */}
      {tripType === 'roundtrip' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 font-bold">
            💡 Round-trip bookings save you money! Book both legs together and get up to 10% discount.
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full custom-gradient text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <BusIcon size={22} className="stroke-[3px]" />
            <span className="tracking-tight">
              {tripType === 'oneway' ? 'Find Bus' : 'Find Round Trip'}
            </span>
          </>
        )}
      </button>
    </form>
  );
};

// One-way search component (refactored for reusability)
export interface OneWaySearchParams {
  from: string;
  to: string;
  departureDate: string;
  isRoundTrip: false;
}

// Component to display round-trip results
export const RoundTripResults: React.FC<{ 
  outboundBuses: any[];
  returnBuses: any[];
  onSelectOutbound: (bus: any) => void;
  onSelectReturn: (bus: any) => void;
}> = ({ outboundBuses, returnBuses, onSelectOutbound, onSelectReturn }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Outbound Journey */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Outbound Journey</h2>
          <p className="text-gray-500 text-sm">Choose your departure bus</p>
        </div>
        <div className="grid gap-6">
          {outboundBuses.length > 0 ? (
            outboundBuses.map(bus => (
              <RoundTripBusOption
                key={bus.id}
                bus={bus}
                onSelect={() => onSelectOutbound(bus)}
                isSelected={false}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">No buses available</p>
            </div>
          )}
        </div>
      </div>

      {/* Return Journey */}
      <div className="space-y-6 border-t-2 border-gray-200 pt-12">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Return Journey</h2>
          <p className="text-gray-500 text-sm">Choose your return bus</p>
        </div>
        <div className="grid gap-6">
          {returnBuses.length > 0 ? (
            returnBuses.map(bus => (
              <RoundTripBusOption
                key={bus.id}
                bus={bus}
                onSelect={() => onSelectReturn(bus)}
                isSelected={false}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">No buses available</p>
            </div>
          )}
        </div>
      </div>

      {/* Round Trip Discount Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex items-start gap-4"
      >
        <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
        <div>
          <p className="font-black text-gray-900">Save with Round Trip!</p>
          <p className="text-sm text-gray-600 mt-1">
            When you book both outbound and return trips, you'll receive a 10% discount on your total booking.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Helper component for displaying buses in round-trip context
const RoundTripBusOption: React.FC<{
  bus: any;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ bus, onSelect, isSelected }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-200'
          : 'border-gray-100 hover:border-orange-300 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-black text-lg text-gray-900">{bus.operator}</h3>
          <div className="flex items-center gap-8 mt-4">
            <div>
              <p className="text-sm text-gray-500 font-bold">Departs</p>
              <p className="text-2xl font-black text-gray-900">{bus.departureTime}</p>
              <p className="text-xs text-gray-400 font-bold">{bus.from}</p>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-orange-200" />
              <span className="text-xs font-bold text-orange-500">• {bus.availableSeats} seats •</span>
              <div className="h-px flex-1 bg-orange-200" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-bold">Arrives</p>
              <p className="text-2xl font-black text-gray-900">{bus.arrivalTime}</p>
              <p className="text-xs text-gray-400 font-bold">{bus.to}</p>
            </div>
          </div>
        </div>
        <div className="text-right ml-8">
          <p className="text-sm text-gray-500 font-bold">Price</p>
          <p className="text-3xl font-black text-orange-600">${bus.price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="mt-4 w-32 custom-gradient text-white py-2 rounded-lg font-bold text-sm"
          >
            {isSelected ? '✓ Selected' : 'Select'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
