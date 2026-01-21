import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req['user'];
    if (!user) return true;
    await this.subscriptionService.ensureActiveForUser(user);

    return true;
  }
}
