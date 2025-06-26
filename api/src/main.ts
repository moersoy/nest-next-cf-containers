import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
    cors: true,
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  // Health check endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'nest-api',
      timestamp: new Date().toISOString() 
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 NestJS API Container started on: http://localhost:${port}`);
  logger.log(`📊 API Endpoints available at: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
}); 