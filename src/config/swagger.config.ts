import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Dawg Pound')
  .setDescription('The Dawg Pound App Backend')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'headers',
      description: 'Paste ONLY the JWT (no "Bearer ").',
    },
    'bearer',
  )
  .addSecurityRequirements('bearer')
  .build();
