import React from 'react';
import Image from 'next/image';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonial: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      image: '/img/testimonial-1.jpg',
      name: 'Sarah Johnson',
      profession: 'Travel Enthusiast',
      location: 'United States',
      rating: 5,
      comment: 'The cooking class in Bangkok was a highlight of my trip! The local chef was so welcoming and taught us authentic Thai recipes. An unforgettable experience!',
    },
    {
      id: 2,
      image: '/img/testimonial-2.jpg',
      name: 'Marco Rossi',
      profession: 'Food Blogger',
      location: 'Italy',
      rating: 5,
      comment: 'Expaq connected me with amazing local hosts. The cultural experiences were authentic and the personal connections made everything special.',
    },
    {
      id: 3,
      image: '/img/testimonial-3.jpg',
      name: 'Yuki Tanaka',
      profession: 'Photographer',
      location: 'Japan',
      rating: 5,
      comment: 'I loved how easy it was to find unique activities. My host was knowledgeable and passionate about sharing their culture. Will definitely use Expaq again!',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-600 font-semibold tracking-wider uppercase">Testimonials</span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">What Our Travelers Say</h2>
          <p className="mt-4 text-lg text-gray-600">
            Real experiences from travelers who have discovered unique adventures through Expaq
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1">
                    <FaQuoteLeft className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.profession}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>

              <blockquote>
                <p className="text-gray-600 leading-relaxed italic">"{testimonial.comment}"</p>
              </blockquote>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 font-medium">Verified Experience</span>
                  <Image
                    src="/expaqlogo.png"
                    alt="Expaq Logo"
                    width={60}
                    height={20}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-purple-50 transform hover:scale-105">
            View All Reviews
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;