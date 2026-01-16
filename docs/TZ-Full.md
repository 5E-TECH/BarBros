# Style Up Backend - Full TZ (role + API)

## 1) Qisqacha maqsad
Platforma: barber shop booking. Flow: Category -> Service -> BarberShop_Services(price) -> BarberShop -> Barber -> Barber_Schedule -> Booking. Notification, Rating, Chat, Transactions mavjud.

## 2) Rollar
- superadmin: tizimni boshqaradi, barbershoplarni aktiv/deaktiv qiladi.
- admin: umumiy monitoring va boshqaruv.
- sp_admin: barbershop egasi.
- barber: usta.
- user: mijoz.

## 3) Tablitsalar (amaldagi kod bo‘yicha)
- user
- barber
- barber_shop
- category
- services
- barber_services (barber-service many-to-many join)
- barber_shop_services
- barber_schedules
- booking
- notifications
- reyting
- images
- barber_images
- chat
- transactions

Eslatma: diagrammadagi `service_image` jadvali hozirgi kodda yo‘q.

## 4) API ro'yxati (modul bo'yicha)

### User (auth + admin)
Base: /api/v1/user
- POST /register - User ro'yxatdan o'tish (telefon).
- POST /verify - OTP tekshirish, token olish.
- PATCH /set-fullname - User full_name set.
- GET /my_accaunt - User o'z profilini olish.
- GET /:id - User profilini olish (self).
- PATCH /:id - User update (self).
- DELETE /:id - User delete (self).
- GET /profile - User profile (token orqali).
- GET /all - Superadmin userlar ro'yxati.
- POST /signin-admin - Admin login.
- POST /create-admin - Superadmin admin yaratadi.
- GET /all-admin - Superadmin adminlar ro'yxati.
- GET /my-account - Admin/superadmin o'z account.
- GET /one/:id - Superadmin adminni olish.
- PATCH /update/:id - Admin/superadmin admin update.
- DELETE /delete/:id - Superadmin admin delete.
- POST /refresh-password - Admin/superadmin parol yangilash.

### Barber
Base: /api/v1/barber
- POST /Signin - Barber login.
- POST /create - SP_ADMIN barber yaratadi.
- GET /all - Barberlar ro'yxati.
- GET /all-myBarbers - SP_ADMIN o'z barberlari.
- GET /My_Accaunt - Barber o'z account.
- GET /:id - Barber detail (self guard).
- PATCH /update/:id - Barber/SP_ADMIN/Admin update.
- DELETE /:id - Barber/SP_ADMIN/Admin delete.
- POST /refresh_password - Barber parol yangilash.

### Barber Shop
Base: /api/v1/barber-shop
- POST /Signup - Barbershop sign up (INACTIVE default).
- POST /Singin - Barbershop login (ACTIVE bo'lsa).
- GET / - Barbershop list (filter + geo + rating).
- GET /My_Accaunt - SP_ADMIN own shop.
- GET /:id - Shop detail (ACTIVE bo'lsa).
- PATCH /status/:id - Superadmin status update.
- PATCH /:id - SP_ADMIN/superadmin update.
- DELETE /:id - Superadmin delete.
- POST /Refresh_password - SP_ADMIN parol yangilash.

### Category
Base: /api/v1/category
- POST /create - Admin/superadmin create.
- GET /getAll?categoryType=man|woman - Category list.
- PATCH /update/:id - Admin/superadmin update.
- DELETE /:id - Admin/superadmin soft delete.

### Service
Base: /api/v1/service
- POST / - SP_ADMIN/superadmin service create (SP_ADMIN price bilan).
- GET / - Service list.
- GET /:id - Service detail.
- GET /my-service - SP_ADMIN/Barber service list.
- PATCH /:id - SP_ADMIN/superadmin/admin update.
- DELETE /:id - SP_ADMIN/superadmin/admin delete.
- POST /add-barbers - SP_ADMIN barberlarni servicega biriktiradi.

### Barber Shop Services (price)
Base: /api/v1/barber-shop-services
- POST / - SP_ADMIN/superadmin/admin shopga service biriktirish (price).
- GET / - Shop service list.
- GET /:id - Shop service detail.
- PATCH /:id - Update price.
- DELETE /:id - Remove.

### Barber Schedule
Base: /api/v1/barber-schedule
- POST / - SP_ADMIN/ADMIN/Barber jadval yaratish.
- GET / - Admin/superadmin hamma jadval.
- GET /getSchedulesByBarber - Barber o'z jadvali.
- GET /:id - Admin/superadmin detail.
- PATCH /:id - Update (ownership check).
- DELETE /:id - Remove (ownership check).

### Booking
Base: /api/v1/booking
- POST / - User booking yaratadi (pending).
- DELETE /:id - Booking cancel (role check).
- PATCH /:id/status - Status update (barber/sp_admin/admin).
- GET /Barber_bookig - Barber booking list.
- GET /User_booking - User booking list.
- GET /All - Admin/superadmin booking list.
- GET /availability?barberId&date&serviceId - 1 kun availability.
- GET /availability-range?barberId&from&to&serviceId - ko'p kun availability.

### Images (barbershop)
Base: /api/v1/images
- POST / - SP_ADMIN shop rasmlari upload.
- GET /all - Public image list.
- GET /BarberShop_all - SP_ADMIN o'z rasmlari.
- DELETE /:id - SP_ADMIN delete.

### Barber Images
Base: /api/v1/barber_images
- POST / - Barber rasm upload.
- GET / - All images.
- GET /findAllBarberImg - Barber o'z rasmlari.
- DELETE /:id - Barber delete.

### Notification
Base: /api/v1/notification
- POST / - Admin/SP_ADMIN notification yaratadi.
- GET / - Admin/SP_ADMIN list.
- GET /my - User o'z notification.
- DELETE /:id - Admin delete.

### Rating
Base: /api/v1/reyting
- POST / - User barberga reyting yozadi.

### Chat (REST + realtime)
Base: /api/v1/chat
- POST / - Message yuborish (user/barber/admin).
- GET /conversation?user_id&barber_id - Chat tarixi.
- GET /my - User/Barber o'z chatlari.

Realtime: WebSocket event
- event: chat:new (server yangi message yuboradi)

### Transactions (hisob-kitob)
Base: /api/v1/transactions
- GET / - Admin/superadmin barcha tranzaksiyalar.
- GET /my-shop - SP_ADMIN o'z shop tranzaksiyalari.
- GET /my-barber - Barber o'z tranzaksiyalari.
- GET /summary?range=daily|weekly|monthly
- GET /summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

### Refresh token
Base: /api/v1/refresh
- POST /refreshToken - Refresh token orqali access token olish.

### AutoLoud (cron)
Base: /api/v1/auto-loud
- Cron: avg_rating hisoblash (har kuni)
- Cron: reyting tozalash (har yili)

## 5) Rollar bo'yicha qisqa summary
- Superadmin: barcha boshqaruv, status, adminlar, transactions, bookings.
- Admin: monitoring va boshqaruv.
- SP_ADMIN: shop, barber, schedule, service, price, images, booking status.
- Barber: schedule, booking status, o'z profili, chat.
- User: category/service/availability, booking, rating, chat.

### Service Image
Base: /api/v1/service-image
- POST / - SP_ADMIN/ADMIN/SUPER service rasm upload.
- GET /service/:id - Service rasmlari (public).
- DELETE /:id - Service rasm delete.
