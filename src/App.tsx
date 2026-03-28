import React, { useState, useEffect } from 'react';
import { Bus as BusIcon, MapPin, Search, Calendar, ArrowRightLeft, Clock, Users, Wifi, Wind, Zap, Coffee, ChevronLeft, CheckCircle2, Download, Share2, Menu, X, Phone, Mail, Instagram, Twitter, Facebook, LogIn, LogOut, User as UserIcon, AlertCircle, Bell, Sliders } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { BusCard } from './components/BusCard';
import { SeatPicker } from './components/SeatPicker';
import { BookingConfirmation } from './components/BookingConfirmation';
import { MOCK_BUSES, ZIM_CITIES } from './constants';
import { Bus, Booking } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, googleProvider, OperationType, handleFirestoreError } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

import { MyBookings } from './components/MyBookings';
import { RoutesList } from './components/RoutesList';
import { OperatorsList } from './components/OperatorsList';
import { Support } from './components/Support';
import { UserProfile } from './components/UserProfile';
import { Notifications } from './components/Notifications';
import { ScrollToTop } from './components/ScrollToTop';
import { BusCardSkeleton } from './components/SkeletonLoader';

type View = 'home' | 'results' | 'seats' | 'confirmation' | 'my-bookings' | 'routes' | 'operators' | 'support' | 'profile' | 'notifications';

function MainApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'availability'>('price');
  const [filterOperator, setFilterOperator] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth State Changed:', currentUser ? `Signed in as ${currentUser.email}` : 'Signed out');
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Create/Update user profile in Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            lastLogin: new Date().toISOString(),
            role: 'user'
          }, { merge: true });
          console.log('User profile synced with Firestore');
        } catch (error) {
          console.error('Error updating user profile in Firestore:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Buses from Firestore
  useEffect(() => {
    if (!isAuthReady) return;

    const busesRef = collection(db, 'buses');
    const unsubscribe = onSnapshot(busesRef, (snapshot) => {
      const busList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bus));
      
      if (user && busList.length < MOCK_BUSES.length) {
        // Seed database if missing buses and user is present
        seedBuses(busList);
      } else {
        setBuses(busList);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'buses');
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  const seedBuses = async (existingBuses: Bus[] = []) => {
    try {
      const busesRef = collection(db, 'buses');
      for (const bus of MOCK_BUSES) {
        // Check if bus already exists in Firestore to avoid duplicates
        const exists = existingBuses.some(eb => 
          eb.operator === bus.operator && 
          eb.from === bus.from && 
          eb.to === bus.to && 
          eb.departureTime === bus.departureTime
        );
        
        if (!exists) {
          const { id, ...busData } = bus; // Remove local ID if present
          await addDoc(busesRef, busData);
        }
      }
    } catch (error) {
      console.error('Error seeding buses:', error);
    }
  };

  const handleSearch = (from: string, to: string, date: string) => {
    const results = buses.filter(bus => 
      bus.from.toLowerCase() === from.toLowerCase() && 
      bus.to.toLowerCase() === to.toLowerCase()
    );
    setSearchResults(results);
    setCurrentView('results');
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setCurrentView('seats');
  };

  const handleConfirmBooking = async (seat: string) => {
    if (!user || !selectedBus) {
      handleLogin();
      return;
    }

    try {
      const bookingData: Partial<Booking> = {
        busId: selectedBus.id,
        userId: user.uid,
        passengerName: user.displayName || 'Anonymous',
        seatNumber: seat,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        totalPrice: selectedBus.price
      };

      // 1. Create the booking record
      await addDoc(collection(db, 'bookings'), bookingData);

      // 2. Decrement the available seats for this bus in Firestore
      const busRef = doc(db, 'buses', selectedBus.id);
      await updateDoc(busRef, {
        availableSeats: selectedBus.availableSeats - 1
      });

      setSelectedSeat(seat);
      setIsBookingConfirmed(true);
      setCurrentView('confirmation');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Attempting Google Sign-In...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Login successful for user:', result.user.displayName);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this site to sign in with Google.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Silently handle cancelled popup
      } else {
        alert(`Login failed: ${error.message}. Please Check if your domain is authorized in Firebase console.`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetFlow = () => {
    setSearchResults(null);
    setSelectedBus(null);
    setSelectedSeat(null);
    setIsBookingConfirmed(false);
    setCurrentView('home');
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading ZimBus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <ScrollToTop view={currentView} />
      {/* Navigation */}
      <nav className="glass-morphism sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={resetFlow}>
              <div className="custom-gradient p-2 rounded-xl text-white shadow-lg shadow-orange-200">
                <BusIcon size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">ZimBus</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigateTo('routes')} className={`text-sm font-bold transition-colors ${currentView === 'routes' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>Routes</button>
              <button onClick={() => navigateTo('operators')} className={`text-sm font-bold transition-colors ${currentView === 'operators' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>Operators</button>
              <button onClick={() => navigateTo('support')} className={`text-sm font-bold transition-colors ${currentView === 'support' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>Support</button>
              
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                  <button 
                    onClick={() => navigateTo('my-bookings')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${currentView === 'my-bookings' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-6 h-6 rounded-full border border-gray-200" />
                    <span className="text-sm font-bold">{user.displayName?.split(' ')[0]}</span>
                  </button>
                  <button 
                    onClick={() => navigateTo('notifications')}
                    className="p-2 text-gray-400 hover:text-orange-600 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    title="Profile"
                  >
                    <UserIcon size={20} />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="custom-gradient text-white px-8 py-3 rounded-[1.25rem] font-black text-sm hover:shadow-xl hover:shadow-orange-500/20 transition-all flex items-center gap-3 transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-orange-500/10"
                >
                  <LogIn size={20} /> <span className="tracking-tight">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <button onClick={() => navigateTo('routes')} className="block w-full text-left text-lg font-bold text-gray-900">Routes</button>
                <button onClick={() => navigateTo('operators')} className="block w-full text-left text-lg font-bold text-gray-900">Operators</button>
                <button onClick={() => navigateTo('support')} className="block w-full text-left text-lg font-bold text-gray-900">Support</button>
                <div className="pt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-4">
                      <button onClick={() => navigateTo('my-bookings')} className="flex items-center gap-3 w-full p-4 bg-gray-50 rounded-2xl">
                        <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-12 h-12 rounded-2xl" />
                        <div className="flex-1 text-left">
                          <p className="font-black text-gray-900 tracking-tight">{user.displayName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">View Bookings</p>
                        </div>
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigateTo('profile')} className="p-4 bg-orange-50 text-orange-600 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95">
                          <UserIcon size={24} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                        </button>
                        <button onClick={() => navigateTo('notifications')} className="p-4 bg-orange-50 text-orange-600 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 relative">
                          <Bell size={24} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
                          <span className="absolute top-3 right-8 w-2 h-2 bg-orange-600 rounded-full border-2 border-orange-50" />
                        </button>
                      </div>
                      <button onClick={handleLogout} className="w-full text-center text-red-500 font-black text-sm uppercase tracking-widest py-2">Logout</button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <LogIn size={20} /> Sign In with Google
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              {/* Hero Section */}
              <div className="bg-gray-900 h-[600px] relative overflow-hidden flex items-center justify-center text-center px-4 mt-[-80px] pt-[80px]">
                <div className="absolute inset-0">
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000" 
                    alt="Bus background" 
                    className="w-full h-full object-cover opacity-30"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-[#f8fafc]" />
                
                <div className="relative z-10 max-w-4xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Zimbabwe's #1 Booking Platform
                  </div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none"
                  >
                    Travel Across <br/> <span className="text-orange-500">Zimbabwe</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed"
                  >
                    Experience seamless travel with ZimBus. Book your bus tickets online with ease. Safe, reliable, and affordable travel across all major cities.
                  </motion.p>
                </div>
              </div>

              {/* Search Form */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <SearchForm onSearch={handleSearch} />
                
                {/* Popular Routes */}
                <div className="mt-32 space-y-12">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Popular Routes</h2>
                      <p className="text-gray-500 font-medium text-lg">Top destinations favored by our travelers</p>
                    </div>
                    <button onClick={() => navigateTo('routes')} className="text-orange-600 font-black text-sm uppercase tracking-[0.2em] group flex items-center gap-2">
                      View All Destinations
                      <ArrowRightLeft size={16} className="transition-transform group-hover:rotate-180" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { from: 'Harare', to: 'Bulawayo', price: 15, time: '6h 00m', travelers: '2.4k' },
                      { from: 'Harare', to: 'Mutare', price: 10, time: '4h 30m', travelers: '1.8k' },
                      { from: 'Bulawayo', to: 'Victoria Falls', price: 20, time: '7h 00m', travelers: '1.2k' },
                    ].map((route, i) => (
                      <motion.div 
                        whileHover={{ y: -8 }}
                        key={i} 
                        onClick={() => handleSearch(route.from, route.to, new Date().toISOString().split('T')[0])}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Zap size={10} className="fill-green-600" /> Instant
                          </div>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-bold text-gray-400">$</span>
                            <span className="text-3xl font-black text-gray-900">{route.price}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">From</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">{route.from}</p>
                          </div>
                          <div className="text-orange-200 group-hover:text-orange-500 transition-all duration-500 transform group-hover:rotate-180">
                            <ArrowRightLeft size={24} />
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">To</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">{route.to}</p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-orange-500" />
                            <span>{route.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-orange-500" />
                            <span>{route.travelers} monthly</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'results' && searchResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto px-4 py-12 space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <button 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-3 text-gray-400 hover:text-orange-600 transition-all group mb-4"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all shadow-sm">
                      <ChevronLeft size={18} className="text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-orange-600">New Search</span>
                  </button>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{searchResults.length} Buses Available</h2>
                  <p className="text-gray-500 font-medium">Found for your selected route</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sliders size={12} className="text-orange-500" /> Sort By
                  </div>
                  <button 
                    onClick={() => setSortBy('price')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'price' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    Price
                  </button>
                  <button 
                    onClick={() => setSortBy('departure')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'departure' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    Departure
                  </button>
                  <button 
                    onClick={() => setSortBy('availability')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'availability' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    Seats
                  </button>

                  <div className="w-px h-6 bg-gray-100 mx-2 hidden lg:block" />
                  
                  <div className="flex items-center gap-2 ml-2">
                    <select 
                      value={filterOperator || ''} 
                      onChange={(e) => setFilterOperator(e.target.value || null)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      <option value="">All Operators</option>
                      {[...new Set((searchResults || []).map(b => b.operator))].map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {!searchResults ? (
                  <div className="space-y-6">
                    <BusCardSkeleton />
                    <BusCardSkeleton />
                    <BusCardSkeleton />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults
                    .filter(bus => !filterOperator || bus.operator === filterOperator)
                    .sort((a, b) => {
                      if (sortBy === 'price') return a.price - b.price;
                      if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
                      if (sortBy === 'availability') return b.availableSeats - a.availableSeats;
                      return 0;
                    })
                    .map(bus => (
                      <BusCard key={bus.id} bus={bus} onSelect={handleSelectBus} />
                    ))
                ) : (
                  <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                      <Search size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">No buses found</h3>
                      <p className="text-gray-500 font-medium max-w-sm mx-auto">
                        We couldn't find any buses for your search. Try searching for a different date or route.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentView('home')}
                      className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-200 transition-all shadow-sm active:scale-95"
                    >
                      Change Search
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UserProfile user={user} onBack={() => setCurrentView('home')} onLogout={handleLogout} />
            </motion.div>
          )}

          {currentView === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Notifications onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'seats' && selectedBus && (
            <motion.div
              key="seats"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <SeatPicker 
                bus={selectedBus} 
                onBack={() => setCurrentView('results')} 
                onConfirm={handleConfirmBooking}
                user={user}
                onLogin={handleLogin}
              />
            </motion.div>
          )}

          {currentView === 'confirmation' && selectedBus && selectedSeat && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <BookingConfirmation 
                bus={selectedBus} 
                seat={selectedSeat} 
                onDone={resetFlow}
              />
            </motion.div>
          )}

          {currentView === 'my-bookings' && (
            <motion.div
              key="my-bookings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MyBookings onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'routes' && (
            <motion.div
              key="routes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RoutesList onBack={() => setCurrentView('home')} onSearch={handleSearch} />
            </motion.div>
          )}

          {currentView === 'operators' && (
            <motion.div
              key="operators"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OperatorsList onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Support onBack={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={resetFlow}>
                <div className="bg-orange-600 p-2 rounded-xl text-white">
                  <BusIcon size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter text-gray-900">ZimBus</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Zimbabwe's leading online bus booking platform. Connecting you to every corner of the country with comfort and safety.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-600 transition-colors rounded-lg"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-600 transition-colors rounded-lg"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-600 transition-colors rounded-lg"><Facebook size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><button onClick={() => navigateTo('home')} className="hover:text-orange-600 transition-colors">Search Buses</button></li>
                <li><button onClick={() => navigateTo('my-bookings')} className="hover:text-orange-600 transition-colors">My Bookings</button></li>
                <li><button onClick={() => navigateTo('operators')} className="hover:text-orange-600 transition-colors">Bus Operators</button></li>
                <li><button onClick={() => navigateTo('routes')} className="hover:text-orange-600 transition-colors">Routes & Schedules</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><button onClick={() => navigateTo('support')} className="hover:text-orange-600 transition-colors">Help Center</button></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
                <li><button onClick={() => navigateTo('support')} className="hover:text-orange-600 transition-colors">Contact Us</button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-gray-900 mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Phone size={16} /></div>
                  <span>+263 770 000 000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Mail size={16} /></div>
                  <span>support@zimbus.co.zw</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              © 2026 ZimBus Zimbabwe. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <MainApp />
  );
}

export default App;
