'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, Truck, Users,
  DollarSign, BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileMenu = [
  { href: '/', icon: LayoutDashboard, label: 'หน้าหลัก' },
  { href: '/jobs', icon: ClipboardList, label: 'งาน' },
  { href: '/trucks', icon: Truck, label: 'รถ' },
  { href: '/drivers', icon: Users, label: 'คนขับ' },
  { href: '/expenses', icon: DollarSign, label: 'ค่าใช้จ่าย' },
  { href: '/reports', icon: BarChart3, label: 'รายงาน' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
      <ul className="flex items-center justify-around py-2">
        {mobileMenu.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
