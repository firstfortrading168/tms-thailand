# 🚀 Deployment Guide - TMS Thailand

## Quick Start Deploy (5 นาที)

### 1. Create Supabase Database (ฟรี)

1. ไป https://supabase.com
2. Sign up with Email
3. Create new project
   - Project name: `tms-thailand`
   - Password: (ให้ random)
   - Region: Singapore หรือ Tokyo (ใกล้ไทย)
4. รอ project สร้างเสร็จ (2-3 นาที)
5. ไป Settings → Database → Copy Connection String
   - ใช้ PostgreSQL connection string format
   - Replace `[YOUR-PASSWORD]` ด้วย password ที่ตั้งไว้

### 2. Deploy บน Vercel (ฟรี)

1. ไป https://vercel.com
2. Sign up with GitHub
3. Import GitHub repository
   - ถ้ายังไม่มี GitHub repo ให้สร้างก่อน
4. Add Environment Variables:
   ```
   DATABASE_URL = (จาก Supabase)
   NEXTAUTH_URL = https://tms-thailand.vercel.app
   NEXTAUTH_SECRET = (ให้ Vercel generate)
   ```
5. Click "Deploy" → รอ ~2 นาที

### 3. Setup Database

```bash
# ใน terminal เครื่องตัวเอง
cd /path/to/tms-thailand

# Push schema ไป production
npx prisma migrate deploy

# Seed initial data
npm run db:seed
```

---

## 📋 Checklist

- [ ] Supabase project สร้าง
- [ ] GitHub repo สร้าง และ push code
- [ ] Vercel project สร้าง
- [ ] Environment variables เพิ่มเสร็จ
- [ ] Prisma migrate deploy เสร็จ
- [ ] Database seed เสร็จ
- [ ] Test login ได้

---

## ✅ Users ที่ใช้งานได้เลย

Username | Password | Role
---------|----------|------
admin | password123 | เจ้าของ (OWNER)
manager01 | password123 | ผู้จัดการ (MANAGER)
sompong | password123 | คนขับ (DRIVER)
accountant01 | password123 | บัญชีการ (ACCOUNTANT)

---

## 🆘 Troubleshooting

**Build fail?** → ลบ node_modules และ run `npm install` ใหม่
**Database error?** → ตรวจ DATABASE_URL ว่า copy ถูก
**Page not found?** → refresh browser หรือ clear cache

---

**ติดปัญหา?** ให้ error message ผมจะแก้ให้ 💪
