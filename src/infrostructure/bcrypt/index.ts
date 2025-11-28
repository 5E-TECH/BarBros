import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


export class BcryptEncryption {
   async Generate(password: string) {
    try {
      return  bcrypt.hashSync(password, 10);
    } catch (error) {
      throw new BadRequestException(`Error on encrypt: ${error}`);
    }
  }

   async Verify(password: string, hash: string) {
    try {
      return  bcrypt.compareSync(password, hash);
    } catch (error) {
      throw new BadRequestException(`Error on decrypt: ${error}`);
    }
  }
}
