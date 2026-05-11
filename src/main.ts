import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import { connectToSnowflake } from './config/snowflake.config';

async function bootstrap() {
  // await connectToSnowflake();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'], // Muestra logs importantes
    bodyParser: false,
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(require('express').json({ limit: '10mb' }));
  expressApp.use(require('express').urlencoded({ limit: '10mb', extended: true }));

  const allowedOrigins = [
    'http://localhost:8502', // Vite local dev
    'http://localhost:3000', // React local dev
    'https://localhost:3000',
    'https://opella-periscope.p211125721469.aws-emea.sanofi.com', // Vite DEV
  ];

  // CORS configuration
  app.enableCors(
    {
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/([a-zA-Z0-9-]+\.)*sanofi\.com$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  }
);

  const config = new DocumentBuilder()
    .setTitle('Opella Periscope API')
    .setDescription('Periscope API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useWebSocketAdapter(new WsAdapter(app)); // Añade esta línea
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
