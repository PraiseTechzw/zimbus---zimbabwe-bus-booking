import React, { useState } from 'react';
import { Armchair, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface EnhancedSeatMapProps {
  busLayout?: 'standard' | 'luxury' | 'coach';
  selectedSeats?: string[];
  occupiedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  maxSeatsSelectable?: number;
}

export const EnhancedSeatMap: React.FC<EnhancedSeatMapProps> = ({
  busLayout = 'standard',
  selectedSeats = [],
  occupiedSeats,
  onSeatSelect,
  maxSeatsSelectable = 1
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Define bus layouts
  const layouts = {
    standard: { rows: 10, leftSeats: [1, 2], rightSeats: [3, 4] },
    luxury: { rows: 8, leftSeats: [1], rightSeats: [2] }, // 2x2 spacing for luxury
    coach: { rows: 12, leftSeats: [1, 2, 3], rightSeats: [4, 5, 6] }
  };

  const layout = layouts[busLayout];
  const rows = Array.from({ length: layout.rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const getSeatStatus = (seatId: string) => {
    if (selectedSeats.includes(seatId)) return 'selected';
    if (occupiedSeats.includes(seatId)) return 'occupied';
    return 'available';
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200 border-orange-500 text-white';
      case 'occupied':
        return 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60';
      case 'available':
        return 'bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50 cursor-pointer';
      default:
        return '';
    }
  };

  const handleMouseMove = (e: React.MouseEvent, seatId: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHoveredSeat(seatId);
    setTooltipPos({
      x: rect.left - 50,
      y: rect.top - 40
    });
  };

  return (
    <div className="space-y-8">
      {/* Bus Front Indicator */}
      <div className="relative">
        <div className="flex flex-col items-center">
          {/* Windshield */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-64 h-16 bg-gradient-to-b from-blue-300 to-blue-200 rounded-t-3xl border-4 border-gray-800 shadow-lg flex items-center justify-center relative"
          >
            <div className="absolute w-1/3 h-1.5 bg-gray-600 rounded-full opacity-30" />
            <p className="text-gray-700 font-black text-sm tracking-tight">DRIVER</p>
            {/* Steering wheel */}
            <div className="absolute -right-8 top-6 w-8 h-8 border-4 border-gray-600 rounded-full" />
          </motion.div>

          {/* Bus body */}
          <div className="w-full max-w-2xl bg-gray-100 rounded-b-3xl p-8 border-4 border-gray-800 shadow-2xl">
            {/* Seat Grid */}
            <div className="space-y-4">
              {rows.map(row => (
                <motion.div
                  key={row}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rows.indexOf(row) * 0.02 }}
                  className="flex items-center justify-center gap-4 md:gap-6"
                >
                  {/* Row Label */}
                  <span className="text-xs font-black text-gray-500 w-6 text-center">{row}</span>

                  {/* Left Section Seats */}
                  <div className="flex gap-2">
                    {layout.leftSeats.map(col => {
                      const seatId = `${row}${col}`;
                      const status = getSeatStatus(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <motion.button
                          key={seatId}
                          whileHover={status === 'available' ? { scale: 1.1 } : {}}
                          whileTap={status === 'available' ? { scale: 0.95 } : {}}
                          disabled={status === 'occupied' || (status !== 'selected' && selectedSeats.length >= maxSeatsSelectable)}
                          onClick={() => onSeatSelect(seatId)}
                          onMouseMove={(e) => handleMouseMove(e, seatId)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`relative w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 font-black text-xs uppercase tracking-tighter ${getSeatColor(status)}`}
                        >
                          <Armchair size={18} className="mb-0.5" />
                          <span>{seatId}</span>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <motion.div
                              layoutId="seatCheck"
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md border-2 border-orange-500 flex items-center justify-center"
                            >
                              <span className="text-orange-600 font-black text-sm">✓</span>
                            </motion.div>
                          )}

                          {/* Hover Tooltip */}
                          {hoveredSeat === seatId && status !== 'occupied' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full mt-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap z-50 pointer-events-none shadow-lg"
                            >
                              {status === 'available' ? 'Click to select' : 'Already selected'}
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="h-8 w-1 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full" />

                  {/* Right Section Seats */}
                  <div className="flex gap-2">
                    {layout.rightSeats.map(col => {
                      const seatId = `${row}${col}`;
                      const status = getSeatStatus(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <motion.button
                          key={seatId}
                          whileHover={status === 'available' ? { scale: 1.1 } : {}}
                          whileTap={status === 'available' ? { scale: 0.95 } : {}}
                          disabled={status === 'occupied' || (status !== 'selected' && selectedSeats.length >= maxSeatsSelectable)}
                          onClick={() => onSeatSelect(seatId)}
                          onMouseMove={(e) => handleMouseMove(e, seatId)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`relative w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 font-black text-xs uppercase tracking-tighter ${getSeatColor(status)}`}
                        >
                          <Armchair size={18} className="mb-0.5" />
                          <span>{seatId}</span>

                          {isSelected && (
                            <motion.div
                              layoutId="seatCheck"
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md border-2 border-orange-500 flex items-center justify-center"
                            >
                              <span className="text-orange-600 font-black text-sm">✓</span>
                            </motion.div>
                          )}

                          {hoveredSeat === seatId && status !== 'occupied' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full mt-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap z-50 pointer-events-none shadow-lg"
                            >
                              {status === 'available' ? 'Click to select' : 'Already selected'}
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Row Label (Right) */}
                  <span className="text-xs font-black text-gray-500 w-6 text-center">{row}</span>
                </motion.div>
              ))}
            </div>

            {/* Emergency Exit Indicators */}
            <div className="mt-6 flex justify-between items-end">
              <div className="text-center">
                <div className="w-12 h-8 bg-green-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-[8px]">
                  EXIT
                </div>
                <span className="text-[8px] font-bold text-gray-600">Emergency Exit</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-8 bg-green-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-[8px]">
                  EXIT
                </div>
                <span className="text-[8px] font-bold text-gray-600">Emergency Exit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600">
            <Armchair size={18} />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Available</p>
            <p className="text-[10px] text-gray-500">Ready for booking</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <Armchair size={18} />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Selected</p>
            <p className="text-[10px] text-gray-500">Your choice</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400 opacity-60">
            <Armchair size={18} />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Occupied</p>
            <p className="text-[10px] text-gray-500">Already taken</p>
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-bold">💡 Seat Selection Tips:</p>
          <ul className="text-[10px] space-y-0.5 ml-4">
            <li>• Window seats offer scenic views</li>
            <li>• Aisle seats provide easier access</li>
            <li>• Front seats offer better visibility</li>
            <li>• Rear seats may have more legroom</li>
          </ul>
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4"
        >
          <p className="font-bold text-gray-900 mb-2">
            Selected Seats ({selectedSeats.length}/{maxSeatsSelectable})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <motion.span
                key={seat}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
              >
                {seat}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
