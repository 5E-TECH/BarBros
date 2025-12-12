import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { ReytingEntity } from '../rayting/entities/reyting.entity';
import { Repository } from 'typeorm';

@Controller('auto-loud')
export class AutoLoudController {
  constructor(
    @InjectRepository(BarberEntity)
    private readonly barber: Repository<BarberEntity>,
    @InjectRepository(ReytingEntity)
    private readonly reyting: Repository<ReytingEntity>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: process.env.TZ || "Asia/Tashkent"
  })
  async Avg_reyting() {
    try {
      let sum: number = 0;
      let sch: number = 0;
      let Avg: number = 0;
      const SetReyting = new Set<number>();
      const Reyting = await this.reyting.find();
      for (let R of Reyting) {
        SetReyting.add(R.barber_id);
      }
      for (let barber of SetReyting) {
        sum = 0;
        sch = 0;
        Avg = 0;
        for (let i of Reyting) {
          if (barber == i.barber_id) {
            sch += 1;
            sum += Number(i.star);
          }
        }
        Avg = parseFloat((sum / sch).toFixed(1));
        await this.barber.update(barber, { avg_reyting: Avg });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  
  @Cron(CronExpression.EVERY_YEAR, {
     timeZone: process.env.TZ || "Asia/Tashkent"
  })
  async DeletReyting() {
    try {
       await this.reyting.deleteAll()
    } catch (error) {
      console.log(error.message);
    }
  }
}
