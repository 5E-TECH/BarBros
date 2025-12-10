import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/infrostructure/exceoption/all.Error.filter';

const Port = Number(process.env.PORT) || 3000;
process.env.TZ = 'Asia/Tashkent';
export default class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule);
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
      .addSecurityRequirements('bearer', ['bearer'])
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, documentFactory);

    await app.listen(Port, () => {
      console.log(`server running on port ${Port}`);
    });
  }
}
