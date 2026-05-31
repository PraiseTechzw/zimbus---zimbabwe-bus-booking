import React from 'react';
import { BRAND_NAME, PRIMARY_OPERATOR } from '../constants';
import { Bus as BusIcon, ChevronLeft, Star, ShieldCheck, Clock, Users, Wifi, Wind, Zap, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

interface OperatorsListProps {
  onBack: () => void;
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ onBack }) => {
  const amenityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi size={14} />,
    'AC': <Wind size={14} />,
    'Charging': <Zap size={14} />,
    'Refreshments': <Coffee size={14} />,
  };

  const operatorDetails = [
    { name: PRIMARY_OPERATOR, rating: 4.9, reviews: 1840, fleet: 60, amenities: ['WiFi', 'AC', 'Charging', 'Refreshments'], description: 'Primary Inter Africa service for direct routes and branded travel experiences.' },
    { name: 'Intercape', rating: 4.8, reviews: 1250, fleet: 45, amenities: ['WiFi', 'AC', 'Charging', 'Refreshments'], description: 'Partner operator used when a route does not have Inter Africa service.' },
    { name: 'CAG Travellers', rating: 4.5, reviews: 850, fleet: 30, amenities: ['AC', 'Charging'], description: 'Partner operator used as an alternative on selected routes.' },
    { name: 'City Link', rating: 4.9, reviews: 600, fleet: 15, amenities: ['WiFi', 'AC', 'Refreshments'], description: 'Partner operator used for fallback coverage on limited corridors.' },
    { name: 'Zupco', rating: 3.8, reviews: 2100, fleet: 120, amenities: ['AC'], description: 'Partner operator used for fallback service where Inter Africa does not run direct trips.' },
    { name: 'Rimbi Tours', rating: 4.2, reviews: 450, fleet: 20, amenities: ['AC', 'Charging'], description: 'Partner operator used to provide alternative options on unavailable routes.' },
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
          <h2 className="text-3xl font-black text-gray-900">{BRAND_NAME} Network</h2>
          <p className="text-gray-500 font-medium">Inter Africa comes first. Partner operators appear only when a route has no Inter Africa service.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {operatorDetails.map((operator, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <BusIcon size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{operator.name}</h3>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-900">{operator.rating}</span>
                    <span className="text-xs font-medium text-gray-400">({operator.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-full">
                <ShieldCheck size={20} />
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {operator.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fleet Size</p>
                <div className="flex items-center gap-2 text-gray-900 font-black">
                  <BusIcon size={14} className="text-orange-500" />
                  <span>{operator.fleet} Buses</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
                <div className="flex items-center gap-2 text-gray-900 font-black">
                  <Clock size={14} className="text-orange-500" />
                  <span>15+ Years</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Standard Amenities</p>
              <div className="flex flex-wrap gap-2">
                {operator.amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                    {amenityIcons[amenity]}
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
