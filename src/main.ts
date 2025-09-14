import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS con tus URLs específicas
  app.enableCors({
    origin: [
      'http://localhost:3000', // desarrollo React local
      'http://localhost:5173', // si usas Vite
      'https://proy1-imc-front-progav.onrender.com' // tu frontend en Render
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port: ${port}`);
}
bootstrap();