'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import Header from './Header'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  userName?: string
  userRole?: string
}

export default function AppShell({ children, title, subtitle, userName, userRole }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - ซ่อนเฉพาะบน mobile เมื่อไม่ได้เปิด */}
      <div className={cn(
        'fixed md:relative',
        mobileMenuOpen ? 'block' : 'hidden md:block'
      )}>
        <Sidebar
          userName={userName}
          userRole={userRole}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300 min-h-screen flex flex-col bg-gray-50/50',
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
      )}>
        <Header
          title={title}
          subtitle={subtitle}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}
