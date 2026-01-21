import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/infrostructure/exceoption/all.Error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const Port = Number(process.env.PORT) || 3000;
process.env.TZ = 'Asia/Tashkent';
export default class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
      origin: '*',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    const api = 'api/v1';
    app.setGlobalPrefix(api);
    const config = new DocumentBuilder()
      .setTitle('Barber Shop')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addServer('/barber')
      .addSecurityRequirements('bearer', ['bearer'])
      .addBearerAuth()
      .build();
      console.log();
      

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, documentFactory);

    app.useStaticAssets(join(process.cwd(), '..', 'uploud'), {
      prefix: '/api/uploud',
    });

    await app.listen(Port, () => {
      console.log(`server running on port`,Port);
      console.log("Swagger >>",`http://localhost:${Port}/api/v1`);
    });
  }
}
