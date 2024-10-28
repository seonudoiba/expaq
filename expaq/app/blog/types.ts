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
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: true; href: string }[];
    replies: { embeddable: true; href: string }[];
    "version-history": { count: number; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": { taxonomy: string; embeddable: true; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  }
  
  interface EmbeddedAuthor {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls: {
      24: string;
      48: string;
      96: string;
    };
    extendify_library_user: boolean;
    _links: {
      self: { href: string }[];
      collection: { href: string }[];
    };
  }
  
  interface EmbeddedComment {
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
      24: string;
      48: string;
      96: string;
    };
    _links: {
      self: { href: string }[];
      collection: { href: string }[];
      up: { embeddable: true; post_type: string; href: string }[];
    };
  }
  
  interface EmbeddedTerm {
    id: number;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    _links: {
      self: { href: string }[];
      collection: { href: string }[];
      about: { href: string }[];
      "wp:post_type": { href: string }[];
      curies: { name: string; href: string; templated: boolean }[];
    };
  }
  interface EmbeddedFeaturedMedia {
    id: number;
    date: string;
    type: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    title: {
        rendered: string;
    }
    caption: {
        rendered: string;
    }
    alt_text: string;
    media_type: string;
    mime_type: string;
    source_url: string;
    media_details: {
        width: number;
        height: number;
        file: string;
        sizes: {
            thumbnail: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
            medium: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
            medium_large: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
            large: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
            full: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
        }
    }
  }
  

  interface Embedded {
    author: EmbeddedAuthor[];
    replies: EmbeddedComment[][];
    "wp:featuredmedia": EmbeddedFeaturedMedia[];
    "wp:term": EmbeddedTerm[][];
  }
  
  class WordPressPost {
    id!: number;
    date!: string;
    date_gmt!: string;
    guid!: Guid;
    modified!: string;
    modified_gmt!: string;
    slug!: string;
    status!: string;
    type!: string;
    link!: string;
    title!: Title;
    content!: Content;
    excerpt!: Excerpt;
    author!: number;
    featured_media!: number;
    comment_status!: string;
    ping_status!: string;
    sticky!: boolean;
    template!: string;
    format!: string;
    meta!: Meta;
    categories!: number[];
    tags!: any[];
    class_list!: string[];
    _links!: Links;
    _embedded!: Embedded;
  
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
  export default WordPressPost;