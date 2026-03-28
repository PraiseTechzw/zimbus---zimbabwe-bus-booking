import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Booking, Bus } from '../types';
import { Calendar, Clock, MapPin, Bus as BusIcon, ChevronLeft, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, User, CreditCard, Info, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingSkeleton } from './SkeletonLoader';

interface MyBookingsProps {
  onBack: () => void;
  onTrack: (bus: Bus) => void;
}

interface BookingWithBus extends Booking {
  bus?: Bus;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onBack, onTrack }) => {
  const [bookings, setBookings] = useState<BookingWithBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      
      // Fetch bus details for each booking
      const bookingsWithBuses = await Promise.all(bookingList.map(async (booking) => {
        try {
          const busDoc = await getDoc(doc(db, 'buses', booking.busId));
          return { ...booking, bus: busDoc.exists() ? { id: busDoc.id, ...busDoc.data() } as Bus : undefined };
        } catch (error) {
          console.error('Error fetching bus for booking:', error);
          return booking;
        }
      }));

      setBookings(bookingsWithBuses.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <BookingSkeleton />
        <BookingSkeleton />
        <BookingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-wider">Back to Home</span>
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-gray-900">My Bookings</h2>
          <p className="text-gray-500 font-medium">Manage your upcoming and past trips</p>
        </div>
      </div>

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={booking.id} 
              className={`bg-white rounded-[2rem] shadow-sm border transition-all overflow-hidden ${
                expandedId === booking.id ? 'border-orange-200 ring-4 ring-orange-500/5' : 'border-gray-100 hover:shadow-xl hover:shadow-orange-500/5'
              }`}
            >
              <div 
                onClick={() => toggleExpand(booking.id)}
                className="p-8 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                          <BusIcon size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-gray-900 tracking-tight">{booking.bus?.operator || 'Unknown Operator'}</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Booking ID: #{booking.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                          {booking.status}
                        </div>
                        <div className="text-gray-300">
                          {expandedId === booking.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 py-4 bg-gray-50/50 rounded-[1.5rem] px-8 border border-gray-50">
                      <div className="text-left">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">{booking.bus?.departureTime || '--:--'}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{booking.bus?.from || 'Unknown'}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-orange-500" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">{booking.bus?.arrivalTime || '--:--'}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{booking.bus?.to || 'Unknown'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Calendar size={14} className="text-orange-500" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <MapPin size={14} className="text-orange-500" />
                        <span>Seat {booking.seatNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end md:w-40 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Paid</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-orange-600">$</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">{booking.totalPrice}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download logic
                      }}
                      className="w-full text-[10px] font-black text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-100 hover:border-orange-600 px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all"
                    >
                      Ticket
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === booking.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-gray-100 bg-gray-50/50"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <User size={14} className="text-orange-500" />
                            Passenger Details
                          </h4>
                          <div className="bg-white p-4 rounded-xl border border-gray-100">
                            <p className="text-sm font-bold text-gray-900">{booking.passengerName}</p>
                            <p className="text-xs text-gray-500 mt-1">Confirmed Passenger</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <CreditCard size={14} className="text-orange-500" />
                            Payment Summary
                          </h4>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Base Fare</span>
                              <span className="font-bold text-gray-900">${booking.totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Service Fee</span>
                              <span className="font-bold text-green-600">FREE</span>
                            </div>
                            <div className="pt-2 border-t border-gray-50 flex justify-between text-base">
                              <span className="font-bold text-gray-900">Total Paid</span>
                              <span className="font-black text-orange-600">${booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <Info size={14} className="text-orange-500" />
                            Bus Information
                          </h4>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operator</p>
                                <p className="text-sm font-bold text-gray-900">{booking.bus?.operator}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Route</p>
                                <p className="text-sm font-bold text-gray-900">{booking.bus?.from} to {booking.bus?.to}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Departure</p>
                                <p className="text-sm font-bold text-gray-900">{booking.bus?.departureTime}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Arrival</p>
                                <p className="text-sm font-bold text-gray-900">{booking.bus?.arrivalTime}</p>
                              </div>
                            </div>
                            
                            {booking.bus?.amenities && booking.bus.amenities.length > 0 && (
                              <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                  {booking.bus.amenities.map((amenity, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-600 rounded-md border border-gray-100">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (booking.bus) onTrack(booking.bus);
                            }}
                            className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-950/10 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Navigation size={14} className="text-orange-500" /> Live Track Trip
                          </button>
                          <button className="flex-1 bg-white text-red-500 border border-red-100 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95">
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
              <p className="text-gray-500">You haven't made any bus bookings yet.</p>
            </div>
            <button 
              onClick={onBack}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
            >
              Start Searching
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
