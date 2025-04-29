'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaLanguage } from 'react-icons/fa';
import BookingForm from '@/app/components/BookingForm';

interface Activity {
  id: number;
  title: string;
  description: string;
  photo: string;
  price: number;
  capacity: number;
  activityType: string;
  address: string;
  city: string;
  country: string;
  host: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  ratings: Array<{
    id: number;
    stars: number;
    title: string;
    content: string;
  }>;
}

export default function ActivityPage({ params }: { params: { id: string } }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    fetchActivity();
  }, [params.id]);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const averageRating = activity.ratings.length
    ? activity.ratings.reduce((acc, curr) => acc + curr.stars, 0) / activity.ratings.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative h-[60vh] rounded-xl overflow-hidden mb-8">
          <Image
            src={activity.photo}
            alt={activity.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{activity.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="ml-1 text-sm">({activity.ratings.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{activity.city}, {activity.country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About this activity</h2>
              <p className="text-gray-600 whitespace-pre-line">{activity.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">3 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Group size</p>
                    <p className="font-medium">Up to {activity.capacity} people</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaLanguage className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-medium">English, Spanish</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Meet your host</h2>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/img/team-1.jpg"
                    alt={`${activity.host.firstName} ${activity.host.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {activity.host.firstName} {activity.host.lastName}
                  </h3>
                  <p className="text-gray-600">Professional host since 2020</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                Reviews ({activity.ratings.length})
              </h2>
              <div className="space-y-6">
                {activity.ratings.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={index < review.stars ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <h3 className="font-semibold mb-2">{review.title}</h3>
                    <p className="text-gray-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold">${activity.price}</span>
                    <span className="text-gray-600"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{averageRating.toFixed(1)}</span>
                  </div>
                </div>

                {isBookingOpen ? (
                  <BookingForm
                    activityId={activity.id}
                    price={activity.price}
                    capacity={activity.capacity}
                  />
                ) : (
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors btn-transition"
                  >
                    Book this experience
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}