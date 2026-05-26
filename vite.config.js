import path from 'node:path';
import { pathToFileURL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const FUNCTIONS_DIR = 'netlify/functions';
const API_PREFIXES = ['/api/', '/.netlify/functions/'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of Object.keys(env)) {
    if (process.env[key] === undefined) process.env[key] = env[key];
  }

  return {
    plugins: [react(), netlifyFunctionsPlugin()],
    server: { host: '127.0.0.1' },
  };
});

function netlifyFunctionsPlugin() {
  return {
    name: 'local-netlify-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const prefix = API_PREFIXES.find((entry) => url.startsWith(entry));
        if (!prefix) return next();

        const [pathPart, queryPart = ''] = url.slice(prefix.length).split('?');
        const fnName = pathPart.split('/')[0];
        if (!fnName || fnName.startsWith('_')) return next();

        try {
          const fnPath = path.resolve(process.cwd(), FUNCTIONS_DIR, `${fnName}.js`);
          const mod = await server.ssrLoadModule(pathToFileURL(fnPath).href);
          if (typeof mod.handler !== 'function') {
            res.statusCode = 500;
            res.end(`Function "${fnName}" has no exported handler`);
            return;
          }

          const body = await readRequestBody(req);
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body,
            queryStringParameters: Object.fromEntries(new URLSearchParams(queryPart)),
            path: `/${pathPart}`,
          };

          const result = (await mod.handler(event)) || {};
          res.statusCode = result.statusCode || 200;
          for (const [key, value] of Object.entries(result.headers || {})) {
            res.setHeader(key, value);
          }
          res.end(result.body ?? '');
        } catch (error) {
          console.error(`[netlify-fn:${fnName}]`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Function error' }));
        }
      });
    },
  };
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(chunks.length ? Buffer.concat(chunks).toString('utf8') : ''));
    req.on('error', reject);
  });
}
