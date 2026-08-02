import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import compression from 'compression';
import { LOCALES, DEFAULT_LOCALE, isRtl } from '../shared/constants.js';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const app = express();
app.use(compression());

/** @type {import('vite').ViteDevServer | undefined} */
let vite;
let templateProd = '';
let renderProd;

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    server: { middlewareMode: true, host: true, allowedHosts: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
} else {
  templateProd = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8');
  renderProd = (await import(path.resolve('dist/server/entry-server.js'))).render;
  app.use(express.static('dist/client', { index: false }));
}

/** Locale of the request, derived from the `/fr` · `/ar` URL prefix. */
function localeOf(url) {
  const seg = url.split('?')[0].split('/').filter(Boolean)[0];
  return LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
}

app.use('*', async (req, res) => {
  const url = req.originalUrl;

  try {
    let template;
    let render;

    if (isProduction) {
      template = templateProd;
      render = renderProd;
    } else {
      template = await vite.transformIndexHtml(
        url,
        fs.readFileSync(path.resolve('index.html'), 'utf-8')
      );
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    }

    const { html, head } = render(url);
    const locale = localeOf(url);

    const page = template
      .replace('<html lang="fr" dir="ltr">', `<html lang="${locale}" dir="${isRtl(locale) ? 'rtl' : 'ltr'}">`)
      .replace('<!--app-head-->', head ?? '')
      .replace('<!--app-html-->', html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).end(e.stack ?? e.message);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
