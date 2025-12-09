import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BarberModule } from './barber/barber.module';
import { BookingModule } from './booking/booking.module';
import { BarberShopModule } from './barber-shop/barber-shop.module';
import { ServiceModule } from './service/service.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from 'src/common/mail/mail.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ImagesModule } from './images/images.module';
import { NotificationModule } from './notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { BarberImagesModule } from './barber_images/barber_images.module';
import { ReytingModule } from './reyting/reyting.module';
import { BarberScheduleModule } from './barber_schedule/barber_schedule.module';
import { RefreshModule } from './refresh/refresh.module';
import { AutoLoudModule } from './auto-loud/auto-loud.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.register({ global: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'uplout'),
      serveRoot: '/uplout',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      username: String(process.env.PG_USER),
      port: Number(process.env.PG_PORT),
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + `/**/*.entity{.ts,.js}`],
    }),
    UserModule,
    BarberModule,
    BookingModule,
    BarberShopModule,
    AdminModule,
    MailModule,
    ServiceModule,
    FileModule,
    ImagesModule,
    NotificationModule,
    BarberImagesModule,
    ReytingModule,
    BarberScheduleModule,
    RefreshModule,
    AutoLoudModule
  ],
})
export class AppModule {}
