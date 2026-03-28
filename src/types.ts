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
  seatNumber: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface City {
  name: string;
  code: string;
}
