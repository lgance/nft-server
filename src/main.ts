import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception-filter';



let port = 3500 ;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // global error Filter 
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
    }),
    
  );


  console.warn(`Transaction Server Listening ${port}`);
  await app.listen(port);
}
bootstrap();
