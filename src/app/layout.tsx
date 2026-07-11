import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  title: 'ระบบบริหารจัดการขนส่ง | TMS Thailand',
  description: 'ระบบบริหารจัดการธุรกิจขนส่งรถบรรทุก สำหรับบริษัทขนส่งในประเทศไทย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className={sarabun.className}>
        {children}
      </body>
    </html>
  )
}
