import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { extname, join, resolve } from 'path';
import { ErrorHender } from 'src/utils/catchError';
import { v4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FileService {
  private readonly Base_url = process.env.BASE_API;
  async createFile(file: Express.Multer.File | any): Promise<string> {
    try {
      const ext = extname(file.originalname);

      // 🔥 SHU YERDA BO‘SHLIQ VA BELGILARNI TOZALAYMIZ
      const safeName = file.originalname
        .split('.')[0]
        .replace(/\s+/g, '-') // bo‘shliqlar → -
        .replace(/[^a-zA-Z0-9-_]/g, ''); // faqat xavfsiz belgilar

      const file_name = `${safeName}__${v4()}${ext.toLowerCase()}`;

      const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploud');
      if (!existsSync(file_path)) {
        mkdirSync(file_path, { recursive: true });
      }
      await new Promise<void>((resolve, reject) => {
        writeFile(join(file_path, file_name), file.buffer, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
      return `/uploud/${file_name}`;  
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async deleteFile(files: string): Promise<void> {
    try {
      const prefix = this.Base_url + '/'!;
      const file = files.replace(prefix, '');
      const file_path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uplout',
        file,
      );
      if (!existsSync(file_path)) {
        ErrorHender(error);
      }
      await new Promise<void>((resolve, reject) => {
        unlink(file_path, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (error) {
      ErrorHender(error);
    }
  }

  async existFile(file_name: any) {
    const file = file_name.replace(this.Base_url + '/', '');

    const file_path = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uplout',
      file,
    );
    if (existsSync(file_path)) {
      return true;
    } else {
      return false;
    }
  }
}
