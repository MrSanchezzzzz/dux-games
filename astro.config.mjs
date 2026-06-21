import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mrsanchezzzzz.github.io',
  base: '/dux-games',
  output: 'static',
  vite: {
    plugins: [{
      name: 'public-dir-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.endsWith('/') && !req.url.includes('?')) {
            req.url += 'index.html';
          }
          next();
        });
      }
    }]
  }
});
