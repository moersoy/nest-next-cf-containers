import { Container } from '@cloudflare/containers';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { timing } from 'hono/timing';
import { poweredBy } from 'hono/powered-by';

// Environment types for Cloudflare
interface CloudflareEnv {
  WORKER_ENV?: string;
  DEBUG_MODE?: string;
  API_CONTAINER: DurableObjectNamespace;
  WEB_CONTAINER: DurableObjectNamespace;
  CUSTOM_CF_WORKER: Fetcher;
}

// API Container Class with lifecycle hooks
export class APIContainer extends Container {
  defaultPort = 3000;
  sleepAfter = '10m';
  envVars = {
    NODE_ENV: "production",
    PORT: "3000",
    CLOUDFLARE_API_CONTAINER: "true"
  };

  override onStart() {
    console.log('🚀 NestJS API Container started');
  }

  override onStop() {
    console.log('🛑 NestJS API Container stopping');
  }

  override onError(error: unknown) {
    console.error('❌ API Container error:', error);
  }
}

// Web Container Class with lifecycle hooks
export class WebContainer extends Container {
  defaultPort = 3001;
  sleepAfter = '10m';
  envVars = {
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    PORT: "3001",
    API_URL: "http://localhost:3000",
    CLOUDFLARE_WEB_CONTAINER: "true"
  };

  override onStart() {
    console.log('🌐 Next.js Web Container started');
  }

  override onStop() {
    console.log('🛑 Web Container stopping');
  }

  override onError(error: unknown) {
    console.error('❌ Web Container error:', error);
  }
}

const app = new Hono<{ Bindings: CloudflareEnv }>();

app.use('*', logger());
app.use('*', timing());
app.use('*', poweredBy());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Performance monitoring middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const responseTime = Date.now() - start;
  
  c.res.headers.set('X-Response-Time', `${responseTime}ms`);
  
  if (c.env.DEBUG_MODE === 'true') {
    console.log(`✅ Request completed in ${responseTime}ms`);
  }
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    worker: 'nest-next-cf-containers-beta',
    version: '2.0.0-beta',
    pattern: 'Lifecycle-Hooks-Pattern',
    containers: {
      api: 'Available with hooks',
      web: 'Available with hooks',
    },
    uptime: Date.now(),
  });
});

app.get('/worker-info', (c) => {
  return c.json({
    name: 'Nest + Next CF Container Router Beta',
    version: '2.0.0-beta',
    framework: 'Hono',
    containers: {
      api: 'NestJS (Cloudflare Container Beta with Hooks)',
      web: 'Next.js + Tailwind (Cloudflare Container Beta with Hooks)',
    },
    features: [
      'TypeScript',
      'Cloudflare Containers Beta',
      'Lifecycle Hooks (onStart, onStop, onError)',
      'Durable Objects backing',
      'Environment Variables',
      'Multi-container routing',
      'CORS support',
      'Performance monitoring',
      'Error handling',
      'Observability enabled',
    ],
    pattern: 'Container Class with Lifecycle Hooks',
  });
});

// New route to fetch from another worker via service binding
// https://developers.cloudflare.com/workers/runtime-apis/fetch/
app.get('/fetch-json', async (c) => {
  console.log('➡️ Fetching from CUSTOM_CF_WORKER worker...');
  if (!c.env.CUSTOM_CF_WORKER) {
    return c.json({ error: 'CUSTOM_CF_WORKER binding not found' }, 500);
  }
  // Forward the request to the bound service and return its response
  return c.env.CUSTOM_CF_WORKER.fetch(c.req.raw);
});

// API routes - proxy to NestJS container with new pattern
app.all('/api/*', async (c) => {
  try {
    const pathname = c.req.path;
    console.log(`🔄 API Request: ${pathname}`);
    // Check if Container bindings exist
    if (!c.env.API_CONTAINER) {
      throw new Error('API_CONTAINER binding not found in environment');
    }
    
    console.log(`🔍 Environment debug:`, {
      API_CONTAINER: !!c.env.API_CONTAINER,
      WEB_CONTAINER: !!c.env.WEB_CONTAINER,
      WORKER_ENV: c.env.WORKER_ENV,
      envKeys: Object.keys(c.env)
    });
    
    // Get container instance using Durable Object pattern
    const apiId = c.env.API_CONTAINER.idFromName('api-main');
    const apiContainer = c.env.API_CONTAINER.get(apiId);
    
    const response = await apiContainer.fetch(c.req.raw);

    console.log('🔍 API Response:', response);
    
    return new Response(response.body, response);;
  } catch (error) {
    console.error(`❌ API Container Error:`, error);
    return c.json({
      error: 'API Container Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      path: c.req.path,
      timestamp: new Date().toISOString(),
      container: 'APIContainer-Beta',
      pattern: 'Lifecycle-Hooks',
    }, 500);
  }
});

// Container status endpoint with advanced monitoring
app.get('/container-status', async (c) => {
  try {
    const apiId = c.env.API_CONTAINER.idFromName('api-main');
    const webId = c.env.WEB_CONTAINER.idFromName('web-main');
    
    const apiContainer = c.env.API_CONTAINER.get(apiId);
    const webContainer = c.env.WEB_CONTAINER.get(webId);
    
    const apiStatus = await checkContainerHealth(apiContainer, '/api/health');
    const webStatus = await checkContainerHealth(webContainer, '/');
    
    return c.json({
      containers: {
        api: {
          status: apiStatus,
          pattern: 'Lifecycle-Hooks',
          hooks: ['onStart', 'onStop', 'onError'],
          id: apiId.toString()
        },
        web: {
          status: webStatus,
          pattern: 'Lifecycle-Hooks', 
          hooks: ['onStart', 'onStop', 'onError'],
          id: webId.toString()
        },
      },
      overall: apiStatus === 'healthy' && webStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      observability: 'enabled',
    });
  } catch (error) {
    return c.json({
      error: 'Container status check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      pattern: 'Lifecycle-Hooks-Error',
    }, 500);
  }
});

// Catch-all for web routes - proxy to Next.js container with new pattern
app.all('*', async (c) => {
  try {
    const pathname = c.req.path;
    console.log(`🌐 Web Request: ${pathname}`);
    
    // Get container instance using Durable Object pattern
    const webId = c.env.WEB_CONTAINER.idFromName('web-main');
    const webContainer = c.env.WEB_CONTAINER.get(webId);
    
    const response = await webContainer.fetch(c.req.raw);
    
    // If the response is a WebSocket upgrade (status 101), pass it through directly.
    if (response.status === 101) {
      return response;
    }
    
    // For all other responses, clone them to add custom headers.
    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set('X-Container', 'WebContainer-Beta-Hooks');
    modifiedResponse.headers.set('X-Container-Type', 'Next.js-Web');
    return modifiedResponse;

  } catch (error) {
    console.error(`❌ Web Container Error:`, error);
    return c.json({
      error: 'Web Container Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      path: c.req.path,
      timestamp: new Date().toISOString(),
      container: 'WebContainer-Beta',
      pattern: 'Lifecycle-Hooks',
    }, 500);
  }
});

// Helper function to check container health
async function checkContainerHealth(container: DurableObjectStub, healthPath: string): Promise<string> {
  try {
    const healthRequest = new Request(`http://localhost${healthPath}`, {
      method: 'GET',
    });
    const response = await container.fetch(healthRequest);
    return response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    console.error('Container health check failed:', error);
    return 'unhealthy';
  }
}

// Global error handler
app.onError((err, c) => {
  console.error(`❌ Hono Global Error:`, err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
    path: c.req.path,
    timestamp: new Date().toISOString(),
    version: '2.0.0-beta',
    pattern: 'Lifecycle-Hooks-Error',
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: `Route ${c.req.path} not found`,
    available_routes: [
      '/health',
      '/worker-info',
      '/container-status',
      '/api/*',
      '/* (web)'
    ],
    timestamp: new Date().toISOString(),
    pattern: 'Lifecycle-Hooks',
  }, 404);
});

export default app; 