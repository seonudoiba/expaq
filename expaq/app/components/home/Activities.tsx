import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaCalendar, FaStar } from 'react-icons/fa';
import { FaLocationPin, FaPerson } from 'react-icons/fa6';

const Activities: React.FC = () => {
  const activities = [
    {
      image: '/img/package-1.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Traditional Thai Cooking Class',
      rating: '4.8',
      reviews: '328',
      price: '$75',
      tags: ['Cooking', 'Cultural']
    },
    {
      image: '/img/package-2.jpg',
      location: 'Japan',
      duration: '4 hours',
      people: '4 Person',
      title: 'Tea Ceremony Experience',
      rating: '4.9',
      reviews: '215',
      price: '$120',
      tags: ['Cultural', 'Traditional']
    },
    {
      image: '/img/package-3.jpg',
      location: 'Italy',
      duration: '6 hours',
      people: '6 Person',
      title: 'Tuscan Wine Tasting Tour',
      rating: '4.7',
      reviews: '189',
      price: '$150',
      tags: ['Wine', 'Food']
    },
    {
      image: '/img/package-4.jpg',
      location: 'Spain',
      duration: '2 days',
      people: '8 Person',
      title: 'Flamenco Dance Workshop',
      rating: '4.6',
      reviews: '167',
      price: '$90',
      tags: ['Dance', 'Cultural']
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in">
          <h6 className="text-purple-700 uppercase tracking-widest mb-2">Experiences</h6>
          <h1 className="text-4xl font-bold mb-4">Discover Unique Activities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with local hosts and immerse yourself in authentic cultural experiences around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="activity-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl"
            >
              <div className="img-hover-zoom relative h-48">
                <Image 
                  src={activity.image} 
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-purple-700">
                  {activity.price}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {activity.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-lg mb-2 hover:text-purple-700 transition-colors">
                  <Link href="#">{activity.title}</Link>
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center mr-4">
                    <FaLocationPin className="mr-1" />
                    {activity.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-1" />
                    {activity.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold mr-1">{activity.rating}</span>
                    <span className="text-gray-500 text-sm">({activity.reviews})</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaPerson className="mr-1" />
                    <span className="text-sm">{activity.people}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button className="w-full bg-purple-700 text-white py-2 rounded-lg btn-transition hover:bg-purple-800">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;