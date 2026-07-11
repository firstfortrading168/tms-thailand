'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import {
  AlertTriangle, ShieldAlert, FileWarning, Clock,
  TrendingUp, DollarSign, Truck, Package,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '@/lib/constants'

// ข้อมูลตัวอย่าง
const getSuspiciousAlert = (count: number) => {
  if (count === 0) return null
  return { icon: AlertCircle, label: 'ใบเสร็จต้องตรวจสอบ', value: `${count} รายการ`, sub: 'อาจไม่น่าเชื่อถือ', color: 'text-red-600', bg: 'bg-red-50 border-red-100', href: '/expenses' }
}

const baseAlerts = [
  { icon: ShieldAlert, label: 'ประกันรถหมดอายุ', value: '2 คัน', sub: 'ภายใน 7 วัน', color: 'text-red-600', bg: 'bg-red-50 border-red-100', href: '/insurance' },
  { icon: FileWarning, label: 'ภาษีรถหมดอายุ', value: '3 คัน', sub: 'ภายใน 25 วัน', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', href: '/insurance' },
  { icon: AlertTriangle, label: 'ใบขับขี่หมดอายุ', value: '5 คน', sub: 'ภายใน 20 วัน', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', href: '/drivers' },
]

const kpis = [
  {
    label: 'รายได้เดือนนี้',
    value: '2.48 ล้าน',
    unit: 'บาท',
    trend: +12.5,
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'กำไรสุทธิ (ประมาณ)',
    value: '620,000',
    unit: 'บาท',
    trend: +8.2,
    icon: DollarSign,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'งานกำลังวิ่ง',
    value: '12',
    unit: 'เที่ยว',
    trend: +2,
    icon: Package,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    label: 'รถพร้อมใช้งาน',
    value: '28 / 40',
    unit: 'คัน',
    trend: null,
    icon: Truck,
    iconBg: 'bg-slate-50',
    iconColor: 'text-slate-600',
  },
]

const fleetStatus = [
  { label: 'ใช้งานอยู่', value: 28, pct: 70, color: '#10b981', statusParam: 'IN_USE' },
  { label: 'ว่าง', value: 9, pct: 22.5, color: '#9ca3af', statusParam: 'ACTIVE' },
  { label: 'ซ่อมบำรุง', value: 3, pct: 7.5, color: '#ef4444', statusParam: 'MAINTENANCE' },
]

const financials = [
  { label: 'ลูกหนี้ค้างชำระ', value: 1850000, color: 'text-red-600', href: '/receivables' },
  { label: 'ค่าน้ำมัน', value: 380000, color: 'text-amber-600', href: '/fuel' },
  { label: 'ค่าใช้จ่ายรวม', value: 950000, color: 'text-gray-800', href: '/expenses' },
]

const topPerformers = [
  { type: 'รายได้สูงสุด', plate: 'กข-1234', amount: 185000, up: true },
  { type: 'ค่าใช้จ่ายสูงสุด', plate: 'คง-5678', amount: 95000, up: false },
]

const recentJobs = [
  { id: '1', jobNo: 'JOB-2568-0042', customer: 'บริษัท ไทยฟูด จำกัด', route: 'กรุงเทพฯ → ขอนแก่น', driver: 'นายวิชัย ใจดี', truck: 'กข-1234', status: 'IN_TRANSIT', price: 25000, date: '27/05/2568 10:30' },
  { id: '2', jobNo: 'JOB-2568-0041', customer: 'บริษัท สยามอุตสาหกรรม', route: 'ชลบุรี → นครราชสีมา', driver: 'นายสมชาย รักดี', truck: 'กข-5678', status: 'DELIVERED', price: 18500, date: '27/05/2568 09:15' },
  { id: '3', jobNo: 'JOB-2568-0040', customer: 'บริษัท เจริญทรัพย์ จำกัด', route: 'ระยอง → กรุงเทพฯ', driver: 'นายสันติชัย มีโชค', truck: 'คง-9012', status: 'IN_TRANSIT', price: 22000, date: '27/05/2568 08:45' },
  { id: '4', jobNo: 'JOB-2568-0039', customer: 'บริษัท พี.เค. เทรดดิ้ง', route: 'กรุงเทพฯ → เชียงใหม่', driver: 'นายกิตติพงษ์ คำมา', truck: 'ชข-3456', status: 'PENDING', price: 35000, date: '27/05/2568 08:20' },
  { id: '5', jobNo: 'JOB-2568-0038', customer: 'บริษัท อีสเทิร์น โลจิสติกส์', route: 'สมุทรปราการ → ชลบุรี', driver: 'นายณัฐพล แก้วคา', truck: 'บข-7890', status: 'DELIVERED', price: 12000, date: '26/05/2568 17:40' },
  { id: '6', jobNo: 'JOB-2568-0037', customer: 'บริษัท ไทยฟูด จำกัด', route: 'กรุงเทพฯ → สุราษฎร์ธานี', driver: 'นายวิรัตน์ ใหญ่', truck: 'กข-1234', status: 'PAID', price: 42000, date: '26/05/2568 14:20' },
  { id: '7', jobNo: 'JOB-2568-0036', customer: 'บริษัท ซันไชน์ ฟู้ด', route: 'นครปฐม → ขอนแก่น', driver: 'นายประยูร ดีใจ', truck: 'งข-2345', status: 'INVOICED', price: 28000, date: '26/05/2568 11:00' },
  { id: '8', jobNo: 'JOB-2568-0035', customer: 'บริษัท โชคดี อินดัสตรี้', route: 'กรุงเทพฯ → เชียงราย', driver: 'นายมงคล สุขใจ', truck: 'จข-6789', status: 'WAITING_TRUCK', price: 48000, date: '26/05/2568 09:30' },
  { id: '9', jobNo: 'JOB-2568-0034', customer: 'ห้างสรรพสินค้า บิ๊กซี', route: 'ชลบุรี → กรุงเทพฯ', driver: 'นายสมบัติ รักงาน', truck: 'ฉข-1234', status: 'PAID', price: 9500, date: '25/05/2568 18:45' },
  { id: '10', jobNo: 'JOB-2568-0033', customer: 'บริษัท ไทยเบฟ จำกัด', route: 'กรุงเทพฯ → อยุธยา', driver: 'นายวิชัย ใจดี', truck: 'กข-1234', status: 'PAID', price: 8500, date: '25/05/2568 16:20' },
]

// Donut chart SVG
function DonutChart() {
  const total = 40
  const r = 52
  const cx = 64
  const cy = 64
  const circumference = 2 * Math.PI * r

  let offset = 0
  const segments = fleetStatus.map((s) => {
    const dash = (s.pct / 100) * circumference
    const gap = circumference - dash
    const seg = { ...s, dash, gap, offset }
    offset += dash
    return seg
  })

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
      {segments.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth="18"
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circumference * 0.25}
          strokeLinecap="butt"
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#94a3b8">คัน</text>
    </svg>
  )
}

export default function DashboardPage() {
  const [suspiciousCount, setSuspiciousCount] = useState(0)

  useEffect(() => {
    // ดึง suspicious receipts จาก localStorage
    if (typeof window !== 'undefined') {
      const receipts = JSON.parse(localStorage.getItem('suspiciousReceipts') || '[]')
      const pending = receipts.filter((r: any) => r.status === 'PENDING_REVIEW').length
      setSuspiciousCount(pending)
    }
  }, [])

  return (
    <AppShell
      title="ภาพรวมธุรกิจขนส่ง"
      subtitle="สรุปภาพรวมการดำเนินงานล่าสุด"
      userName="สมชาย วงศ์ขนส่ง"
      userRole="OWNER"
    >
      <div className="space-y-5 max-w-[1400px]">

        {/* 1. Action Required */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ต้องดำเนินการ</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[getSuspiciousAlert(suspiciousCount), ...baseAlerts].filter(a => a !== null).map((a, i) => (
              <Link key={i} href={a.href}>
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${a.bg} hover:opacity-80 transition-opacity cursor-pointer`}>
                  <a.icon size={18} className={`flex-shrink-0 ${a.color}`} />
                  <div className="min-w-0">
                    <p className={`text-base font-bold ${a.color} leading-tight`}>{a.value}</p>
                    <p className="text-xs text-gray-600 leading-tight truncate">{a.label}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{a.sub}</p>
                  </div>
                  <ArrowUpRight size={14} className={`ml-auto flex-shrink-0 ${a.color} opacity-60`} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Primary KPIs */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ภาพรวมสำคัญ</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                    <kpi.icon size={16} className={kpi.iconColor} />
                  </div>
                  {kpi.trend !== null && (
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {kpi.trend > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {Math.abs(kpi.trend)}%
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-0.5">{kpi.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                  <span className="text-xs text-gray-400">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 + 4 + 5. Fleet, Financial, Top Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Fleet Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">สถานะรถทั้งหมด</p>
              <span className="text-xs text-gray-400">รวม 40 คัน</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <DonutChart />
              </div>
              <div className="space-y-3 flex-1">
                {fleetStatus.map((s, i) => (
                  <Link
                    key={i}
                    href={`/trucks?status=${s.statusParam}`}
                    className="flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">{s.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{s.value}</span>
                      <span className="text-xs text-gray-400 ml-1">({s.pct}%)</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Snapshot */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">ภาพรวมการเงิน (เดือนนี้)</p>
              <Link href="/reports" className="text-xs text-blue-600 hover:text-blue-700">ดูรายงาน →</Link>
            </div>
            <div className="space-y-3">
              {financials.map((f, i) => (
                <Link key={i} href={f.href} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 hover:opacity-70 transition-opacity">
                  <span className="text-xs text-gray-600">{f.label}</span>
                  <span className={`text-sm font-semibold ${f.color}`}>
                    {formatCurrency(f.value)} บาท
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Performance */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">รถที่มีผลการดำเนินงาน</p>
            </div>
            <div className="space-y-3">
              {topPerformers.map((t, i) => (
                <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl ${t.up ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.up ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {t.up
                        ? <ArrowUpRight size={16} className="text-emerald-600" />
                        : <ArrowDownRight size={16} className="text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 leading-tight">{t.type}</p>
                      <p className="text-sm font-bold text-gray-900 font-mono">{t.plate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${t.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      ฿{formatCurrency(t.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">บาท</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Latest Jobs Table */}
        <section className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">งานขนส่งล่าสุด</p>
            <Link href="/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">เลขที่งาน</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">ลูกค้า</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">เส้นทาง</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">คนขับ</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">รถ</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">สถานะ</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">รายได้ (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <Link href={`/jobs/${job.id}`} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                        {job.jobNo}
                      </Link>
                      <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{job.date}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-700 max-w-[160px] truncate">{job.customer}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-gray-600 max-w-[180px] truncate">{job.route}</p>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <p className="text-xs text-gray-600 max-w-[140px] truncate">{job.driver}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-mono text-gray-700">{job.truck}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${JOB_STATUS_COLORS[job.status]}`}>
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-semibold text-gray-900">{formatCurrency(job.price)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </AppShell>
  )
}
