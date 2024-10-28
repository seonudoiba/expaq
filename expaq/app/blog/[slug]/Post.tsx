"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  type PortableTextBlock,
  type PortableTextComponentProps,
} from "@portabletext/react";
import { Prose } from "../components/Prose";
import { Card, CardContent } from "@/components/ui/card";
import { ReadMore } from "../components/ReadMore";


type WordPressPost = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number; // Assuming this is the ID of the featured image
  author: number; // Assuming this is the ID of the author
};

export function Post({ post }: { post: WordPressPost }) {
  // Fetch the featured image and author data using the IDs
  const featuredImageUrl = `https://expaq.starrstudio.pro/wp-json/wp/v2/media/${post.featured_media}`;
  const authorUrl = `https://expaq.starrstudio.pro/wp-json/wp/v2/users/${post.author}`;

  return (
    <article className="mx-auto grid w-full max-w-screen-xl gap-5 px-0 pt-16 md:grid-cols-4 md:pt-24 lg:gap-4 lg:px-20">
      <main className="md:col-span-3">
        <Card>
          <CardContent className="p-10">
            <Prose>
              <h1>{post.title.rendered}</h1>
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </Prose>
          </CardContent>
        </Card>

        <div className="mt-24">
          <ReadMore />
        </div>
      </main>
      <aside className="hidden md:block">
        <div className="sticky top-20">

          <Card className="mb-4">
            <CardContent className="pt-6">
              <h3 className="mb-2 text-lg font-semibold">Written by</h3>
              {/* Fetch and display author information */}
              <AuthorInfo authorUrl={authorUrl} />
            </CardContent>
          </Card>
        </div>
      </aside>
    </article>
  );
}

const AuthorInfo = ({ authorUrl }: { authorUrl: string }) => {
  const [author, setAuthor] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchAuthor = async () => {
      const response = await fetch(authorUrl);
      if (response.ok) {
        const authorData = await response.json();
        setAuthor(authorData);
      }
    };
    fetchAuthor();
  }, [authorUrl]);

  return (
    <div className="flex items-center">
      {author && author.avatar_urls?.[96] && (
        <Image
          src={author.avatar_urls[96]}
          alt={author.name}
          className="mr-3 h-10 w-10 rounded-full"
          width={40}
          height={40}
        />
      )}
      <div>
        <p className="font-medium">{author?.name}</p>
        {author?.twitter && (
          <Link
            href={`https://twitter.com/${author.twitter}`}
            className="text-sm text-gray-500"
            target="_blank"
          >
            @{author.twitter}
          </Link>
        )}
      </div>
    </div>
  );
};

const createHeadingComponent =
  (Tag: "h2" | "h3") =>
  ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => {
    // const text = extractTextFromPortableTextBlock(value);
    // const id = slugify(text);

    return (
        <div>Tag</div>
    //   <Tag id={id} className="group relative flex items-center">
    //     <Link href={`#${id}`} className="flex items-center">
    //       <span className="absolute left-0 -translate-x-full pr-2 opacity-0 transition-opacity group-hover:opacity-100">
    //         <LinkIcon className="size-4" />
    //       </span>
    //       {children}
    //     </Link>
    //   </Tag>
    );
  };