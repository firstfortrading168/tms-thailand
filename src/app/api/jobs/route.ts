import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateJobNo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const customerId = searchParams.get('customerId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (customerId) {
    where.customerId = customerId
  }

  if (search) {
    where.OR = [
      { jobNo: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
      { truck: { licensePlate: { contains: search } } },
    ]
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        customer: { select: { name: true, code: true } },
        truck: { select: { licensePlate: true, truckType: true } },
        driver: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  return NextResponse.json({ jobs, total, page, limit })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // หาลำดับงานถัดไป
  const jobCount = await prisma.job.count()
  const jobNo = generateJobNo(jobCount + 1)

  const job = await prisma.job.create({
    data: {
      ...body,
      jobNo,
    },
    include: {
      customer: true,
      truck: true,
      driver: true,
    },
  })

  return NextResponse.json(job, { status: 201 })
}
