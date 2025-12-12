import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReytingDto } from './dto/create-reyting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReytingEntity } from './entities/reyting.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';

@Injectable()
export class ReytingService {
  constructor(
    @InjectRepository(ReytingEntity)
    private reytingRepo: Repository<ReytingEntity>,
  ) {}

  async create(createReytingDto: CreateReytingDto, req: Request) {
    const user = req['user'];
    try {
      const reyting_check = await this.reytingRepo.findOne({
        where: { user_id: user.id },
      });
      if(reyting_check){
        throw new ConflictException("Siz avval reyting qoldirgansiz")
      }
      const reyting = this.reytingRepo.create({
        ...createReytingDto,
        user_id: user.id,
      });
      await this.reytingRepo.save(reyting);
      return successRes(reyting, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
