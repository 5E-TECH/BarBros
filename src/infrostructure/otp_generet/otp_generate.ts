import { totp } from 'otplib';
export class OtpGenerate {
  async Generate(secret: string) {
    return totp.generate(secret);
  }
  
  async verify(secret: string, otp: number) {
    const Speskkeys = require('speakeasy');
    const isotp_verify = Speskkeys.totp.verify({
      secret,
      encoding: 'ascii',
      token: otp,
      window: 4,
    });
    return isotp_verify
  }
}
