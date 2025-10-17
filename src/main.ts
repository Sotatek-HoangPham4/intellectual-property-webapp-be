import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // 🔧 Set global prefix
  app.setGlobalPrefix('api/v1');

  // Global ValidationPipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Get config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 9000;

  // 🔧 Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trading System API')
    .setDescription('API documentation for authentication & user management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Enable CORS for all origins
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // ✅ Add OPTIONS
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(
    `📚 Swagger docs available at http://localhost:${port}/api/v1/docs`,
  );
}
bootstrap();
