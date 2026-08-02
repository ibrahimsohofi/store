import { seoRepo } from '../repos/seo.repo.js';

export const seoService = {
  async generateSitemap() {
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    const products = await seoRepo.getAllProducts();
    const categories = await seoRepo.getAllCategories();
    const pages = await seoRepo.getAllPages();

    const urls = [];

    // Home page
    urls.push({
      loc: `${baseUrl}/fr`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    });
    urls.push({
      loc: `${baseUrl}/ar`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    });

    // Categories
    for (const category of categories) {
      urls.push({
        loc: `${baseUrl}/fr/categorie/${category.slug}`,
        lastmod: category.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
      urls.push({
        loc: `${baseUrl}/ar/categorie/${category.slug}`,
        lastmod: category.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
    }

    // Products
    for (const product of products) {
      urls.push({
        loc: `${baseUrl}/fr/produit/${product.slug}`,
        lastmod: product.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.6,
      });
      urls.push({
        loc: `${baseUrl}/ar/produit/${product.slug}`,
        lastmod: product.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.6,
      });
    }

    // Static pages
    for (const page of pages) {
      urls.push({
        loc: `${baseUrl}/fr/p/${page.slug}`,
        lastmod: page.updated_at || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.3,
      });
      urls.push({
        loc: `${baseUrl}/ar/p/${page.slug}`,
        lastmod: page.updated_at || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.3,
      });
    }

    return this.buildSitemapXml(urls);
  },

  buildSitemapXml(urls) {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const urlsetEnd = '</urlset>';

    const urlElements = urls.map((url) => {
      return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    }).join('\n');

    return xmlHeader + urlsetStart + urlElements + '\n' + urlsetEnd;
  },

  async generateRobotsTxt() {
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    
    return `User-agent: *
Allow: /

Disallow: /api/
Disallow: /compte/
Disallow: /panier
Disallow: /commande
Disallow: /?sort=
Disallow: /?page=

Sitemap: ${baseUrl}/sitemap.xml
`;
  },
};
