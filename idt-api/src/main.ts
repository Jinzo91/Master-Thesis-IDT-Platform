import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // ===== App Config =====
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // ===== App Config =====

  // ===== Swagger Config =====
  const options = new DocumentBuilder()
    .setTitle('IDT API')
    .setDescription(`The IDT API description.`)
    .setVersion('1.0')
    .addBearerAuth()
    // .setSchemes('http', 'https')
    .setBasePath('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);
  // ===== Swagger Config =====

  await app.listen(3000);
}
bootstrap();
