import { Activity } from '@/types/activity';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const seoService = {
  /**
   * Generate SEO metadata for home page
   */
  getHomePageSEO: (): SEOMetadata => ({
    title: 'Expaq - Discover Amazing Local Activities & Experiences',
    description: 'Find and book unique local activities, tours, and experiences with Expaq. Connect with local hosts and discover hidden gems in your city or travel destination.',
    keywords: ['local activities', 'experiences', 'tours', 'booking', 'travel', 'adventures', 'things to do'],
    ogTitle: 'Expaq - Discover Amazing Local Activities & Experiences',
    ogDescription: 'Find and book unique local activities, tours, and experiences with Expaq.',
    ogType: 'website',
    ogImage: '/images/og-home.jpg',
    twitterCard: 'summary_large_image',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Expaq',
      url: 'https://expaq.com',
      description: 'Platform for discovering and booking local activities and experiences',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://expaq.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  }),

  /**
   * Generate SEO metadata for activity pages
   */
  getActivityPageSEO: (activity: Activity): SEOMetadata => {
    const title = `${activity.title} - Book Now on Expaq`;
    const description = activity.description.length > 160 
      ? activity.description.substring(0, 157) + '...'
      : activity.description;
    
    const keywords = [
      activity.title.toLowerCase(),
      activity.city?.name.toLowerCase() || activity.address.toLowerCase(),
      activity.activityType?.name.toLowerCase() || 'activity',
      'booking',
      'experience',
      'local',
      'tour'
    ];

    return {
      title,
      description,
      keywords,
      canonicalUrl: `/activities/${activity.id}`,
      ogTitle: title,
      ogDescription: description,
      ogImage: activity.mediaUrls?.[0] || '/images/og-default-activity.jpg',
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: activity.mediaUrls?.[0] || '/images/og-default-activity.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: activity.title,
        description: activity.description,
        image: activity.mediaUrls?.map(photo => photo) || [],
        brand: {
          '@type': 'Brand',
          name: 'Expaq'
        },
        offers: {
          '@type': 'Offer',
          price: activity.price,
          priceCurrency: 'USD',
          availability: activity.active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: activity.hostName || 'Expaq Host'
          }
        },
        aggregateRating: activity.averageRating ? {
          '@type': 'AggregateRating',
          ratingValue: activity.averageRating,
          reviewCount: activity.totalReviews || 0,
          bestRating: 5,
          worstRating: 1
        } : undefined,
        location: {
          '@type': 'Place',
          name: activity.city?.name || activity.address,
          address: activity.city?.name || activity.address
        }
      }
    };
  },

  /**
   * Generate SEO metadata for search results pages
   */
  getSearchPageSEO: (query?: string, location?: string, category?: string): SEOMetadata => {
    let title = 'Search Activities';
    let description = 'Find amazing local activities and experiences';
    const keywords = ['search', 'activities', 'experiences', 'local', 'booking'];

    if (query) {
      title = `${query} Activities - Search Results`;
      description = `Find ${query} activities and experiences to book`;
      keywords.unshift(query.toLowerCase());
    }

    if (location) {
      title += ` in ${location}`;
      description += ` in ${location}`;
      keywords.push(location.toLowerCase());
    }

    if (category) {
      title += ` - ${category}`;
      description += ` in the ${category} category`;
      keywords.push(category.toLowerCase());
    }

    title += ' | Expaq';

    return {
      title,
      description,
      keywords,
      canonicalUrl: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website'
    };
  },

  /**
   * Generate SEO metadata for location pages
   */
  getLocationPageSEO: (location: string, type: 'city' | 'country'): SEOMetadata => {
    const title = `Best Activities in ${location} - Book Local Experiences | Expaq`;
    const description = `Discover the best things to do in ${location}. Book unique local activities, tours, and experiences with trusted hosts on Expaq.`;
    
    return {
      title,
      description,
      keywords: [
        location.toLowerCase(),
        'activities',
        'things to do',
        'experiences',
        'tours',
        'local',
        'booking',
        type === 'city' ? 'city guide' : 'travel guide'
      ],
      canonicalUrl: `/${type === 'city' ? 'cities' : 'countries'}/${location.toLowerCase().replace(/\s+/g, '-')}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Place',
        name: location,
        description: `Activities and experiences in ${location}`,
        url: `https://expaq.com/${type === 'city' ? 'cities' : 'countries'}/${location.toLowerCase().replace(/\s+/g, '-')}`
      }
    };
  },

  /**
   * Generate SEO metadata for category pages
   */
  getCategoryPageSEO: (category: string): SEOMetadata => {
    const title = `${category} Activities & Experiences - Book Now | Expaq`;
    const description = `Find and book amazing ${category.toLowerCase()} activities and experiences. Connect with local hosts and discover unique adventures.`;
    
    return {
      title,
      description,
      keywords: [
        category.toLowerCase(),
        'activities',
        'experiences',
        'booking',
        'local',
        'adventures'
      ],
      canonicalUrl: `/activity-types/${category.toLowerCase().replace(/\s+/g, '-')}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website'
    };
  },

  /**
   * Generate SEO metadata for host profile pages
   */
  getHostProfileSEO: (hostName: string, location?: string): SEOMetadata => {
    const title = `${hostName} - Local Host & Experience Guide | Expaq`;
    const description = `Book activities and experiences with ${hostName}${location ? ` in ${location}` : ''}. Trusted local host offering unique adventures on Expaq.`;
    
    return {
      title,
      description,
      keywords: [
        hostName.toLowerCase(),
        'host',
        'guide',
        'local expert',
        'activities',
        'experiences',
        ...(location ? [location.toLowerCase()] : [])
      ],
      ogTitle: title,
      ogDescription: description,
      ogType: 'profile'
    };
  },

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbSchema: (breadcrumbs: BreadcrumbItem[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://expaq.com${item.url}`
    }))
  }),

  /**
   * Generate FAQ structured data
   */
  generateFAQSchema: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }),

  /**
   * Generate organization structured data
   */
  generateOrganizationSchema: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Expaq',
    url: 'https://expaq.com',
    logo: 'https://expaq.com/images/logo.png',
    description: 'Platform for discovering and booking local activities and experiences',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-EXPAQ-01',
      contactType: 'customer service',
      email: 'support@expaq.com'
    },
    sameAs: [
      'https://facebook.com/expaq',
      'https://twitter.com/expaq',
      'https://instagram.com/expaq',
      'https://linkedin.com/company/expaq'
    ]
  }),

  /**
   * Generate local business structured data for activities
   */
  generateLocalBusinessSchema: (activity: Activity) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: activity.title,
    description: activity.description,
    image: activity.mediaUrls?.[0] || '/images/og-default-activity.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: activity.city?.name || activity.address
    },
    geo: activity.latitude && activity.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: activity.latitude,
      longitude: activity.longitude
    } : undefined,
    aggregateRating: activity.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: activity.averageRating,
      reviewCount: activity.totalReviews || 0
    } : undefined,
    priceRange: activity.price ? `$${activity.price}` : undefined
  }),

  /**
   * Generate sitemap URLs
   */
  generateSitemapUrls: (activities: Activity[], cities: string[], categories: string[]) => {
    type SitemapUrl = { loc: string; priority: number; changefreq: string; lastmod?: string };
    const urls: SitemapUrl[] = [
      { loc: '/', priority: 1.0, changefreq: 'daily' },
      { loc: '/search', priority: 0.8, changefreq: 'weekly' },
      { loc: '/become-a-host', priority: 0.7, changefreq: 'monthly' },
      { loc: '/support', priority: 0.6, changefreq: 'monthly' },
      { loc: '/about', priority: 0.5, changefreq: 'monthly' },
      { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
      { loc: '/terms', priority: 0.3, changefreq: 'yearly' }
    ];

    // Add activity pages
    activities.forEach(activity => {
      urls.push({
        loc: `/activities/${activity.id}`,
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: activity.updatedAt
      });
    });

    // Add city pages
    cities.forEach(city => {
      urls.push({
        loc: `/cities/${city.toLowerCase().replace(/\s+/g, '-')}`,
        priority: 0.8,
        changefreq: 'weekly'
      });
    });

    // Add category pages
    categories.forEach(category => {
      urls.push({
        loc: `/activity-types/${category.toLowerCase().replace(/\s+/g, '-')}`,
        priority: 0.7,
        changefreq: 'weekly'
      });
    });

    return urls;
  },

  /**
   * Optimize image alt text for SEO
   */
  generateImageAltText: (activity: Activity, imageIndex: number = 0): string => {
    const baseAlt = `${activity.title} in ${activity.city?.name || activity.address}`;

    if (imageIndex === 0) {
      return baseAlt;
    }
    
    return `${baseAlt} - Image ${imageIndex + 1}`;
  },

  /**
   * Generate canonical URL
   */
  generateCanonicalUrl: (path: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://expaq.com';
    return `${baseUrl}${path}`;
  },

  /**
   * Validate and clean SEO text
   */
  cleanSEOText: (text: string, maxLength: number = 160): string => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength);
  },

  /**
   * Generate meta robots directive
   */
  getMetaRobots: (page: string, isPublic: boolean = true): string => {
    if (!isPublic) {
      return 'noindex, nofollow';
    }

    switch (page) {
      case 'search':
        return 'index, follow, max-snippet:-1';
      case 'activity':
      case 'location':
      case 'category':
        return 'index, follow, max-image-preview:large';
      case 'profile':
        return 'index, nofollow';
      default:
        return 'index, follow';
    }
  }
};

export default seoService;