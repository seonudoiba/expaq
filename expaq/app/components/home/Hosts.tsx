import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar } from 'react-icons/fa';
import { FaLanguage, FaLocationDot } from "react-icons/fa6";

const Hosts: React.FC = () => {
  const hosts = [
    {
      id: 1,
      image: '/img/team-1.jpg',
      name: 'Maria Rodriguez',
      location: 'Barcelona, Spain',
      specialties: ['Flamenco Dance', 'Spanish Cuisine'],
      languages: ['Spanish', 'English', 'French'],
      rating: 4.9,
      reviews: 156,
      description: 'Professional dancer and culinary enthusiast sharing authentic Spanish culture',
      verified: true
    },
    {
      id: 2,
      image: '/img/team-2.jpg',
      name: 'Hiroshi Tanaka',
      location: 'Kyoto, Japan',
      specialties: ['Tea Ceremony', 'Calligraphy'],
      languages: ['Japanese', 'English'],
      rating: 4.8,
      reviews: 203,
      description: 'Traditional tea master with 20 years of experience',
      verified: true
    },
    {
      id: 3,
      image: '/img/team-3.jpg',
      name: 'Sophie Laurent',
      location: 'Paris, France',
      specialties: ['Wine Tasting', 'French Pastry'],
      languages: ['French', 'English', 'Italian'],
      rating: 4.9,
      reviews: 178,
      description: 'Certified sommelier and pastry chef sharing French culture',
      verified: true
    },
    {
      id: 4,
      image: '/img/team-4.jpg',
      name: 'Marco Rossi',
      location: 'Tuscany, Italy',
      specialties: ['Vineyard Tours', 'Cooking Classes'],
      languages: ['Italian', 'English', 'German'],
      rating: 4.7,
      reviews: 142,
      description: 'Third-generation winemaker and culinary expert',
      verified: true
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in">
          <h6 className="text-purple-700 uppercase tracking-widest mb-2">Meet Our Hosts</h6>
          <h1 className="text-4xl font-bold mb-4">Expert Local Guides</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with passionate local experts who create unforgettable experiences and share their culture with you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {hosts.map((host) => (
            <div 
              key={host.id} 
              className="activity-card bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative">
                <div className="img-hover-zoom relative h-64">
                  <Image 
                    src={host.image} 
                    alt={host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Social Links Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                    <FaFacebook size={20} />
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                    <FaTwitter size={20} />
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                    <FaInstagram size={20} />
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                    <FaLinkedin size={20} />
                  </Link>
                </div>

                {/* Verified Badge */}
                {host.verified && (
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{host.name}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaLocationDot className="mr-2" />
                  {host.location}
                </div>

                <div className="flex items-center mb-3">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-semibold mr-1">{host.rating}</span>
                  <span className="text-gray-500 text-sm">({host.reviews} reviews)</span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{host.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {host.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FaLanguage className="mr-2" size={20} />
                  {host.languages.join(', ')}
                </div>
              </div>

              <div className="px-6 pb-6">
                <Link 
                  href={`/hosts/${host.id}`}
                  className="block w-full text-center bg-purple-700 text-white py-2 rounded-lg btn-transition hover:bg-purple-800"
                >
                  View Activities
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hosts;