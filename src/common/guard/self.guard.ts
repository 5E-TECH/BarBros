import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../enum';
import { ErrorHender } from 'src/utils/catchError';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    try {
      if (
        req['user'].role === UserRole.SUPPER_ADMIN ||
        req['user'].role === UserRole.ADMIN
      ) {
        return true;
      }
      if (req.params.id !== req['user'].id) {
        throw new ForbiddenException('Forbidden user');
      }
      return true;
    } catch (error) {
      return ErrorHender(error)
    }
  }
}
