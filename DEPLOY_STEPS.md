# 📋 Step-by-Step Deployment Guide

## **PART 1: สร้าง Supabase Database (ฟรี)**

### ขั้นที่ 1: ไป Supabase
1. เปิด https://supabase.com
2. Click "Start your project"
3. Sign up with Email (ใช้ firstfirst0603@gmail.com)
4. ตั้ง password ให้แข็งแรง

### ขั้นที่ 2: สร้าง Project
1. Click "New Project"
2. กรอก:
   - **Project Name:** `tms-thailand`
   - **Password:** (ตั้งเองให้แข็งแรง - **เก็บไว้!**)
   - **Region:** Singapore (ใกล้ไทย)
3. Click "Create new project" → รอ 2-3 นาที

### ขั้นที่ 3: เอา Connection String
1. ไปหน้า Project Settings
2. ไป tab "Database"
3. ค้นหา "Connection string" section
4. เลือก "PostgreSQL"
5. Copy string แบบนี้:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   - Replace `[PASSWORD]` ด้วย password ที่ตั้งไว้
6. **เก็บ URL นี้ไว้!**

---

## **PART 2: สร้าง GitHub Repository**

### ขั้นที่ 1: สร้าง Repo
1. เปิด https://github.com
2. Sign in (ถ้ายังไม่มี account ให้ sign up ก่อน)
3. Click "New" (มุมบนซ้าย)
4. กรอก:
   - **Repository name:** `tms-thailand`
   - **Description:** Transportation Management System
   - **Public** (เลือก)
5. Click "Create repository"

### ขั้นที่ 2: Push Code
ใช้คำสั่งนี้ในเครื่องตัวเอง:

```bash
cd /Users/jiratchaya/Documents/transportation\ management\ system

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/tms-thailand.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**เปลี่ยน `YOUR_USERNAME` เป็น username GitHub ของคุณ!**

ดูวิธีรู้ username: ไปที่ GitHub profile page, ชื่อในที่อยู่ URL คือ username

---

## **PART 3: Deploy บน Vercel**

### ขั้นที่ 1: Sign Up Vercel
1. เปิด https://vercel.com
2. Click "Sign Up"
3. เลือก "Continue with GitHub"
4. ให้ permission เข้า GitHub account

### ขั้นที่ 2: Import Project
1. ไปที่ Vercel Dashboard
2. Click "New Project" (หรือ Import Project)
3. เลือก `tms-thailand` repository
4. Click "Import"

### ขั้นที่ 3: Add Environment Variables
1. ในหน้า "Configure Project"
2. ไปหา "Environment Variables" section
3. Add 3 variables:

```
KEY: DATABASE_URL
VALUE: (จาก Supabase - ที่บันทึกไว้)

KEY: NEXTAUTH_URL
VALUE: https://tms-thailand.vercel.app

KEY: NEXTAUTH_SECRET
VALUE: (ปล่อยให้ Vercel generate - กด Generate)
```

### ขั้นที่ 4: Deploy
1. Click "Deploy"
2. รอ ~3-5 นาที (มันจะ build)
3. เมื่อเสร็จ จะเห็น ✅ "Congratulations!"

**URL app ของคุณ:** `https://tms-thailand.vercel.app`

---

## **PART 4: Setup Database**

ใช้คำสั่งนี้ใน terminal เครื่องตัวเอง:

```bash
cd /Users/jiratchaya/Documents/transportation\ management\ system

# อัพเดท .env.production ด้วย DATABASE_URL จาก Supabase
# (edit ไฟล์ .env.production แล้วใส่ URL)

# Push database schema
npx prisma migrate deploy

# Seed data
npm run db:seed
```

---

## **PART 5: Test Login**

เปิด browser ไปที่: `https://tms-thailand.vercel.app`

ลองล็อกอินด้วย:
- **Username:** `admin`
- **Password:** `password123`

ถ้าเข้าได้ → **🎉 ทำสำเร็จแล้ว!**

---

## **❌ ติดปัญหา?**

### Error: "Database connection failed"
→ ตรวจสอบ DATABASE_URL ว่า copy ถูก

### Error: "Vercel deployment failed"
→ ดู build logs ที่ Vercel (Deployments tab)

### Can't access app
→ รอ 1-2 นาที หรือ refresh browser

---

## **✅ Checklist**

- [ ] Supabase project สร้าง
- [ ] Connection String เอามา
- [ ] GitHub repository สร้าง
- [ ] Code push ไป GitHub เสร็จ
- [ ] Vercel project สร้าง
- [ ] Environment variables เพิ่มเสร็จ
- [ ] Vercel deploy เสร็จ
- [ ] Prisma migrate deploy เสร็จ
- [ ] Database seed เสร็จ
- [ ] Login test สำเร็จ ✅

---

**ยังไม่เข้าใจตรงไหน ให้ถาม! 💬**
