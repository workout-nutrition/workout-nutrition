import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = 'WORKOUT NUTRITION – Premium Sports Supplements & Fitness Store';
const DEFAULT_DESCRIPTION =
  "India's premier authentic sports nutrition store. Shop whey protein, creatine, pre-workout, mass gainers, and wellness supplements with verified batch authenticity and fast Pan-India delivery.";

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function updatePageSEO(seo: SEOProps) {
  if (typeof document === 'undefined') return;

  const fullTitle =
    seo.title.includes('Workout Nutrition') || seo.title.includes('WORKOUT NUTRITION')
      ? seo.title
      : `${seo.title} | Workout Nutrition`;

  document.title = fullTitle;

  const description = seo.description?.trim() ? seo.description.trim() : DEFAULT_DESCRIPTION;

  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', seo.type || 'website');

  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', description);

  if (seo.image) {
    setMetaTag('property', 'og:image', seo.image);
    setMetaTag('name', 'twitter:image', seo.image);
  }

  if (seo.keywords) {
    setMetaTag('name', 'keywords', seo.keywords);
  }

  if (typeof window !== 'undefined') {
    const currentUrl = seo.url || window.location.href;
    setMetaTag('property', 'og:url', currentUrl);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }
}

/**
 * Custom React hook for dynamic per-page Meta Title, Meta Description & Social OpenGraph tags.
 */
export function usePageSEO(props: SEOProps) {
  useEffect(() => {
    updatePageSEO(props);
  }, [props.title, props.description, props.image, props.url, props.type, props.keywords]);
}
