"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type BlogPostPreview = {
  slug: string;
  title: { rendered: string }; // WordPress titles are usually wrapped in an object
  excerpt: { rendered: string }; // Excerpts are also wrapped in an object
  date: string;
  featured_media: number; // ID of the featured media
};

// type Media = {
//   source_url: string; // URL of the media
// };

export function ReadMore() {
  const [blogPosts, setBlogPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('https://expaq.starrstudio.pro/wp-json/wp/v2/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const posts: BlogPostPreview[] = await response.json();
        setBlogPosts(posts);
      } catch (err) {
        setError( err + ": Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {blogPosts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block h-full"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            {/* Fetch the featured media if available */}
            <Image
              src={post.featured_media ? `https://expaq.starrstudio.pro/wp-json/wp/v2/media/${post.featured_media}` : '/placeholder-image.jpg'} // Provide a placeholder image if no media is available
              alt={post.title.rendered}
              width={400}
              height={200}
              className="w-full object-cover"
            />
            <div className="flex flex-grow flex-col bg-white p-4 transition-colors duration-300 ease-in-out hover:bg-gray-50">
              <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 ease-in-out hover:text-blue-600">
                {post.title.rendered}
              </h3>
              <p className="mb-2 flex-grow text-gray-600" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}