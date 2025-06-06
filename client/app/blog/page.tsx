"use client"

import { useEffect, useState } from 'react';
import { Categories } from '../types/post'; // Import the types you defined earlier
import { Posts } from '../types/posts'; // Import the types you defined earlier
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaSearch, FaAngleRight } from 'react-icons/fa';

const Blog = () => {
  const [posts, setPosts] = useState<Posts>([]);
  const [categories, setCategories] = useState<Categories>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://expaq.starrstudio.pro/wp-json/wp/v2/posts?_embed');
        const data: Posts = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchcategories = async () => {
      try {
        const response = await fetch('https://expaq.starrstudio.pro/wp-json/wp/v2/categories/');
        const data: Categories = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchcategories();
  }, []);


  const recentPosts = [
    { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', image: '/img/blog-100x100.jpg' },
    { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', image: '/img/blog-100x100.jpg' },
    { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', image: '/img/blog-100x100.jpg' },
  ];

  const tags = ['Design', 'Development', 'Marketing', 'SEO', 'Writing', 'Consulting'];

  return (
    <div className="container mx-auto py-10 w-11/12 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="mb-6">
                <div className="blog-item bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative">
                    <Image
                      src={post._embedded?.['wp:featuredmedia']?.[0].media_details.sizes.full.source_url || '/img/blog-100x100.jpg'}
                      alt="Blog Image"
                      width={400}
                      height={250}
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-2 rounded">
                      <h6 className="font-bold text-xl mb-0">01</h6>
                      <small className="uppercase">Jan</small>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2 text-sm">
                      <Link href="#" className="text-primary uppercase no-underline">{post._embedded?.author?.[0]?.name || "Admin"}</Link>
                      <span className="text-primary px-2">|</span>
                      <Link href="#" className="text-primary uppercase no-underline">{post._embedded?.['wp:term']?.[0]?.[0]?.name || "Category"}</Link>
                    </div>
                    <Link href={`/blog/${post.id}`} className="font-medium text-gray-800 hover:text-primary no-underline">
                      {post.title.rendered}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="my-8">
            <ul className="flex justify-center bg-white rounded-lg py-4 px-8 shadow-md">
              <li className="mx-1">
                <span className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed rounded-md">
                  &laquo;
                </span>
              </li>
              <li className="mx-1">
                <Link href="#" className="px-4 py-2 bg-primary text-white rounded-md">
                  1
                </Link>
              </li>
              <li className="mx-1">
                <Link href="#" className="px-4 py-2 text-primary hover:bg-blue-100 rounded-md">
                  2
                </Link>
              </li>
              <li className="mx-1">
                <Link href="#" className="px-4 py-2 text-primary hover:bg-blue-100 rounded-md">
                  3
                </Link>
              </li>
              <li className="mx-1">
                <Link href="#" className="flex items-center px-4 py-2 text-primary hover:bg-blue-100 rounded-md">
                  &raquo;
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="lg:col-span-4">
          {/* Author Bio */}
          <div className="flex flex-col items-center text-center bg-white rounded-lg mb-8 py-6 px-4 shadow-md">
            <Image
              src="/img/user.jpg"
              alt="Author"
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <h3 className="text-primary mb-3 font-semibold">{posts[0]?._embedded?.author?.[0]?.name || "Admin"}</h3>
            <p className="text-gray-600 mb-4">
              {posts[0]?._embedded?.author?.[0]?.description || "Admin"}
            </p>
            <div className="flex justify-center">
              <Link href="#" className="text-primary mx-2 hover:text-blue-700"><FaFacebookF /></Link>
              <Link href="#" className="text-primary mx-2 hover:text-blue-700"><FaTwitter /></Link>
              <Link href="#" className="text-primary mx-2 hover:text-blue-700"><FaLinkedinIn /></Link>
              <Link href="#" className="text-primary mx-2 hover:text-blue-700"><FaInstagram /></Link>
              <Link href="#" className="text-primary mx-2 hover:text-blue-700"><FaYoutube /></Link>
            </div>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex">
                <input
                  type="text"
                  className="form-input px-4 py-3 rounded-l-lg w-full border-gray-300 focus:ring-primary focus:border-primary"
                  placeholder="Keyword"
                />
                <button className="bg-primary text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="mb-8">
            <h4 className="text-gray-800 uppercase mb-4 tracking-widest font-semibold">Categories</h4>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <ul className="m-0">
                {categories?.map((category, index) => (
                  <li key={index} className="mb-3 flex justify-between items-center">
                    <Link href="#" className="text-gray-700 hover:text-primary flex items-center">
                      <FaAngleRight className="text-primary mr-2" />
                      {category.name}
                    </Link>
                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Post */}
          <div className="mb-8">
            <h4 className="text-gray-800 uppercase mb-4 tracking-widest font-semibold">Recent Post</h4>
            {recentPosts.map((post, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center bg-white rounded-lg mb-3 overflow-hidden shadow-md hover:shadow-lg transition-shadow no-underline"
              >
                <Image
                  src={post.image}
                  alt="Recent Post"
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover"
                />
                <div className="pl-3 p-2">
                  <h6 className="text-gray-800 hover:text-primary m-1 text-sm">{post.title}</h6>
                  <small className="text-gray-500">{post.date}</small>
                </div>
              </Link>
            ))}
          </div>

          {/* Tag Cloud */}
          <div className="mb-8">
            <h4 className="text-gray-800 uppercase mb-4 tracking-widest font-semibold">Tag Cloud</h4>
            <div className="flex flex-wrap -m-1">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  href="#"
                  className="bg-gray-100 hover:bg-primary hover:text-white text-gray-700 px-3 py-1 m-1 rounded-md transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;