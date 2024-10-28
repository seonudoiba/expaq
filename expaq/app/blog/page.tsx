import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import WordPressPost from "./types";

type Post = {
  title: string;
  file: string;
  description: string;
  date: string;
  datetime: string;
  author: { name: string; role: string; href: string; imageUrl: string };
  imageUrl: string;
};


export const revalidate = 60;

export default async function BlogContentsPage() {
  const posts = await fetchWordPressPosts();

  return (
      <Posts posts={posts} />
  );
}

async function fetchWordPressPosts(): Promise<WordPressPost[]> {
  const response = await fetch('https://expaq.starrstudio.pro/wp-json/wp/v2/posts?_embed');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
}

function Posts({ posts }: { posts: WordPressPost[] }) {
  const allPosts: Post[] = posts.map((post) => ({
    title: post.title.rendered,
    file: post.slug,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags
    date: new Date(post.date).toLocaleDateString(),
    datetime: post.date,
    author: {
      name: post._embedded.author[0].name,
      role: "Author", // Adjust as necessary
      href: "#", // Add author link if available
      imageUrl: post._embedded.author[0].avatar_urls['96'], // Get avatar URL (96px size)
    },
    imageUrl: post._embedded['wp:featuredmedia']?.[0]?.source_url || ""
  }));

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 sm:text-4xl">
          From the blog
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/blog/${post.file}`}>
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="mb-2 font-cal text-lg leading-6 text-gray-900 group-hover:text-gray-600">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
            {post.description}
          </p>
          <div className="flex items-center gap-x-4">
            <Image
              src={post.author.imageUrl}
              alt=""
              className="h-8 w-8 rounded-full bg-gray-50"
              width={32}
              height={32}
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}