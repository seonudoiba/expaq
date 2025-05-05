interface Guid {
    rendered: string;
  }
  
  interface Title {
    rendered: string;
  }
  
  interface Content {
    rendered: string;
    protected: boolean;
  }
  
  interface Excerpt {
    rendered: string;
    protected: boolean;
  }
  
  interface Meta {
    footnotes: string;
  }
  
  interface Links {
    self: Array<{ href: string; targetHints?: { allow: string[] } }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    "version-history": Array<{ count: number; href: string }>;
    "wp:attachment": Array<{ href: string }>;
    "wp:term": Array<{ taxonomy: string; embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  }
  
  export interface Author {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls: {
      "24": string;
      "48": string;
      "96": string;
    };
    _links: {
      self: Array<{ href: string; targetHints?: { allow: string[] } }>;
      collection: Array<{ href: string }>;
    };
  }
  
  interface Category {
    id: number;
    link: string;
    count: number;
    name: string;
    slug: string;
    taxonomy: string;
    _links: {
      self: Array<{ href: string; targetHints?: { allow: string[] } }>;
      collection: Array<{ href: string }>;
      about: Array<{ href: string }>;
      "wp:post_type": Array<{ href: string }>;
      curies: Array<{ name: string; href: string; templated: boolean }>;
    };
  }
  interface Reply {
    id: number;
    parent: number;
    author: number;
    author_name: string;
    author_url: string;
    date: string;
    content: {
      rendered: string;
    };
    link: string;
    type: string;
    author_avatar_urls: {
      "24": string;
      "48": string;
      "96": string;
    };
    _links: {
      self: Array<{ href: string; targetHints?: { allow: string[] } }>;
      collection: Array<{ href: string }>;
      up: Array<{ embeddable: boolean; post_type: string; href: string }>;
    };
  }
  
  interface Term {
    id: number;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    _links: {
      self: Array<{ href: string; targetHints?: { allow: string[] } }>;
      collection: Array<{ href: string }>;
      about: Array<{ href: string }>;
      "wp:post_type": Array<{ href: string }>;
      curies: Array<{ name: string; href: string; templated: boolean }>;
    };
  }
  
  interface Embedded {
    author: Author[];
    replies: Reply[][];
    "wp:term": Term[][];
  }
  
  export interface Post {
    id: number;
    date: string;
    date_gmt: string;
    guid: Guid;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: Title;
    content: Content;
    excerpt: Excerpt;
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    meta: Meta;
    categories: number[];
    tags: number[];
    class_list: string[];
    _links: Links;
    _embedded: Embedded;
  }
  
  export type Posts = Post[];
  export type Categories = Category[];