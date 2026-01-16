export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPPER_ADMIN = 'supperadmin',
  SP_ADMIN = 'sp_admin',
  BARBER = 'barber',

}

export enum StarRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export enum Category {
  MAN = "man",
  WOMAN = "woman"
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum PaymentModel {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

export enum OrderType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
