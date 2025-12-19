import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { extname, join, resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { ErrorHender } from 'src/utils/catchError';

dotenv.config();

@Injectable()
export class FileService {
  private readonly BASE_URL = process.env.BASE_API;

  private readonly UPLOAD_PATH = resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'uploud',
  );

  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = extname(file.originalname).toLowerCase();

      const safeName = file.originalname
        .split('.')[0]
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '');

      const fileName = `${safeName}__${uuidv4()}${ext}`;

      if (!existsSync(this.UPLOAD_PATH)) {
        mkdirSync(this.UPLOAD_PATH, { recursive: true });
      }

      await new Promise<void>((resolve, reject) => {
        writeFile(join(this.UPLOAD_PATH, fileName), file.buffer, (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      return `/uploud/${fileName}`;
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async deleteFile(fileUrl: string | null): Promise<void> {
    try {
      if (!fileUrl) return;

      // 👉 faqat /uploud/xxx.png qismi qoladi
      const filePath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl,
      );

      if (!existsSync(filePath)) return;

      await new Promise<void>((resolve, reject) => {
        unlink(filePath, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (error) {
      ErrorHender(error);
    }
  }

  async replaceFile(
    oldFile: string | null,
    newFile: Express.Multer.File,
  ): Promise<string> {
    try {
      if (oldFile) {
        await this.deleteFile(oldFile); // 🔥 eski rasm o‘chadi
      }

      return await this.createFile(newFile); // 🔥 yangi rasm yoziladi
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async existFile(fileUrl: string): Promise<boolean> {
    const filePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl,
    );

    return existsSync(filePath);
  }
}
