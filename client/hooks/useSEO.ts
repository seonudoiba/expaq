"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { seoService, SEOMetadata } from '@/services/seo-service';

interface UseSEOOptions {
  metadata: SEOMetadata;
  noIndex?: boolean;
  preloadImages?: string[];
  structuredData?: any;
}

export function useSEO({ metadata, noIndex = false, preloadImages = [], structuredData }: UseSEOOptions) {
  const router = useRouter();

  useEffect(() => {
    // Update document title
    document.title = metadata.title;

    // Update meta description
    updateMetaTag('description', metadata.description);

    // Update meta keywords
    if (metadata.keywords.length > 0) {
      updateMetaTag('keywords', metadata.keywords.join(', '));
    }

    // Update robots meta tag
    const robotsContent = noIndex ? 'noindex, nofollow' : seoService.getMetaRobots('default');
    updateMetaTag('robots', robotsContent);

    // Update canonical URL
    if (metadata.canonicalUrl) {
      updateCanonicalUrl(metadata.canonicalUrl);
    }

    // Update Open Graph tags
    updateMetaProperty('og:title', metadata.ogTitle || metadata.title);
    updateMetaProperty('og:description', metadata.ogDescription || metadata.description);
    updateMetaProperty('og:type', metadata.ogType || 'website');
    updateMetaProperty('og:url', window.location.href);
    
    if (metadata.ogImage) {
      updateMetaProperty('og:image', metadata.ogImage);
      updateMetaProperty('og:image:alt', metadata.ogTitle || metadata.title);
    }

    // Update Twitter Card tags
    updateMetaName('twitter:card', metadata.twitterCard || 'summary_large_image');
    updateMetaName('twitter:title', metadata.twitterTitle || metadata.ogTitle || metadata.title);
    updateMetaName('twitter:description', metadata.twitterDescription || metadata.ogDescription || metadata.description);
    
    if (metadata.twitterImage || metadata.ogImage) {
      updateMetaName('twitter:image', metadata.twitterImage || metadata.ogImage!);
    }

    // Add structured data
    if (metadata.structuredData || structuredData) {
      addStructuredData(metadata.structuredData || structuredData);
    }

    // Preload critical images
    preloadImages.forEach(preloadImage);

    // Track page view for analytics
    trackPageView();

    // Cleanup function
    return () => {
      removeStructuredData();
    };
  }, [metadata, noIndex, preloadImages, structuredData]);

  // Update or create meta tag
  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update or create meta property
  const updateMetaProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update or create meta name
  const updateMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update canonical URL
  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    canonical.setAttribute('href', fullUrl);
  };

  // Add structured data
  const addStructuredData = (data: any) => {
    removeStructuredData(); // Remove existing
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  // Remove structured data
  const removeStructuredData = () => {
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
  };

  // Preload image
  const preloadImage = (src: string) => {
    if (!src) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  // Track page view for analytics
  const trackPageView = () => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: metadata.title,
        page_location: window.location.href,
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }

    // Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.page({
        title: metadata.title,
        url: window.location.href,
      });
    }
  };
}

/**
 * Hook for dynamic SEO updates
 */
export function useDynamicSEO() {
  const updateSEO = (updates: Partial<SEOMetadata>) => {
    if (updates.title) {
      document.title = updates.title;
    }

    if (updates.description) {
      updateMetaTag('description', updates.description);
    }

    if (updates.ogImage) {
      updateMetaProperty('og:image', updates.ogImage);
    }

    // Add more dynamic updates as needed
  };

  const updateMetaTag = (name: string, content: string) => {
    const meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) {
      meta.setAttribute('content', content);
    }
  };

  const updateMetaProperty = (property: string, content: string) => {
    const meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) {
      meta.setAttribute('content', content);
    }
  };

  return { updateSEO };
}

/**
 * Hook for tracking user interactions for SEO
 */
export function useSEOTracking() {
  const trackInteraction = (action: string, category: string, label?: string) => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }

    // Custom tracking
    console.log(`SEO Tracking: ${action} - ${category}${label ? ` - ${label}` : ''}`);
  };

  const trackSearch = (query: string, results: number) => {
    trackInteraction('search', 'site_search', query);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: results,
      });
    }
  };

  const trackBooking = (activityId: string, activityTitle: string) => {
    trackInteraction('booking_started', 'engagement', activityTitle);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        currency: 'USD',
        item_id: activityId,
        item_name: activityTitle,
      });
    }
  };

  const trackShare = (platform: string, url: string) => {
    trackInteraction('share', 'social', platform);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: platform,
        content_type: 'activity',
        item_id: url,
      });
    }
  };

  return {
    trackInteraction,
    trackSearch,
    trackBooking,
    trackShare,
  };
}

declare global {
  function gtag(...args: any[]): void;
  function fbq(...args: any[]): void;
}