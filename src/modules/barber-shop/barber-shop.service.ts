import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsOrder } from 'typeorm';
import { BarberShopServicesEntity } from '../barber-shop-services/entities/barber-shop-services.entity';
import { Request } from 'express';

import { BarberShopEntity } from './entities/barber-shop.entity';
import { UserRole, Status } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';

import { CreateBarberShopDto } from './dto/create-barber-shop.dto';
import { UpdateBarberShopDto } from './dto/update-barber-shop.dto';
import { UpdateBarberShopStatus } from './dto/update-status';
import { LogimBarberShopDto } from './dto/login-barber-shop.dto';

import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';
import { BarberShopRefreshPasswordDto } from './dto/refreshPassword.dto';
import { AccessToken, RefreshToken } from 'src/utils/Acses-Refresh-token';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class BarberShopService {
  constructor(
    @InjectRepository(BarberShopEntity)
    private barberRepo: Repository<BarberShopEntity>,
    @InjectRepository(BarberShopServicesEntity)
    private readonly barberShopServicesRepo: Repository<BarberShopServicesEntity>,
    private readonly fileServis: FileService,
    private readonly Bcrypt: BcryptEncryption,
    private readonly jwtService: JwtService,
    private readonly subscriptionService: SubscriptionService,
  ) { }

  async signup(createDto: CreateBarberShopDto, file?: Express.Multer.File) {
    try {
      const exists = await this.barberRepo.findOne({
        where: { username: createDto.username },
      });
      if (exists) throw new ConflictException('Username already exists');

      const HashedPassword = await this.Bcrypt.Generate(createDto.password);

      const barberShop = this.barberRepo.create({
        ...createDto,
        password: HashedPassword,
      });

      if (file && new ImageValidationPipe().transform(file)) {
        barberShop.img = await this.fileServis.createFile(file);
      }

      const saved = await this.barberRepo.save(barberShop);
      const result = await this.barberRepo.findOne({
        where: { id: saved.id },
        relations: ['barber', 'images'],
      });
      return successRes(result, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async login(dto: LogimBarberShopDto) {
    try {
      const shop = await this.barberRepo.findOne({
        where: { username: dto.username },
      });
      if (!shop) throw new ForbiddenException('Wrong username or password');
      if (shop.status === Status.INACTIVE)
        throw new ForbiddenException('Your account is blocked');

      await this.subscriptionService.ensureActive(shop.id);

      const isMatch = await this.Bcrypt.Verify(dto.password, shop.password);
      if (!isMatch) throw new ForbiddenException('Wrong password');
      const accessToken = AccessToken(this.jwtService, {
        id: shop.id,
        role: shop.role,
      });
      const refreshToken = RefreshToken(this.jwtService, {
        id: shop.id,
        role: shop.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async myAccount(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.SP_ADMIN)
        throw new ForbiddenException('Forbidden');

      const shop = await this.barberRepo.findOne({
        where: { id: user.id },
        relations: [
          'barber',      // OneToMany → barberlar
          'images',      // OneToMany → rasmlar
          // 'service',     // agar barberShop service bog‘langan bo‘lsa
        ],
      });

      return successRes(shop);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        search,
        name,
        description,
        location,
        sortBy = 'name',
        order = 'DESC',
        page = 1,
        limit = 10,
        lat,
        lng,
        radiusKm,
      } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = search
        ? [
          { name: ILike(`%${search}%`) },
          { descripton: ILike(`%${search}%`) },
          { location: ILike(`%${search}%`) },
          { phoneNumber: ILike(`%${search}%`) },
          { username: ILike(`%${search}%`) },
        ]
        : {
          ...(name && { name: ILike(`%${name}%`) }),
          ...(description && { description: ILike(`%${description}%`) }),
          ...(location && { location: ILike(`%${location}%`) }),
        };

      const baseOrder: FindOptionsOrder<BarberShopEntity> =
        sortBy === 'distance' || sortBy === 'avg_rating'
          ? { name: 'ASC' }
          : {
            [sortBy]:
              order.toUpperCase() === 'ASC'
                ? ('ASC' as const)
                : ('DESC' as const),
          };

      const useGeo = lat !== undefined && lng !== undefined;
      const [data, total] = await this.barberRepo.findAndCount({
        where,
        relations: ['barber', 'images'],
        order: baseOrder,
        ...(useGeo ? {} : { skip, take: Number(limit) }),
      });

      const latNum = lat !== undefined ? Number(lat) : null;
      const lngNum = lng !== undefined ? Number(lng) : null;
      const radiusNum = radiusKm !== undefined ? Number(radiusKm) : null;

      if (latNum !== null && lngNum !== null) {
        const withDistance = data
          .map((shop) => {
            if (shop.latitude === null || shop.longitude === null) {
              return { ...shop, distance_km: null };
            }
            const distance = this.calcDistanceKm(
              latNum,
              lngNum,
              shop.latitude,
              shop.longitude,
            );
            return { ...shop, distance_km: distance };
          })
          .filter((shop) => {
            if (radiusNum === null) return true;
            if (shop.distance_km === null) return false;
            return shop.distance_km <= radiusNum;
          });

        const sorted =
          sortBy === 'distance'
            ? withDistance.sort((a, b) => {
              if (a.distance_km === null) return 1;
              if (b.distance_km === null) return -1;
              return a.distance_km - b.distance_km;
            })
            : sortBy === 'avg_rating'
              ? withDistance.sort((a, b) => b.avg_rating - a.avg_rating)
              : withDistance;

        const paged = sorted.slice(skip, skip + Number(limit));

        return successRes({
          data: paged,
          total: sorted.length,
          currentPage: Number(page),
          pageSize: Number(limit),
          totalPages: Math.ceil(sorted.length / Number(limit)),
        });
      }

      return successRes({
        data,
        total,
        currentPage: Number(page),
        pageSize: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private calcDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) {
    const toRad = (val: number) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  async findByService(query: Record<string, any>) {
    try {
      const { serviceId, lat, lng, radiusKm, sortBy = 'distance' } = query;
      const serviceIdNum = Number(serviceId);
      if (!serviceIdNum) {
        throw new BadRequestException('serviceId is required');
      }

      const latNum = lat !== undefined ? Number(lat) : null;
      const lngNum = lng !== undefined ? Number(lng) : null;
      const radiusNum = radiusKm !== undefined ? Number(radiusKm) : null;

      const links = await this.barberShopServicesRepo.find({
        where: { service_id: serviceIdNum },
        relations: ['barberShop'],
      });

      const mapped = links.map((link) => {
        const shop = link.barberShop;
        const distance =
          latNum !== null &&
            lngNum !== null &&
            shop.latitude !== null &&
            shop.longitude !== null
            ? this.calcDistanceKm(latNum, lngNum, shop.latitude, shop.longitude)
            : null;

        return {
          barber_shop_id: shop.id,
          shop_name: shop.name,
          shop_location: shop.location,
          shop_image: shop.img,
          avg_rating: shop.avg_rating,
          price: link.price,
          distance_km: distance,
        };
      });

      const filtered = mapped.filter((item) => {
        if (radiusNum === null) return true;
        if (item.distance_km === null) return false;
        return item.distance_km <= radiusNum;
      });

      const sorted =
        sortBy === 'avg_rating'
          ? filtered.sort((a, b) => b.avg_rating - a.avg_rating)
          : sortBy === 'distance'
            ? filtered.sort((a, b) => {
              if (a.distance_km === null) return 1;
              if (b.distance_km === null) return -1;
              return a.distance_km - b.distance_km;
            })
            : filtered;

      return successRes(sorted);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(
    id: number,
    updateDto: UpdateBarberShopDto,
    file?: Express.Multer.File,
    req?: Request,
  ) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');
      if (
        req &&
        shop.id !== req['user'].id &&
        ![UserRole.SUPPER_ADMIN, UserRole.ADMIN].includes(req['user'].role)
      ) {
        throw new ForbiddenException('Cannot update other BarberShop');
      }

      if (file && new ImageValidationPipe().transform(file)) {
        if (shop.img && (await this.fileServis.existFile(shop.img))) {
          await this.fileServis.deleteFile(shop.img);
        }
        updateDto.img = await this.fileServis.createFile(file);
      }

      const rawBody = (req?.body || {}) as Record<string, any>;
      const cleaned: Partial<UpdateBarberShopDto> = {};

      Object.entries(updateDto).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === 'string' && value.trim() === '') return;
        if (
          typeof rawBody[key] === 'string' &&
          rawBody[key].trim() === ''
        ) {
          return;
        }
        cleaned[key as keyof UpdateBarberShopDto] = value as any;
      });

      await this.barberRepo.update({ id }, cleaned);
      const updated = await this.barberRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');

      await this.barberRepo.delete(id);

      if (shop.img && (await this.fileServis.existFile(shop.img))) {
        await this.fileServis.deleteFile(shop.img);
      }

      return successRes({});
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async statusUpdate(id: number, newData: UpdateBarberShopStatus) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');

      await this.barberRepo.update(id, { status: newData.status });
      const updated = await this.barberRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async refreshPassword(data: BarberShopRefreshPasswordDto) {
    try {
      const shop = await this.barberRepo.findOne({
        where: { username: data.username },
      });
      if (!shop) throw new NotFoundException('BarberShop not found');
      if (shop.status !== Status.ACTIVE) {
        throw new ForbiddenException('BarberShop is blocked by admin');
      }

      if (!data.new_password)
        throw new BadRequestException('New password is required');

      const hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.barberRepo.update({ id: shop.id }, { password: hashPass });

      return { message: 'Password updated successfully', statusCode: 201 };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const shop = await this.barberRepo.findOne({
        where: { id },
        relations: ['barber', 'images'],
      });
      if (!shop) throw new NotFoundException('BarberShop not found');
      if (shop.status !== Status.ACTIVE)
        throw new NotFoundException('BarberShop is blocked by admin');
      return successRes(shop);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
