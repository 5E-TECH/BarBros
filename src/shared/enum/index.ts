export const UserRole = {
  Foydalanuvchi: "foydalanuvchi",
  Admin: "admin",
  Sartarosh: "sartarosh",
  Sartaroshxona: "sartaroshxona",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];