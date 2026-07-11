import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'
import { ALERT_DAYS } from '@/lib/constants'

export async function GET() {
  const today = new Date()
  const alerts: Array<{
    id: string
    type: string
    message: string
    severity: 'danger' | 'warning' | 'info'
    href: string
    daysLeft?: number
  }> = []

  // ตรวจสอบภาษีรถ
  const taxExpiring = await prisma.truck.findMany({
    where: {
      status: { not: 'INACTIVE' },
      taxExpiry: {
        lte: addDays(today, ALERT_DAYS.TAX),
        gte: today,
      },
    },
    select: { licensePlate: true, taxExpiry: true },
  })

  taxExpiring.forEach((truck) => {
    const days = Math.ceil((truck.taxExpiry!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    alerts.push({
      id: `tax-${truck.licensePlate}`,
      type: 'TAX_EXPIRY',
      message: `รถ ${truck.licensePlate} ภาษีหมดอายุใน ${days} วัน`,
      severity: days <= 7 ? 'danger' : 'warning',
      href: '/trucks',
      daysLeft: days,
    })
  })

  // ตรวจสอบ พ.ร.บ.
  const actExpiring = await prisma.truck.findMany({
    where: {
      status: { not: 'INACTIVE' },
      actExpiry: {
        lte: addDays(today, ALERT_DAYS.ACT),
        gte: today,
      },
    },
    select: { licensePlate: true, actExpiry: true },
  })

  actExpiring.forEach((truck) => {
    const days = Math.ceil((truck.actExpiry!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    alerts.push({
      id: `act-${truck.licensePlate}`,
      type: 'ACT_EXPIRY',
      message: `รถ ${truck.licensePlate} พ.ร.บ.หมดอายุใน ${days} วัน`,
      severity: days <= 7 ? 'danger' : 'warning',
      href: '/trucks',
      daysLeft: days,
    })
  })

  // ตรวจสอบประกัน
  const insExpiring = await prisma.truck.findMany({
    where: {
      status: { not: 'INACTIVE' },
      insuranceExpiry: {
        lte: addDays(today, ALERT_DAYS.INSURANCE),
        gte: today,
      },
    },
    select: { licensePlate: true, insuranceExpiry: true },
  })

  insExpiring.forEach((truck) => {
    const days = Math.ceil((truck.insuranceExpiry!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    alerts.push({
      id: `ins-${truck.licensePlate}`,
      type: 'INSURANCE_EXPIRY',
      message: `รถ ${truck.licensePlate} ประกันหมดอายุใน ${days} วัน`,
      severity: days <= 7 ? 'danger' : 'warning',
      href: '/trucks',
      daysLeft: days,
    })
  })

  // ตรวจสอบใบขับขี่
  const licenseExpiring = await prisma.driver.findMany({
    where: {
      status: { not: 'INACTIVE' },
      licenseExpiry: {
        lte: addDays(today, ALERT_DAYS.LICENSE),
        gte: today,
      },
    },
    select: { firstName: true, lastName: true, licenseExpiry: true },
  })

  licenseExpiring.forEach((driver) => {
    const days = Math.ceil((driver.licenseExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    alerts.push({
      id: `lic-${driver.firstName}`,
      type: 'LICENSE_EXPIRY',
      message: `ใบขับขี่ นาย${driver.firstName} ${driver.lastName} หมดอายุใน ${days} วัน`,
      severity: days <= 15 ? 'danger' : 'warning',
      href: '/drivers',
      daysLeft: days,
    })
  })

  // ค่าใช้จ่ายรออนุมัติ
  const pendingExpenses = await prisma.expense.count({
    where: { status: 'PENDING' },
  })

  if (pendingExpenses > 0) {
    alerts.push({
      id: 'pending-expenses',
      type: 'PENDING_EXPENSES',
      message: `มีค่าใช้จ่ายรออนุมัติ ${pendingExpenses} รายการ`,
      severity: 'info',
      href: '/expenses',
    })
  }

  // เรียงลำดับ: danger ก่อน, warning, info
  alerts.sort((a, b) => {
    const order = { danger: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return NextResponse.json(alerts)
}
