import { seoService } from '@/services/seo-service';
import { Activity } from '@/types/activity';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://expaq.com') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate complete sitemap
   */
  async generateSitemap(): Promise<string> {
    const urls = await this.getAllUrls();
    return this.generateSitemapXML(urls);
  }

  /**
   * Generate sitemap index for large sites
   */
  generateSitemapIndex(sitemapUrls: string[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
    return xml;
  }

  /**
   * Get all URLs for sitemap
   */
  private async getAllUrls(): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [];

    // Static pages
    urls.push(...this.getStaticPageUrls());

    // Dynamic pages (these would typically come from API calls)
    urls.push(...await this.getActivityUrls());
    urls.push(...await this.getCityUrls());
    urls.push(...await this.getCategoryUrls());
    urls.push(...await this.getHostUrls());

    return urls;
  }

  /**
   * Get static page URLs
   */
  private getStaticPageUrls(): SitemapUrl[] {
    return [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/search',
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: '/activities',
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: '/cities',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: '/activity-types',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: '/become-a-host',
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: '/help',
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: '/support',
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        loc: '/privacy',
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        loc: '/terms',
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        loc: '/blog',
        changefreq: 'weekly',
        priority: 0.7
      }
    ];
  }

  /**
   * Get activity page URLs
   */
  private async getActivityUrls(): Promise<SitemapUrl[]> {
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll simulate with a mock call
      const activities = await this.fetchActivities();
      
      return activities.map(activity => ({
        loc: `/activities/${activity.id}`,
        changefreq: 'weekly' as const,
        priority: 0.9,
        lastmod: activity.updatedAt || activity.createdAt
      }));
    } catch (error) {
      console.error('Error fetching activities for sitemap:', error);
      return [];
    }
  }

  /**
   * Get city page URLs
   */
  private async getCityUrls(): Promise<SitemapUrl[]> {
    try {
      const cities = await this.fetchCities();
      
      return cities.map(city => ({
        loc: `/cities/${this.slugify(city.name)}`,
        changefreq: 'weekly' as const,
        priority: 0.8,
        lastmod: city.updatedAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching cities for sitemap:', error);
      return [];
    }
  }

  /**
   * Get category page URLs
   */
  private async getCategoryUrls(): Promise<SitemapUrl[]> {
    try {
      const categories = await this.fetchCategories();
      
      return categories.map(category => ({
        loc: `/activity-types/${this.slugify(category.name)}`,
        changefreq: 'weekly' as const,
        priority: 0.7,
        lastmod: category.updatedAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error);
      return [];
    }
  }

  /**
   * Get host profile URLs
   */
  private async getHostUrls(): Promise<SitemapUrl[]> {
    try {
      const hosts = await this.fetchHosts();
      
      return hosts.map(host => ({
        loc: `/hosts/${host.id}`,
        changefreq: 'monthly' as const,
        priority: 0.6,
        lastmod: host.updatedAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching hosts for sitemap:', error);
      return [];
    }
  }

  /**
   * Generate XML sitemap from URLs
   */
  private generateSitemapXML(urls: SitemapUrl[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => this.generateUrlXML(url)).join('\n')}
</urlset>`;
    return xml;
  }

  /**
   * Generate XML for individual URL
   */
  private generateUrlXML(url: SitemapUrl): string {
    let xml = `  <url>
    <loc>${this.baseUrl}${url.loc}</loc>`;

    if (url.lastmod) {
      xml += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }

    if (url.changefreq) {
      xml += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }

    if (url.priority !== undefined) {
      xml += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }

    xml += '\n  </url>';
    return xml;
  }

  /**
   * Create URL slug from text
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .trim();
  }

  /**
   * Mock API calls - replace with actual API calls
   */
  private async fetchActivities(): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }

  private async fetchCities(): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }

  private async fetchCategories(): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }

  private async fetchHosts(): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://expaq.com'): string {
  return `User-agent: *
Allow: /

# Disallow private pages
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /bookings/
Disallow: /settings/
Disallow: /host/
Disallow: /payments/

# Disallow search parameters that don't add value
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*?page=*
Disallow: /*?utm_*

# Allow important search parameters
Allow: /*?q=*
Allow: /*?location=*
Allow: /*?category=*

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for bots
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 1`;
}

/**
 * Generate meta tags for page
 */
export function generateMetaTags(metadata: any): string {
  const tags = [];

  // Basic meta tags
  if (metadata.title) tags.push(`<title>${metadata.title}</title>`);
  if (metadata.description) tags.push(`<meta name="description" content="${metadata.description}">`);
  if (metadata.keywords) tags.push(`<meta name="keywords" content="${metadata.keywords.join(', ')}">`);

  // Open Graph tags
  if (metadata.ogTitle) tags.push(`<meta property="og:title" content="${metadata.ogTitle}">`);
  if (metadata.ogDescription) tags.push(`<meta property="og:description" content="${metadata.ogDescription}">`);
  if (metadata.ogImage) tags.push(`<meta property="og:image" content="${metadata.ogImage}">`);
  if (metadata.ogType) tags.push(`<meta property="og:type" content="${metadata.ogType}">`);

  // Twitter tags
  if (metadata.twitterCard) tags.push(`<meta name="twitter:card" content="${metadata.twitterCard}">`);
  if (metadata.twitterTitle) tags.push(`<meta name="twitter:title" content="${metadata.twitterTitle}">`);
  if (metadata.twitterDescription) tags.push(`<meta name="twitter:description" content="${metadata.twitterDescription}">`);
  if (metadata.twitterImage) tags.push(`<meta name="twitter:image" content="${metadata.twitterImage}">`);

  return tags.join('\n');
}

export default SitemapGenerator;