import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReytingDto } from './dto/create-reyting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReytingEntity } from './entities/reyting.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';
import { BarberEntity } from '../barber/entities/barber.entity';
import { BarberShopEntity } from '../barber-shop/entities/barber-shop.entity';

@Injectable()
export class ReytingService {
  constructor(
    @InjectRepository(ReytingEntity)
    private reytingRepo: Repository<ReytingEntity>,
    @InjectRepository(BarberEntity)
    private barberRepo: Repository<BarberEntity>,
    @InjectRepository(BarberShopEntity)
    private barberShopRepo: Repository<BarberShopEntity>,
  ) {}

  async create(createReytingDto: CreateReytingDto, req: Request) {
    const user = req['user'];
    try {
      const barber = await this.barberRepo.findOne({
        where: { id: createReytingDto.barber_id },
        relations: ['barberShop'],
      });
      if (!barber) {
        throw new NotFoundException('Barber not found');
      }

      const reyting_check = await this.reytingRepo.findOne({
        where: { user_id: user.id, barber_id: createReytingDto.barber_id },
      });
      if(reyting_check){
        throw new ConflictException("Siz avval reyting qoldirgansiz")
      }
      const reyting = this.reytingRepo.create({
        ...createReytingDto,
        user_id: user.id,
      });
      await this.reytingRepo.save(reyting);

      await this.updateBarberAvgRating(barber.id);
      if (barber.barberShop) {
        await this.updateShopAvgRating(barber.barberShop.id);
      }

      return successRes(reyting, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private async updateBarberAvgRating(barberId: number) {
    const result = await this.reytingRepo
      .createQueryBuilder('r')
      .select('AVG(r.star)', 'avg')
      .where('r.barber_id = :barberId', { barberId })
      .getRawOne();

    const avg = Number(result?.avg ?? 0);
    await this.barberRepo.update({ id: barberId }, { avg_reyting: avg });
  }

  private async updateShopAvgRating(barberShopId: number) {
    const result = await this.reytingRepo
      .createQueryBuilder('r')
      .leftJoin(BarberEntity, 'b', 'b.id = r.barber_id')
      .select('AVG(r.star)', 'avg')
      .where('b.barberShop_id = :barberShopId', { barberShopId })
      .getRawOne();

    const avg = Number(result?.avg ?? 0);
    await this.barberShopRepo.update({ id: barberShopId }, { avg_rating: avg });
  }
}
