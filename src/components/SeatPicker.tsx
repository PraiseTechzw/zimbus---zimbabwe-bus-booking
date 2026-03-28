import React, { useState } from 'react';
import { Bus as BusIcon, ChevronLeft, CheckCircle2, User, Armchair } from 'lucide-react';
import { Bus } from '../types';
import { motion } from 'motion/react';
import { User as FirebaseUser } from 'firebase/auth';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface SeatPickerProps {
  bus: Bus;
  onBack: () => void;
  onConfirm: (seat: string) => void;
  user: FirebaseUser | null;
  onLogin: () => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ bus, onBack, onConfirm, user, onLogin }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time occupied seats subscription
  React.useEffect(() => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('busId', '==', bus.id), where('status', '==', 'confirmed'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seats = snapshot.docs.map(doc => doc.data().seatNumber);
      setOccupiedSeats(seats);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [bus.id]);

  // Seat generation: 4 seats per row, 10 rows
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const leftCols = [1, 2];
  const rightCols = [3, 4];
  
  if (isLoading) {
    return (
      <div className="glass-morphism rounded-[3rem] p-24 flex flex-col items-center justify-center gap-8 text-center min-h-[600px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-500/10 rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <BusIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-600 animate-pulse" size={32} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black text-gray-900 tracking-tight">Syncing Live Map</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Checking seat availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-[3rem] p-10 shadow-2xl border-white/50 max-w-5xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <button onClick={onBack} className="flex items-center gap-3 text-gray-400 hover:text-orange-600 transition-all group">
          <div className="p-3 rounded-2xl bg-white border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all shadow-sm transform group-hover:-translate-x-1">
            <ChevronLeft size={20} className="text-gray-600 group-hover:text-orange-600" />
          </div>
          <span className="font-black text-xs uppercase tracking-[0.2em]">Go Back</span>
        </button>
        <div className="text-left md:text-right">
          <h3 className="font-black text-3xl text-gray-900 tracking-tight mb-1">{bus.operator}</h3>
          <div className="flex items-center md:justify-end gap-3 text-xs font-black text-orange-500 uppercase tracking-[0.2em]">
            <span>{bus.from}</span>
            <div className="w-6 h-[2px] bg-orange-100" />
            <span>{bus.to}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Bus Layout Container */}
        <div className="lg:col-span-7 bg-gray-100 p-6 md:p-10 rounded-[3rem] border-4 border-gray-200 relative shadow-inner">
          {/* Bus Front / Windshield Area */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-12 bg-gray-800 rounded-t-3xl border-b-8 border-gray-700 flex items-center justify-center">
            <div className="w-32 h-1 bg-gray-600 rounded-full opacity-50" />
          </div>

          <div className="mt-8 space-y-4">
            {/* Driver Area */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex flex-col items-center justify-center text-gray-500 border-2 border-gray-700 shadow-lg">
                  <div className="w-6 h-6 rounded-full border-4 border-gray-600 flex items-center justify-center">
                    <div className="w-1 h-4 bg-gray-600 rounded-full" />
                  </div>
                  <span className="text-[8px] font-black uppercase mt-1 text-gray-400">Driver</span>
                </div>
              </div>
              <div className="col-span-4" />
            </div>

            {/* Seats Grid */}
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row} className="grid grid-cols-5 gap-3 md:gap-4 items-center">
                  {/* Left Column Seats */}
                  {leftCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <motion.button
                        key={seatId}
                        whileHover={!isOccupied ? { scale: 1.05 } : {}}
                        whileTap={!isOccupied ? { scale: 0.95 } : {}}
                        disabled={isOccupied}
                        onClick={() => setSelectedSeat(seatId)}
                        className={`
                          relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                          ${isOccupied 
                            ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60' 
                            : isSelected 
                              ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-200 z-10' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50'
                          }
                        `}
                      >
                        <Armchair size={16} className={`mb-1 ${isOccupied ? 'opacity-30' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{seatId}</span>
                        {isSelected && (
                          <motion.div 
                            layoutId="check"
                            className="absolute -top-1 -right-1 bg-white text-orange-600 rounded-full shadow-md"
                          >
                            <CheckCircle2 size={14} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Aisle Indicator */}
                  <div className="flex items-center justify-center">
                    <div className="h-full w-px bg-gray-300/50 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-1 py-4">
                        <span className="text-[8px] font-black text-gray-300 uppercase vertical-text tracking-[0.2em]">Aisle</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Seats */}
                  {rightCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <motion.button
                        key={seatId}
                        whileHover={!isOccupied ? { scale: 1.05 } : {}}
                        whileTap={!isOccupied ? { scale: 0.95 } : {}}
                        disabled={isOccupied}
                        onClick={() => setSelectedSeat(seatId)}
                        className={`
                          relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                          ${isOccupied 
                            ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60' 
                            : isSelected 
                              ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-200 z-10' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50'
                          }
                        `}
                      >
                        <Armchair size={16} className={`mb-1 ${isOccupied ? 'opacity-30' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{seatId}</span>
                        {isSelected && (
                          <motion.div 
                            layoutId="check"
                            className="absolute -top-1 -right-1 bg-white text-orange-600 rounded-full shadow-md"
                          >
                            <CheckCircle2 size={14} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6">
            <h4 className="font-black text-sm text-gray-400 uppercase tracking-[0.2em]">Seat Legend</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                  <Armchair size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-wider">Available</p>
                  <p className="text-[10px] font-bold text-gray-400">Ready for booking</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400/50">
                  <Armchair size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Occupied</p>
                  <p className="text-[10px] font-bold text-gray-400">Already taken</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-orange-600 border-2 border-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                  <Armchair size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-orange-600 uppercase tracking-wider">Selected</p>
                  <p className="text-[10px] font-bold text-orange-400">Your choice</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-orange-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-orange-200 uppercase tracking-[0.2em] mb-1">Selected Seat</p>
                  <p className="text-4xl font-black tracking-tighter">{selectedSeat || '--'}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <User size={24} />
                </div>
              </div>

              <div className="h-px bg-white/20" />

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black text-orange-200 uppercase tracking-[0.2em] mb-1">Total Price</p>
                  <p className="text-4xl font-black tracking-tighter">${selectedSeat ? bus.price : '0'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Incl. Taxes</p>
                </div>
              </div>

              {user ? (
                <button
                  disabled={!selectedSeat}
                  onClick={() => selectedSeat && onConfirm(selectedSeat)}
                  className="w-full bg-white text-orange-600 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={20} /> <span className="tracking-tight">Confirm Booking</span>
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="w-full bg-white/20 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-2 border-white/50 hover:bg-white hover:text-orange-600 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <User size={20} /> <span className="tracking-tight">Sign In to Book</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <BusIcon size={18} />
            </div>
            <p className="text-xs font-bold text-blue-700 leading-tight">
              Tickets are non-refundable 24 hours before departure. Please review your selection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
