import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { CustomValidationPipe } from './core/pipes';
import { AppConfig, SwaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfig);

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors(appConfig.getCorsOptions());

  app.use(morgan('tiny'));

  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(appConfig.getPort() || 3000);
}
bootstrap();
