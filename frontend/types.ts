
export interface User {
  name: string;
  email: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  genre: string[];
  duration: string;
  rating: number;
}

export interface Show {
  _id: string;
  movieId: string;
  theaterName: string;
  startTime: string;
  screenName: string;
  format: string;
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED'
}

export interface Seat {
  seatNumber: string;
  status: SeatStatus;
  price: number;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  _id: string;
  showId: Show;
  seats: string[];
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export enum PaymentMethod {
  CARD = 'CARD',
  UPI = 'UPI',
  NETBANKING = 'NETBANKING'
}
