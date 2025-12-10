import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const ErrorHender = (error: any) => {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error?.response) {
    const message =
      error.response.message || error.message || 'Xatolik yuz berdi';
    const status = error.response.statusCode || 500;

    throw new HttpException(message, status);
  }

  const message = error?.message || 'Kutilmagan xatolik';
  throw new InternalServerErrorException(message);
};
