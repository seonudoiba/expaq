import Link from 'next/link';
import React from 'react';

const Hosts: React.FC = () => {
  const guides = [
    { id: 1, image: '/img/team-1.jpg', name: 'Guide Name', designation: 'Designation' },
    { id: 2, image: '/img/team-2.jpg', name: 'Guide Name', designation: 'Designation' },
    { id: 3, image: '/img/team-3.jpg', name: 'Guide Name', designation: 'Designation' },
    { id: 4, image: '/img/team-4.jpg', name: 'Guide Name', designation: 'Designation' },
  ];

  return (
    <div className="container py-12 px-4 w-11/12 mx-auto">
      <div className="text-center mb-8">
        <h6 className="text-purple-700 uppercase tracking-widest">Guides</h6>
        <h1 className="text-4xl font-bold">Our Travel Guides</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide) => (
          <div key={guide.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative overflow-hidden">
              <img className="w-full" src={guide.image} alt={guide.name} />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-300">
                <div className="flex space-x-4">
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-instagram"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center py-6">
              <h5 className="text-xl font-semibold">{guide.name}</h5>
              <p className="text-gray-600">{guide.designation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hosts;