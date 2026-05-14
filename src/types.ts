export interface Bus {
  id: string;
  operator: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  busId: string;
  userId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  passengerIdNumber?: string;
  seatNumber: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending' | 'completed';
  totalPrice: number;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: 'paynow' | 'card' | 'cash' | 'wallet';
  promoCode?: string;
  discountAmount?: number;
  cancellationReason?: string;
  cancelledDate?: string;
  isRoundTrip?: boolean;
  returnSeatNumber?: string;
  numberOfPassengers?: number;
  rating?: number;
  review?: string;
}

export interface PassengerDetails {
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  minBookingAmount?: number;
}

export interface UserWallet {
  userId: string;
  balance: number;
  totalCredited: number;
  totalUsed: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  bookingId?: string;
}

export interface BusReview {
  id: string;
  busId: string;
  operatorId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  date: string;
  helpful: number;
}

export interface City {
  name: string;
  code: string;
}
