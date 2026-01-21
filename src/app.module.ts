import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { BarberModule } from './modules/barber/barber.module';
import { BookingModule } from './modules/booking/booking.module';
import { BarberShopModule } from './modules/barber-shop/barber-shop.module';
import { ServiceModule } from './modules/service/service.module';
import { FileModule } from './modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ImagesModule } from './modules/images/images.module';
import { NotificationModule } from './modules/notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { BarberImagesModule } from './modules/barber_images/barber_images.module';
import { ReytingModule } from './modules/rayting/reyting.module';
import { BarberScheduleModule } from './modules/barber_schedule/barber_schedule.module';
import { RefreshModule } from './modules/refresh/refresh.module';
import { AutoLoudModule } from './modules/auto-loud/auto-loud.module';
import { CategoryModule } from './modules/category/category.module';
import { BarberShopServicesModule } from './modules/barber-shop-services/barber-shop-services.module';
import { ChatModule } from './modules/chat/chat.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ServiceImageModule } from './modules/service-image/service-image.module';
import { AdminDashboardModule } from './modules/admin-dashboard/admin-dashboard.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

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
    ServiceModule,
    FileModule,
    ImagesModule,
    NotificationModule,
    BarberImagesModule,
    ReytingModule,
    BarberScheduleModule,
    RefreshModule,
    AutoLoudModule,
    CategoryModule,
    BarberShopServicesModule,
    ChatModule,
    TransactionsModule,
    ServiceImageModule,
    AdminDashboardModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
