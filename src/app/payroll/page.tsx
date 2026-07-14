'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Search, Download, Edit2, Check, X, ChevronDown } from 'lucide-react'
import { formatCurrency, formatThaiDate } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { th } from 'date-fns/locale'

// ข้อมูลคนขับและรายได้
const drivers = [
  { id: '1', code: 'D001', name: 'สมพงษ์ ขับดี', phone: '089-111-1111' },
  { id: '2', code: 'D002', name: 'วิรัตน์ ปลอดภัย', phone: '089-222-2222' },
  { id: '3', code: 'D003', name: 'ประเสริฐ วิ่งเก่ง', phone: '089-333-3333' },
]

// ข้อมูลงานและค่าใช้จ่าย
const payrollData: Record<string, {
  jobs: Array<{ jobNo: string; from: string; to: string; amount: number; date: string }>
  expenses: Array<{ type: string; description: string; amount: number; date: string }>
  allowance?: number
}> = {
  'D001': {
    jobs: [
      { jobNo: 'JOB-2568-0042', from: 'กรุงเทพฯ', to: 'ขอนแก่น', amount: 25000, date: '2024-06-14' },
      { jobNo: 'JOB-2568-0041', from: 'ชลบุรี', to: 'กรุงเทพฯ', amount: 18500, date: '2024-06-15' },
      { jobNo: 'JOB-2568-0039', from: 'นนทบุรี', to: 'ระยอง', amount: 12000, date: '2024-06-17' },
    ],
    expenses: [
      { type: 'เบี้ยเลี้ยง', description: 'เบี้ยเลี้ยง 3 วัน (500 บาท/วัน)', amount: -1500, date: '2024-06-14' },
      { type: 'เงินเบิก', description: 'เบิกเงินล่วงหน้า', amount: -5000, date: '2024-06-10' },
      { type: 'อื่นๆ', description: 'ค่ายา', amount: -500, date: '2024-06-12' },
    ],
    allowance: 15000,
  },
  'D002': {
    jobs: [
      { jobNo: 'JOB-2568-0040', from: 'พัทยา', to: 'ชลบุรี', amount: 22000, date: '2024-06-12' },
      { jobNo: 'JOB-2568-0038', from: 'นครปฐม', to: 'เชียงใหม่', amount: 35000, date: '2024-06-18' },
    ],
    expenses: [
      { type: 'เบี้ยเลี้ยง', description: 'เบี้ยเลี้ยง 2 วัน (500 บาท/วัน)', amount: -1000, date: '2024-06-14' },
    ],
    allowance: 15000,
  },
  'D003': {
    jobs: [
      { jobNo: 'JOB-2568-0043', from: 'ชลบุรี', to: 'ระยอง', amount: 15000, date: '2024-06-16' },
      { jobNo: 'JOB-2568-0044', from: 'สตูล', to: 'ภูเก็ต', amount: 28000, date: '2024-06-19' },
    ],
    expenses: [
      { type: 'เบี้ยเลี้ยง', description: 'เบี้ยเลี้ยง 4 วัน (500 บาท/วัน)', amount: -2000, date: '2024-06-15' },
      { type: 'เงินเบิก', description: 'เบิกเงินล่วงหน้า', amount: -3000, date: '2024-06-14' },
    ],
    allowance: 15000,
  },
}

export default function PayrollPage() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [month, setMonth] = useState('2024-06')
  const [editingAllowance, setEditingAllowance] = useState<string | null>(null)
  const [allowanceValues, setAllowanceValues] = useState<Record<string, number>>(
    Object.fromEntries(drivers.map(d => [d.id, payrollData[d.code]?.allowance || 15000]))
  )

  const driverCode = selectedDriver ? drivers.find(d => d.id === selectedDriver)?.code : null
  const data = driverCode ? payrollData[driverCode] : null

  if (!data) {
    return (
      <AppShell title="บัญชีเงินเดือนและเบี้ยเลี้ยง" subtitle="คำนวณเงินจ่ายให้พนักงานขับรถ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">เลือกคนขับ</label>
              <select
                value={selectedDriver || ''}
                onChange={(e) => setSelectedDriver(e.target.value || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- เลือกคนขับ --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เดือน</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Search size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">เลือกคนขับเพื่อดูบัญชีเงินเดือน</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const driver = drivers.find(d => d.id === selectedDriver)!
  const totalJobsIncome = data.jobs.reduce((sum, job) => sum + job.amount, 0)
  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netPay = totalJobsIncome + totalExpenses + (allowanceValues[selectedDriver!] || 0)

  return (
    <AppShell title="บัญชีเงินเดือนและเบี้ยเลี้ยง" subtitle="คำนวณเงินจ่ายให้พนักงานขับรถ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="space-y-5 max-w-4xl">

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">คนขับ</p>
              <p className="text-2xl font-bold text-gray-900">{driver.name}</p>
              <p className="text-sm text-gray-600 mt-1">📞 {driver.phone} | รหัส: {driver.code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เลือกคนขับ</label>
              <select
                value={selectedDriver || ''}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เดือน</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">รายได้จากงาน</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalJobsIncome)}</p>
              <p className="text-xs text-gray-400 mt-1">{data.jobs.length} เที่ยว</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ค่าใช้จ่าย</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(Math.abs(totalExpenses))}</p>
              <p className="text-xs text-gray-400 mt-1">{data.expenses.length} รายการ</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">เงินเดือน</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(allowanceValues[selectedDriver!] || 0)}</p>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">รายได้จากการขนส่ง</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.jobs.map((job, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">{job.jobNo}</p>
                  <p className="text-xs text-gray-600">{job.from} → {job.to}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatThaiDate(job.date)}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(job.amount)}</p>
              </div>
            ))}
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">รวมรายได้</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalJobsIncome)}</p>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">ค่าใช้จ่าย / เงินเบิก</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.expenses.map((exp, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{exp.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{exp.type} • {formatThaiDate(exp.date)}</p>
                </div>
                <p className={`text-sm font-semibold ${exp.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(exp.amount)}
                </p>
              </div>
            ))}
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">รวมค่าใช้จ่าย</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(Math.abs(totalExpenses))}</p>
            </div>
          </div>
        </div>

        {/* Allowance Section */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">เงินเดือนหรือเบี้ยเลี้ยงประจำ</h3>
            {editingAllowance !== selectedDriver && (
              <button
                onClick={() => setEditingAllowance(selectedDriver)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Edit2 size={13} />
                แก้ไข
              </button>
            )}
          </div>
          <div className="px-6 py-4">
            {editingAllowance === selectedDriver ? (
              <div className="flex gap-3">
                <input
                  type="number"
                  value={allowanceValues[selectedDriver!]}
                  onChange={(e) => setAllowanceValues({
                    ...allowanceValues,
                    [selectedDriver!]: parseFloat(e.target.value) || 0
                  })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setEditingAllowance(null)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(allowanceValues[selectedDriver!] || 0)}</p>
            )}
          </div>
        </div>

        {/* Net Pay Section */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium mb-2">เงินที่ต้องจ่ายสุทธิ</p>
            <p className={`text-4xl font-bold ${netPay >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(netPay)}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              {formatCurrency(totalJobsIncome)} (รายได้) + {formatCurrency(totalExpenses)} (ค่าใช้จ่าย) + {formatCurrency(allowanceValues[selectedDriver!] || 0)} (เงินเดือน)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={16} />
            พิมพ์รายงาน
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            ส่งรายการให้คนขับ
          </button>
        </div>

      </div>
    </AppShell>
  )
}
