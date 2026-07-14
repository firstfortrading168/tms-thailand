import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Initializing database with permissions...')

    const permissions = await Promise.all([
      prisma.permission.upsert({
        where: { code: 'jobs' },
        update: {},
        create: { code: 'jobs', name: 'จัดการงานขนส่ง', description: 'สร้าง แก้ไข ดูงานขนส่ง' },
      }),
      prisma.permission.upsert({
        where: { code: 'routes' },
        update: {},
        create: { code: 'routes', name: 'วางแผนเส้นทาง', description: 'ใช้เครื่องมือวางแผนเส้นทาง' },
      }),
      prisma.permission.upsert({
        where: { code: 'trucks' },
        update: {},
        create: { code: 'trucks', name: 'จัดการรถ', description: 'บันทึก แก้ไข ดูข้อมูลรถ' },
      }),
      prisma.permission.upsert({
        where: { code: 'maintenance' },
        update: {},
        create: { code: 'maintenance', name: 'ซ่อมบำรุง', description: 'จัดการการซ่อมบำรุงรถ' },
      }),
      prisma.permission.upsert({
        where: { code: 'insurance' },
        update: {},
        create: { code: 'insurance', name: 'ประกัน/ภาษี', description: 'ดูและจัดการประกันภาษี' },
      }),
      prisma.permission.upsert({
        where: { code: 'drivers' },
        update: {},
        create: { code: 'drivers', name: 'จัดการคนขับ', description: 'บันทึก แก้ไข ข้อมูลคนขับ' },
      }),
      prisma.permission.upsert({
        where: { code: 'reports' },
        update: {},
        create: { code: 'reports', name: 'รายงาน', description: 'ดูรายงานการดำเนินงาน' },
      }),
      prisma.permission.upsert({
        where: { code: 'expenses' },
        update: {},
        create: { code: 'expenses', name: 'ค่าใช้จ่าย', description: 'บันทึกและอนุมัติค่าใช้จ่าย' },
      }),
      prisma.permission.upsert({
        where: { code: 'receivables' },
        update: {},
        create: { code: 'receivables', name: 'ลูกหนี้/เจ้าหนี้', description: 'จัดการใบแจ้งหนี้' },
      }),
      prisma.permission.upsert({
        where: { code: 'payroll' },
        update: {},
        create: { code: 'payroll', name: 'เงินเดือน', description: 'จัดการบัญชีเงินเดือน' },
      }),
      prisma.permission.upsert({
        where: { code: 'documents' },
        update: {},
        create: { code: 'documents', name: 'เอกสาร', description: 'ดูและจัดเก็บเอกสาร' },
      }),
    ])

    const rolePermissionsData: Record<string, string[]> = {
      OWNER: ['jobs', 'routes', 'trucks', 'maintenance', 'insurance', 'drivers', 'reports', 'expenses', 'receivables', 'payroll', 'documents'],
      MANAGER: ['jobs', 'trucks', 'maintenance', 'insurance', 'drivers', 'expenses'],
      DRIVER: ['jobs', 'insurance'],
      ACCOUNTANT: ['reports', 'expenses', 'receivables', 'payroll', 'documents'],
      CLERK: ['jobs', 'expenses'],
    }

    for (const [role, permCodes] of Object.entries(rolePermissionsData)) {
      await prisma.rolePermission.deleteMany({
        where: { role: role as any },
      })

      for (const permCode of permCodes) {
        const perm = permissions.find(p => p.code === permCode)
        if (perm) {
          await prisma.rolePermission.upsert({
            where: { role_permissionId: { role: role as any, permissionId: perm.id } },
            update: {},
            create: { role: role as any, permissionId: perm.id },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      permissions: permissions.length,
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'To initialize the database, send a POST request to /api/init',
  })
}
