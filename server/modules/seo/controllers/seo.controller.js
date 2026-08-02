import { seoService } from '../services/seo.service.js';

export const seoController = {
  async getSitemap(req, res) {
    try {
      const sitemap = await seoService.generateSitemap();
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  },

  async getRobotsTxt(req, res) {
    try {
      const robots = await seoService.generateRobotsTxt();
      res.set('Content-Type', 'text/plain');
      res.send(robots);
    } catch (error) {
      res.status(500).send('Error generating robots.txt');
    }
  },
};
