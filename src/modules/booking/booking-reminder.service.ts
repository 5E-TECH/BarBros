import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { NotificationEntity } from '../notification/entities/notification.entity';
import { BookingStatus } from 'src/common/enum';
import { ErrorHender } from 'src/utils/catchError';
const dayjs = require('dayjs');

@Injectable()
export class BookingReminderService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: process.env.TZ || 'Asia/Tashkent',
  })
  async sendUpcomingReminders() {
    try {
      const now = dayjs();
      const bookings = await this.bookingRepo.find({
        where: { status: BookingStatus.CONFIRMED, reminder_sent: false },
      });

      for (const booking of bookings) {
        const bookingTime = dayjs(`${booking.date}T${booking.time}`);
        if (!bookingTime.isValid()) {
          booking.reminder_sent = true;
          await this.bookingRepo.save(booking);
          continue;
        }

        const diffMinutes = bookingTime.diff(now, 'minute');
        if (diffMinutes <= 30 && diffMinutes >= 0) {
          await this.notificationRepo.save(
            this.notificationRepo.create({
              message: `Bookingingiz ${booking.time} da. 30 daqiqa qoldi.`,
              user_id: booking.user_id,
              is_read: false,
            }),
          );
          booking.reminder_sent = true;
          await this.bookingRepo.save(booking);
        } else if (diffMinutes < 0) {
          booking.reminder_sent = true;
          await this.bookingRepo.save(booking);
        }
      }
    } catch (error) {
      ErrorHender(error);
    }
  }
}
