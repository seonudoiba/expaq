import Link from 'next/link';
import React from 'react';

const Blog: React.FC = () => {
  const blogs = [
    {
      id: 1,
      image: '/img/blog-1.jpg',
      date: { day: '01', month: 'Jan' },
      author: 'Admin',
      category: 'Tours & Travel',
      title: 'Dolor justo sea kasd lorem clita justo diam amet',
    },
    {
      id: 2,
      image: '/img/blog-2.jpg',
      date: { day: '01', month: 'Jan' },
      author: 'Admin',
      category: 'Tours & Travel',
      title: 'Dolor justo sea kasd lorem clita justo diam amet',
    },
    {
      id: 3,
      image: '/img/blog-3.jpg',
      date: { day: '01', month: 'Jan' },
      author: 'Admin',
      category: 'Tours & Travel',
      title: 'Dolor justo sea kasd lorem clita justo diam amet',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 w-11/12">
      <div className="text-center mb-8">
        <h6 className="text-purple-700 uppercase tracking-widest">Our Blog</h6>
        <h1 className="text-4xl font-bold">Latest From Our Blog</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
              <img className="w-full h-48 object-cover" src={blog.image} alt={blog.title} />
              <div className="absolute top-4 right-4 bg-purple-700 text-white text-center p-2 rounded">
                <h6 className="font-bold">{blog.date.day}</h6>
                <small className="text-xs uppercase">{blog.date.month}</small>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center mb-4">
                <Link className="text-purple-700 text-sm uppercase hover:underline" href="#">
                  {blog.author}
                </Link>
                <span className="text-purple-700 px-2">|</span>
                <Link className="text-purple-700 text-sm uppercase hover:underline" href="#">
                  {blog.category}
                </Link>
              </div>
              <Link className="text-xl font-semibold hover:text-purple-700 transition duration-300" href="#">
                {blog.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;