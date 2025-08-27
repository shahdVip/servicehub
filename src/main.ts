import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties that do not have decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted values are provided
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // This helps `class-transformer` to work with `class-validator`
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
