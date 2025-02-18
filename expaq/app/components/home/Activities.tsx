import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaCalendar } from 'react-icons/fa';
import { FaLocationPin, FaPerson } from 'react-icons/fa6';
const Activities: React.FC = () => {
  const activities = [
    {
      image: '/img/package-1.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
    {
      image: '/img/package-2.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
    {
      image: '/img/package-3.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
    {
      image: '/img/package-4.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
    {
      image: '/img/package-5.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
    {
      image: '/img/package-6.jpg',
      location: 'Thailand',
      duration: '3 days',
      people: '2 Person',
      title: 'Discover amazing places of the world with us',
      rating: '4.5',
      reviews: '250',
      price: '$350',
    },
  ];

  return (
    <div className="py-5 w-11/12 mx-auto">
      <div className="container pt-5 pb-3">
        <div className="text-center mb-3 pb-3">
          <h6 className="text-purple-700 uppercase tracking-widest">Packages</h6>
          <h1 className="text-4xl font-bold">Perfect Tour Packages</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activities.map((pkg, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="package-item bg-white mb-2">
                <Image fill className="img-fluid w-full" src={pkg.image} alt={pkg.title} />
                <div className="p-4">
                  <div className="flex justify-between mb-3">
                    <small className="text-gray-600 flex gap-2">
                      <FaLocationPin/>
                      {pkg.location}
                    </small>
                    <small className="text-gray-600 flex gap-2">
                      <FaCalendar/>
                      {pkg.duration}
                    </small>
                    <small className="text-gray-600 flex gap-2">
                    <FaPerson/>                      
                    {pkg.people}
                    </small>
                  </div>
                  <Link className=" font-semibold text-decoration-none" href="#">
                    {pkg.title}
                  </Link>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between">
                      <h6 className="text-gray-600">
                        <i className="fa fa-star text-purple-700 mr-2"></i>
                        {pkg.rating} <small>({pkg.reviews})</small>
                      </h6>
                      <h5 className="text-gray-800 font-bold">{pkg.price}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;