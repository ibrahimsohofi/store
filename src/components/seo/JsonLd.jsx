import { useEffect } from 'react';

export default function JsonLd({ data }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [data]);

  return null;
}

export function generateProductJsonLd(product, baseUrl) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url ? [baseUrl + product.image_url] : [],
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'MAD',
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/fr/produit/${product.slug}`,
    },
  };
}

export function generateBreadcrumbJsonLd(items, baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd(baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SOHOFI BRICO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-5-22-00-00-00',
      contactType: 'customer service',
      availableLanguage: ['French', 'Arabic'],
    },
  };
}

export function generateWebSiteJsonLd(baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: 'SOHOFI BRICO',
    description: 'Boutique de bricolage en ligne au Maroc',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/fr/recherche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
