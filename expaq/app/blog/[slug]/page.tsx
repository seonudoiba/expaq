import type { ResolvingMetadata } from "next";
import { Post } from "./Post";
import WordPressPost from "../types";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await fetchWordPressPosts(); // Fetch all posts to generate static paths
  return posts.map((post: { slug: string; }) => ({ slug: post.slug })); // Return an array of slugs
}

async function fetchWordPressPosts() {
  const response = await fetch('https://expaq.starrstudio.pro/wp-json/wp/v2/posts?_embed');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
}

async function fetchWordPressPost(slug: string): Promise<WordPressPost | null> {
  const response = await fetch(`https://expaq.starrstudio.pro/wp-json/wp/v2/posts?slug=${slug}&_embed`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null; // Return the first post if found
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
) {
  const post = await fetchWordPressPost(params.slug);

  if (!post) {
    return {
        title: 'Post not found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = post._embedded['wp:featuredmedia']?.[0]?.source_url || ""


  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags
    alternates: { canonical: `/blog/post/${params.slug}` },
    openGraph: {
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
    },
  };
}

export default async function Page({ params }: Props) {
  const post = await fetchWordPressPost(params.slug);

  if (!post) {
    return <div>Post not found</div>; // Handle post not found case
  }

  return <Post post={post} />;
}