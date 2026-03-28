import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div 
          key={i} 
          className={`relative overflow-hidden bg-gray-100 rounded-3xl animate-pulse ${className}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      ))}
    </>
  );
};

export const BusCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <SkeletonLoader className="w-16 h-16 rounded-2xl" />
        <div className="space-y-2">
          <SkeletonLoader className="w-32 h-6" />
          <SkeletonLoader className="w-24 h-4" />
        </div>
      </div>
      <SkeletonLoader className="w-20 h-8 rounded-xl" />
    </div>
    
    <div className="flex items-center gap-6 py-6 border-y border-gray-50">
      <div className="flex-1 space-y-2">
        <SkeletonLoader className="w-12 h-3" />
        <SkeletonLoader className="w-full h-8" />
      </div>
      <SkeletonLoader className="w-8 h-8 rounded-full" />
      <div className="flex-1 text-right space-y-2">
        <SkeletonLoader className="w-12 h-3 ml-auto" />
        <SkeletonLoader className="w-full h-8" />
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <SkeletonLoader className="w-20 h-6 rounded-lg" count={2} />
      </div>
      <SkeletonLoader className="w-32 h-12 rounded-2xl" />
    </div>
  </div>
);

export const BookingSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <SkeletonLoader className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonLoader className="w-24 h-4" />
          <SkeletonLoader className="w-40 h-6" />
        </div>
      </div>
      <SkeletonLoader className="w-24 h-10 rounded-xl" />
    </div>
    <div className="pt-6 border-t border-gray-50 flex gap-4">
       <SkeletonLoader className="flex-1 h-3" count={3} />
    </div>
  </div>
);
