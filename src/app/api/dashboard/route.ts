import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  const today = new Date()
  const startMonth = startOfMonth(today)
  const endMonth = endOfMonth(today)
  const startToday = startOfDay(today)
  const endToday = endOfDay(today)

  const [
    todayRevenue,
    monthRevenue,
    activeJobs,
    truckStats,
    totalReceivables,
    monthFuelCost,
    monthExpenses,
    topRevenueTruck,
    topExpenseTruck,
  ] = await Promise.all([
    // รายได้วันนี้
    prisma.job.aggregate({
      where: {
        status: 'PAID',
        updatedAt: { gte: startToday, lte: endToday },
      },
      _sum: { price: true },
    }),

    // รายได้เดือนนี้
    prisma.job.aggregate({
      where: {
        status: { in: ['PAID', 'INVOICED'] },
        receivedDate: { gte: startMonth, lte: endMonth },
      },
      _sum: { price: true },
    }),

    // งานที่กำลังวิ่ง
    prisma.job.count({
      where: { status: 'IN_TRANSIT' },
    }),

    // สถิติรถ
    prisma.truck.groupBy({
      by: ['status'],
      _count: true,
    }),

    // ลูกหนี้รวม
    prisma.invoice.aggregate({
      where: { status: { in: ['UNPAID', 'PARTIAL', 'OVERDUE'] } },
      _sum: { totalAmount: true, paidAmount: true },
    }),

    // ค่าน้ำมันเดือนนี้
    prisma.fuelLog.aggregate({
      where: { logDate: { gte: startMonth, lte: endMonth } },
      _sum: { amount: true },
    }),

    // ค่าใช้จ่ายทั้งหมดเดือนนี้ (ที่อนุมัติ)
    prisma.expense.aggregate({
      where: {
        status: 'APPROVED',
        expenseDate: { gte: startMonth, lte: endMonth },
      },
      _sum: { amount: true },
    }),

    // รถที่รายได้สูงสุด
    prisma.job.groupBy({
      by: ['truckId'],
      where: {
        status: { in: ['PAID', 'INVOICED'] },
        receivedDate: { gte: startMonth, lte: endMonth },
        truckId: { not: null },
      },
      _sum: { price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 1,
    }),

    // รถที่ค่าใช้จ่ายสูงสุด
    prisma.expense.groupBy({
      by: ['truckId'],
      where: {
        status: 'APPROVED',
        expenseDate: { gte: startMonth, lte: endMonth },
        truckId: { not: null },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    }),
  ])

  const activeTrucks = truckStats.find(s => s.status === 'IN_USE')?._count || 0
  const maintenanceTrucks = truckStats.find(s => s.status === 'MAINTENANCE')?._count || 0

  const totalRev = Number(monthRevenue._sum?.price || 0)
  const totalExp = Number(monthExpenses._sum?.amount || 0) + Number(monthFuelCost._sum?.amount || 0)
  const estimatedProfit = totalRev - totalExp

  const outstandingReceivables =
    Number(totalReceivables._sum?.totalAmount || 0) -
    Number(totalReceivables._sum?.paidAmount || 0)

  // ดึงทะเบียนรถ
  let topRevenueTruckPlate = '-'
  let topExpenseTruckPlate = '-'

  if (topRevenueTruck[0]?.truckId) {
    const truck = await prisma.truck.findUnique({
      where: { id: topRevenueTruck[0].truckId as string },
      select: { licensePlate: true },
    })
    topRevenueTruckPlate = truck?.licensePlate || '-'
  }

  if (topExpenseTruck[0]?.truckId) {
    const truck = await prisma.truck.findUnique({
      where: { id: topExpenseTruck[0].truckId as string },
      select: { licensePlate: true },
    })
    topExpenseTruckPlate = truck?.licensePlate || '-'
  }

  return NextResponse.json({
    todayRevenue: Number(todayRevenue._sum?.price || 0),
    monthRevenue: totalRev,
    activeJobs,
    activeTrucks,
    maintenanceTrucks,
    totalReceivables: outstandingReceivables,
    monthFuelCost: Number(monthFuelCost._sum?.amount || 0),
    estimatedProfit,
    topRevenueTruck: {
      plate: topRevenueTruckPlate,
      amount: Number(topRevenueTruck[0]?._sum?.price || 0),
    },
    topExpenseTruck: {
      plate: topExpenseTruckPlate,
      amount: Number(topExpenseTruck[0]?._sum?.amount || 0),
    },
  })
}
