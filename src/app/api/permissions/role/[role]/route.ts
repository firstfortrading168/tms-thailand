import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Returns the permission CODES (e.g. "jobs", "trucks") granted to a role
export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { role: params.role.toUpperCase() as any },
      include: { permission: true },
    })

    const codes = rolePermissions.map((rp) => rp.permission.code)
    return NextResponse.json(codes)
  } catch (error) {
    console.error('Error fetching role permissions:', error)
    return NextResponse.json({ error: 'Failed to fetch role permissions' }, { status: 500 })
  }
}

// Body: { permissionIds: string[] } where each item is a permission CODE
export async function PUT(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const role = params.role.toUpperCase()
    const data = await request.json()
    const codes: string[] = data.permissionIds || []

    // Resolve codes -> permission ids
    const perms = await prisma.permission.findMany({
      where: { code: { in: codes } },
    })

    await prisma.rolePermission.deleteMany({ where: { role: role as any } })

    if (perms.length > 0) {
      await prisma.rolePermission.createMany({
        data: perms.map((p) => ({ role: role as any, permissionId: p.id })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({ success: true, role, permissionIds: codes })
  } catch (error) {
    console.error('Error updating role permissions:', error)
    return NextResponse.json({ error: 'Failed to update role permissions' }, { status: 500 })
  }
}
