import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, ChevronLeft, Send, AlertCircle, CheckCircle2, User as UserIcon } from 'lucide-react';
import { BusReview } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BusReviewsProps {
  busId: string;
  busOperator: string;
  onBack: () => void;
  userId?: string;
  userName?: string;
}

export const BusReviews: React.FC<BusReviewsProps> = ({
  busId,
  busOperator,
  onBack,
  userId,
  userName = 'Anonymous'
}) => {
  const [reviews, setReviews] = useState<BusReview[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'helpful'>('latest');

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Mock reviews data
        const mockReviews: BusReview[] = [
          {
            id: '1',
            busId,
            operatorId: busOperator,
            userId: 'user1',
            userName: 'John Doe',
            rating: 5,
            review: 'Excellent service! The bus was clean and comfortable. Driver was professional and arrived on time.',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 45
          },
          {
            id: '2',
            busId,
            operatorId: busOperator,
            userId: 'user2',
            userName: 'Jane Smith',
            rating: 4,
            review: 'Good experience. The AC worked well and seats were comfortable. Only minor issue with luggage storage.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 32
          },
          {
            id: '3',
            busId,
            operatorId: busOperator,
            userId: 'user3',
            userName: 'David Wilson',
            rating: 3,
            review: 'Average journey. Bus had some comfort issues and was slightly delayed. But driver was helpful.',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 18
          },
          {
            id: '4',
            busId,
            operatorId: busOperator,
            userId: 'user4',
            userName: 'Sarah Johnson',
            rating: 5,
            review: 'Amazing! Best bus service I\'ve used. Very clean, good hospitality, and arrived earlier than expected.',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 67
          }
        ];
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [busId]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: Math.round((reviews.filter(r => r.rating === rating).length / reviews.length) * 100)
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'latest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleSubmitReview = async () => {
    if (!newReview.review.trim()) {
      alert('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const review: BusReview = {
        id: Date.now().toString(),
        busId,
        operatorId: busOperator,
        userId: userId || 'anonymous',
        userName,
        rating: newReview.rating,
        review: newReview.review,
        date: new Date().toISOString(),
        helpful: 0
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, review: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => {
              if (interactive) setNewReview({ ...newReview, rating: star });
            }}
            disabled={!interactive}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            <Star
              size={interactive ? 24 : 16}
              className={
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">{busOperator}</h1>
          <p className="text-gray-500 font-medium">Customer Reviews & Ratings</p>
        </div>
      </div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-7xl font-black text-orange-600">{averageRating}</div>
            <div className="flex flex-col items-center gap-2">
              {renderStars(Math.round(averageRating as any))}
              <p className="text-sm font-bold text-gray-600">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-4">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-24">
                  {renderStars(rating)}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-orange-500"
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 min-w-12 text-right">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Write Review Section */}
      {userId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 border-2 border-orange-200"
        >
          <h3 className="text-xl font-black text-gray-900 mb-6">Share Your Experience</h3>

          <div className="space-y-6">
            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Your Rating</label>
              <div className="flex gap-2">
                {renderStars(newReview.rating, true)}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
              <textarea
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                placeholder="Share details about your bus experience..."
                maxLength={500}
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none font-medium"
              />
              <p className="text-xs text-gray-500 font-bold mt-2">
                {newReview.review.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting || !newReview.review.trim()}
              className="w-full custom-gradient text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} /> Submit Review
                </>
              )}
            </button>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 size={20} className="text-green-600" />
                  <p className="text-sm text-green-700 font-bold">Thank you! Your review has been posted.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-700">Sort by:</span>
        <div className="flex gap-2">
          {(['latest', 'rating', 'helpful'] as const).map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                sortBy === option
                  ? 'custom-gradient text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString(undefined, {
                        day: 'short',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 mb-4">{review.review}</p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 font-bold text-sm">
                  <ThumbsUp size={16} /> Helpful ({review.helpful})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this bus service</p>
        </div>
      )}
    </div>
  );
};
