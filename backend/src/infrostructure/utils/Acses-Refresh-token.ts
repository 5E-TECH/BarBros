import { JwtService } from '@nestjs/jwt';

export function AccessToken(jwt: JwtService, payload: any) {
  return jwt.sign(payload, {
    secret: process.env.ACSES_SECRET,
    expiresIn: '30d',
  });
}

export function RefreshToken(jwt: JwtService, payload: any) {
  return jwt.sign(payload, {
    secret: process.env.REFRESH_SECRET,
    expiresIn: '60d',
  });
}
