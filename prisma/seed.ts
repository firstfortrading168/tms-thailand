import { PrismaClient, UserRole, TruckType, TruckStatus, DriverStatus, LicenseType, JobStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('กำลังสร้างข้อมูลตัวอย่าง...')

  // สร้างผู้ใช้งาน
  const owner = await prisma.user.upsert({
    where: { username: 'somchai_owner' },
    update: {},
    create: {
      username: 'somchai_owner',
      password: await bcrypt.hash('password123', 10),
      name: 'สมชาย วงศ์ขนส่ง',
      phone: '081-234-5678',
      role: UserRole.OWNER,
    },
  })

  const manager = await prisma.user.upsert({
    where: { username: 'somying_manager' },
    update: {},
    create: {
      username: 'somying_manager',
      password: await bcrypt.hash('password123', 10),
      name: 'สมหญิง จัดการ',
      phone: '082-345-6789',
      role: UserRole.MANAGER,
    },
  })

  const clerk = await prisma.user.upsert({
    where: { username: 'nida_clerk' },
    update: {},
    create: {
      username: 'nida_clerk',
      password: await bcrypt.hash('password123', 10),
      name: 'นิดา เสมียน',
      phone: '083-456-7890',
      role: UserRole.CLERK,
    },
  })

  // สร้างลูกค้าตัวอย่าง
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { code: 'C001' },
      update: {},
      create: {
        code: 'C001',
        name: 'บริษัท ไทยฟู้ด จำกัด',
        contactName: 'คุณมานะ',
        phone: '02-111-2222',
        email: 'mana@thaifood.co.th',
        address: '123 ถ.สุขุมวิท กรุงเทพฯ',
        taxId: '0105567012345',
        creditDays: 30,
        creditLimit: 500000,
      },
    }),
    prisma.customer.upsert({
      where: { code: 'C002' },
      update: {},
      create: {
        code: 'C002',
        name: 'บริษัท โชคดี อินดัสตรี้ จำกัด',
        contactName: 'คุณสุดา',
        phone: '02-333-4444',
        email: 'suda@chokdee.co.th',
        address: '456 ถ.พระราม 9 กรุงเทพฯ',
        taxId: '0105568023456',
        creditDays: 45,
        creditLimit: 1000000,
      },
    }),
    prisma.customer.upsert({
      where: { code: 'C003' },
      update: {},
      create: {
        code: 'C003',
        name: 'ห้างหุ้นส่วนจำกัด สินค้าไทย',
        contactName: 'คุณวิชัย',
        phone: '038-111-2222',
        email: 'vichai@sinthai.co.th',
        address: '789 ถ.สุขุมวิท ชลบุรี',
        taxId: '0203567034567',
        creditDays: 30,
        creditLimit: 300000,
      },
    }),
  ])

  // สร้างคนขับตัวอย่าง
  const drivers = await Promise.all([
    prisma.driver.upsert({
      where: { code: 'D001' },
      update: {},
      create: {
        code: 'D001',
        firstName: 'สมพงษ์',
        lastName: 'ขับดี',
        phone: '089-111-1111',
        idCardNo: '1100100111111',
        licenseNo: '12345678',
        licenseType: LicenseType.TYPE_3,
        licenseExpiry: new Date('2026-06-30'),
        address: '10/1 ถ.รัตนาธิเบศร์ นนทบุรี',
        salary: 18000,
        startDate: new Date('2020-01-01'),
        status: DriverStatus.ACTIVE,
      },
    }),
    prisma.driver.upsert({
      where: { code: 'D002' },
      update: {},
      create: {
        code: 'D002',
        firstName: 'วิรัตน์',
        lastName: 'ปลอดภัย',
        phone: '089-222-2222',
        idCardNo: '1100100222222',
        licenseNo: '23456789',
        licenseType: LicenseType.TYPE_4,
        licenseExpiry: new Date('2025-09-15'),
        address: '22/5 ถ.ลาดพร้าว กรุงเทพฯ',
        salary: 22000,
        startDate: new Date('2018-03-15'),
        status: DriverStatus.ACTIVE,
      },
    }),
    prisma.driver.upsert({
      where: { code: 'D003' },
      update: {},
      create: {
        code: 'D003',
        firstName: 'ประเสริฐ',
        lastName: 'วิ่งเก่ง',
        phone: '089-333-3333',
        idCardNo: '1100100333333',
        licenseNo: '34567890',
        licenseType: LicenseType.TYPE_3,
        licenseExpiry: new Date('2027-03-20'),
        address: '33/8 ถ.พหลโยธิน กรุงเทพฯ',
        salary: 20000,
        startDate: new Date('2021-07-01'),
        status: DriverStatus.ACTIVE,
      },
    }),
  ])

  // สร้างรถตัวอย่าง
  const trucks = await Promise.all([
    prisma.truck.upsert({
      where: { licensePlate: 'กข-1234' },
      update: {},
      create: {
        licensePlate: 'กข-1234',
        truckType: TruckType.LARGE_TRUCK,
        brand: 'HINO',
        model: 'FM8JMSA',
        year: 2020,
        color: 'ขาว',
        taxExpiry: new Date('2026-03-31'),
        actExpiry: new Date('2026-03-31'),
        insuranceExpiry: new Date('2026-04-30'),
        insuranceCompany: 'กรุงเทพประกันภัย',
        status: TruckStatus.IN_USE,
        driverId: drivers[0].id,
      },
    }),
    prisma.truck.upsert({
      where: { licensePlate: 'คง-5678' },
      update: {},
      create: {
        licensePlate: 'คง-5678',
        truckType: TruckType.LARGE_TRUCK,
        brand: 'ISUZU',
        model: 'FXZ 360',
        year: 2019,
        color: 'น้ำเงิน',
        taxExpiry: new Date('2025-08-31'),
        actExpiry: new Date('2025-08-31'),
        insuranceExpiry: new Date('2025-09-30'),
        insuranceCompany: 'เมืองไทยประกันภัย',
        status: TruckStatus.ACTIVE,
        driverId: drivers[1].id,
      },
    }),
    prisma.truck.upsert({
      where: { licensePlate: 'จฉ-9012' },
      update: {},
      create: {
        licensePlate: 'จฉ-9012',
        truckType: TruckType.MEDIUM_TRUCK,
        brand: 'HINO',
        model: '500 FC9JLTA',
        year: 2021,
        color: 'แดง',
        taxExpiry: new Date('2026-11-30'),
        actExpiry: new Date('2026-11-30'),
        insuranceExpiry: new Date('2026-12-31'),
        insuranceCompany: 'ไทยวิวัฒน์ประกันภัย',
        status: TruckStatus.MAINTENANCE,
        driverId: drivers[2].id,
      },
    }),
  ])

  // สร้างงานตัวอย่าง
  await prisma.job.upsert({
    where: { jobNo: 'JOB-2024-001' },
    update: {},
    create: {
      jobNo: 'JOB-2024-001',
      receivedDate: new Date('2024-01-10'),
      deliveryDate: new Date('2024-01-11'),
      customerId: customers[0].id,
      originAddress: '123 ถ.สุขุมวิท กรุงเทพฯ',
      destAddress: '456 ถ.มิตรภาพ ขอนแก่น',
      originProvince: 'กรุงเทพมหานคร',
      destProvince: 'ขอนแก่น',
      distance: 449,
      cargoType: 'อาหารแห้ง',
      cargoWeight: 15000,
      price: 25000,
      truckId: trucks[0].id,
      driverId: drivers[0].id,
      status: JobStatus.PAID,
      createdById: clerk.id,
    },
  })

  console.log('สร้างข้อมูลตัวอย่างเสร็จเรียบร้อย!')
  console.log({
    users: 3,
    customers: customers.length,
    drivers: drivers.length,
    trucks: trucks.length,
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

// This block will be replaced - ignore
