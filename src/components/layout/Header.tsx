'use client'

import { Bell, Search, Menu, Plus } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
  onMobileMenuToggle?: () => void
}

export default function Header({ title, subtitle, onMobileMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, type: 'danger', text: 'รถ คง-5678 ประกันหมดอายุใน 7 วัน', time: '10 นาทีที่แล้ว' },
    { id: 2, type: 'warning', text: 'รถ กข-1234 ภาษีหมดอายุใน 25 วัน', time: '1 ชั่วโมงที่แล้ว' },
    { id: 3, type: 'info', text: 'ค่าใช้จ่ายรออนุมัติ 5 รายการ', time: '2 ชั่วโมงที่แล้ว' },
  ]

  return (
    <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2 mr-2">
          <Link href="/jobs/new" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} />
            สร้างงานขนส่ง
          </Link>
          <Link href="/expenses/new" className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
            <Plus size={13} />
            เพิ่มค่าใช้จ่าย
          </Link>
          <Link href="/trucks/new" className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
            <Plus size={13} />
            เพิ่มรถ
          </Link>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 w-52 border border-gray-100">
          <Search size={13} className="text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="bg-transparent text-xs text-gray-700 outline-none flex-1 placeholder:text-gray-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell size={17} className="text-gray-500" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <>
              {/* Backdrop to close on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">การแจ้งเตือน</h3>
                </div>
                <ul>
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'danger' ? 'bg-red-500' :
                          n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 font-medium hover:text-blue-700"
                  >
                    ดูทั้งหมด
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100 ml-1">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
            ส
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-gray-800 leading-tight">สมชาย</p>
            <p className="text-[10px] text-gray-400 leading-tight">เจ้าของกิจการ</p>
          </div>
        </div>
      </div>
    </header>
  )
}
