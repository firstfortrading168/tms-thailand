import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// แปลงตัวเลขเป็นรูปแบบเงินบาท
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

// แปลงตัวเลขเป็นรูปแบบตัวเลขทั่วไป
export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  return new Intl.NumberFormat('th-TH').format(n)
}

// แปลงวันที่เป็นภาษาไทย
export function formatThaiDate(date: Date | string | null): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'd MMM yyyy', { locale: th })
}

// แปลงวันที่และเวลาเป็นภาษาไทย
export function formatThaiDateTime(date: Date | string | null): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'd MMM yyyy HH:mm น.', { locale: th })
}

// คำนวณจำนวนวันที่เหลือ
export function daysUntil(date: Date | string | null): number | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const diff = d.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// แปลงสถานะหมดอายุ
export function getExpiryStatus(days: number | null): 'expired' | 'critical' | 'warning' | 'ok' {
  if (days === null) return 'ok'
  if (days < 0) return 'expired'
  if (days <= 15) return 'critical'
  if (days <= 30) return 'warning'
  return 'ok'
}

// สีแสดงสถานะหมดอายุ
export function getExpiryColor(days: number | null): string {
  const status = getExpiryStatus(days)
  switch (status) {
    case 'expired': return 'text-red-700 bg-red-100'
    case 'critical': return 'text-orange-700 bg-orange-100'
    case 'warning': return 'text-yellow-700 bg-yellow-100'
    default: return 'text-green-700 bg-green-100'
  }
}

// สร้างเลขที่งานอัตโนมัติ
export function generateJobNo(sequence: number): string {
  const year = new Date().getFullYear() + 543 // ปีพุทธศักราช
  const num = String(sequence).padStart(4, '0')
  return `JOB-${year}-${num}`
}

// สร้างเลขที่ใบแจ้งหนี้อัตโนมัติ
export function generateInvoiceNo(sequence: number): string {
  const now = new Date()
  const year = now.getFullYear() + 543
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const num = String(sequence).padStart(4, '0')
  return `INV-${year}${month}-${num}`
}

// แปลงปีพ.ศ.
export function toBuddhistYear(year: number): number {
  return year + 543
}

// ย่อข้อความ
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
