'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../providers/NotificationContext';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface Booking {
  bookingId: number;
  checkInDate: string;
  checkOutDate: string;
  guestFullName: string;
  guestEmail: string;
  numOfAdults: number;
  numOfChildren: number;
  bookingConfirmationCode: string;
  activity: {
    id: number;
    title: string;
    photo: string;
    price: number;
    city: string;
    country: string;
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // TODO: Replace with actual user email from auth
      const response = await fetch('/api/bookings/user/current/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      showNotification('error', 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/booking/${bookingId}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      showNotification('success', 'Booking cancelled successfully');
      // Remove the cancelled booking from state
      setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
    } catch (error) {
      showNotification('error', 'Failed to cancel booking');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h2>
            <p className="text-gray-600">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking.bookingId}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={booking.activity.photo}
                      alt={booking.activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">
                      {booking.activity.title}
                    </h2>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {booking.activity.city}, {booking.activity.country}
                      </div>

                      <div className="flex items-center">
                        <FaUsers className="mr-2" />
                        {booking.numOfAdults} {booking.numOfAdults === 1 ? 'Adult' : 'Adults'}
                        {booking.numOfChildren > 0 && ` + ${booking.numOfChildren} ${booking.numOfChildren === 1 ? 'Child' : 'Children'}`}
                      </div>

                      <div>
                        <span className="text-gray-500">Booking Reference: </span>
                        {booking.bookingConfirmationCode}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        ${(booking.activity.price * (booking.numOfAdults + booking.numOfChildren)).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Amount
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking.bookingId)}
                      className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}