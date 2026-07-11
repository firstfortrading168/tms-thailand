'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, Map,
  Truck, Wrench, ShieldCheck,
  Users, CreditCard, BarChart3,
  Receipt, FileText, Settings,
  LogOut, ChevronLeft, Menu, TrendingUp, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole = 'OWNER' | 'MANAGER' | 'DRIVER' | 'ACCOUNTANT'

interface MenuItem {
  href: string
  icon: any
  label: string
  roles?: UserRole[]
}

interface MenuGroup {
  group?: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    items: [
      { href: '/', icon: LayoutDashboard, label: 'ภาพรวม' },
    ],
  },
  {
    group: 'การดำเนินงาน',
    items: [
      { href: '/jobs', icon: ClipboardList, label: 'งานขนส่ง', roles: ['OWNER', 'MANAGER', 'DRIVER'] },
      { href: '/routes', icon: Map, label: 'วางแผนเส้นทาง', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    group: 'รถและยานพาหนะ',
    items: [
      { href: '/trucks', icon: Truck, label: 'รายการรถ', roles: ['OWNER', 'MANAGER'] },
      { href: '/maintenance', icon: Wrench, label: 'ซ่อมบำรุง', roles: ['OWNER', 'MANAGER'] },
      { href: '/insurance', icon: ShieldCheck, label: 'ประกัน / ภาษี', roles: ['OWNER', 'MANAGER', 'DRIVER'] },
    ],
  },
  {
    group: 'บุคลากร',
    items: [
      { href: '/drivers', icon: Users, label: 'คนขับรถ', roles: ['OWNER', 'MANAGER'] },
      { href: '/licenses', icon: CreditCard, label: 'ใบอนุญาต', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    group: 'การเงิน',
    items: [
      { href: '/reports', icon: TrendingUp, label: 'รายรับ', roles: ['OWNER', 'ACCOUNTANT'] },
      { href: '/expenses', icon: Receipt, label: 'ค่าใช้จ่าย', roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { href: '/receivables', icon: BarChart3, label: 'ลูกหนี้ / เจ้าหนี้', roles: ['OWNER', 'ACCOUNTANT'] },
      { href: '/payroll', icon: CreditCard, label: 'บัญชีเงินเดือน', roles: ['OWNER', 'ACCOUNTANT'] },
    ],
  },
  {
    group: 'ข้อมูลหลัก',
    items: [
      { href: '/customers', icon: Building2, label: 'ลูกค้า', roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    items: [
      { href: '/documents', icon: FileText, label: 'เอกสาร', roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { href: '/settings', icon: Settings, label: 'ตั้งค่า', roles: ['OWNER'] },
    ],
  },
]

interface SidebarProps {
  userName?: string
  userRole?: UserRole
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ userName, userRole = 'OWNER', collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const canViewMenu = (roles?: UserRole[]) => {
    if (!roles) return true
    return roles.includes(userRole)
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-30 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">TMS Thailand</p>
              <p className="text-[10px] text-gray-400 leading-tight">ระบบบริหารการขนส่ง</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ml-auto"
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {menuGroups.map((group, gi) => {
          const visibleItems = group.items.filter(item => canViewMenu(item.roles))
          if (visibleItems.length === 0) return null

          return (
            <div key={gi} className={cn('px-3', gi > 0 && 'mt-1')}>
              {group.group && !collapsed && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">
                  {group.group}
                </p>
              )}
              {group.group && collapsed && <div className="border-t border-gray-100 my-2" />}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon size={16} className="flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 flex-shrink-0">
              {userName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-gray-900 truncate">{userName || 'ผู้ใช้งาน'}</p>
              <p className="text-[10px] text-gray-400">{userRole || ''}</p>
            </div>
            <Link href="/api/auth/signout" className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
              {userName?.charAt(0) || 'U'}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
