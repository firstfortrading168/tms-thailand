'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Plus, Search, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatCurrency, formatThaiDate } from '@/lib/utils'
import { EXPENSE_TYPE_LABELS, EXPENSE_STATUS_LABELS, EXPENSE_STATUS_COLORS } from '@/lib/constants'

const mockExpenses = [
  {
    id: '1', expenseDate: '2024-06-14', type: 'FUEL', amount: 4500,
    description: 'เติมน้ำมันดีเซล 90 ลิตร', truck: 'กข-1234', driver: 'สมพงษ์ ขับดี',
    jobNo: 'JOB-2568-0042', status: 'APPROVED', hasReceipt: true,
  },
  {
    id: '2', expenseDate: '2024-06-14', type: 'TOLL', amount: 250,
    description: 'ค่าทางด่วนพิเศษ', truck: 'กข-1234', driver: 'สมพงษ์ ขับดี',
    jobNo: 'JOB-2568-0042', status: 'PENDING', hasReceipt: false,
  },
  {
    id: '3', expenseDate: '2024-06-13', type: 'REPAIR', amount: 12500,
    description: 'ซ่อมระบบเบรก', truck: 'คง-5678', driver: 'วิรัตน์ ปลอดภัย',
    jobNo: null, status: 'APPROVED', hasReceipt: true,
  },
  {
    id: '4', expenseDate: '2024-06-13', type: 'TIRE', amount: 3800,
    description: 'ปะยาง 2 เส้น', truck: 'จฉ-9012', driver: 'ประเสริฐ วิ่งเก่ง',
    jobNo: 'JOB-2568-0040', status: 'PENDING', hasReceipt: true,
  },
  {
    id: '5', expenseDate: '2024-06-12', type: 'ACCOMMODATION', amount: 600,
    description: 'ค่าที่พัก 1 คืน ขอนแก่น', truck: 'ชซ-3456', driver: 'สมบัติ ขับเก่ง',
    jobNo: 'JOB-2568-0039', status: 'REJECTED', hasReceipt: false,
  },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'APPROVED' } : e))
  }

  const handleReject = (id: string) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'REJECTED' } : e))
  }

  const pendingCount = expenses.filter(e => e.status === 'PENDING').length
  const totalAmount = expenses.filter(e => e.status === 'APPROVED').reduce((s, e) => s + e.amount, 0)

  const filtered = expenses.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter
    const matchType = typeFilter === 'ALL' || e.type === typeFilter
    const matchSearch = search === '' ||
      e.description.includes(search) ||
      e.truck.includes(search) ||
      e.driver.includes(search)
    return matchStatus && matchType && matchSearch
  })

  return (
    <AppShell title="ค่าใช้จ่าย" subtitle="บันทึกและอนุมัติค่าใช้จ่ายการขนส่ง" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-600" />
            <p className="text-xs text-gray-500">รออนุมัติ</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-xs text-gray-400">รายการ</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-xs text-gray-500">อนุมัติแล้ว</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-gray-500" />
            <p className="text-xs text-gray-500">ไม่อนุมัติ</p>
          </div>
          <p className="text-2xl font-bold text-red-500">
            {mockExpenses.filter(e => e.status === 'REJECTED').length}
          </p>
          <p className="text-xs text-gray-400">รายการ</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหารายละเอียด, ทะเบียนรถ, คนขับ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="ALL">ทุกประเภท</option>
          {Object.entries(EXPENSE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary whitespace-nowrap">
          <Plus size={16} />
          บันทึกค่าใช้จ่าย
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'ทั้งหมด' : EXPENSE_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">วันที่</th>
                <th className="table-header">ประเภท</th>
                <th className="table-header">รายละเอียด</th>
                <th className="table-header hidden md:table-cell">รถ / คนขับ</th>
                <th className="table-header hidden lg:table-cell">งาน</th>
                <th className="table-header text-right">จำนวนเงิน</th>
                <th className="table-header text-center">ใบเสร็จ</th>
                <th className="table-header text-center">สถานะ</th>
                <th className="table-header text-center">อนุมัติ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="table-cell text-sm">{formatThaiDate(exp.expenseDate)}</td>
                  <td className="table-cell">
                    <span className="text-sm">{EXPENSE_TYPE_LABELS[exp.type]}</span>
                  </td>
                  <td className="table-cell text-sm text-gray-600">{exp.description}</td>
                  <td className="table-cell hidden md:table-cell">
                    <p className="font-mono text-sm font-medium">{exp.truck}</p>
                    <p className="text-xs text-gray-400">{exp.driver}</p>
                  </td>
                  <td className="table-cell hidden lg:table-cell text-xs text-blue-600">
                    {exp.jobNo || '-'}
                  </td>
                  <td className="table-cell text-right font-semibold text-gray-900">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="table-cell text-center">
                    {exp.hasReceipt ? (
                      <span className="text-green-600 text-xs">✓ มีใบเสร็จ</span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="table-cell text-center">
                    <Badge label={EXPENSE_STATUS_LABELS[exp.status]} colorClass={EXPENSE_STATUS_COLORS[exp.status]} />
                  </td>
                  <td className="table-cell text-center">
                    {exp.status === 'PENDING' && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleApprove(exp.id)}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          title="อนุมัติ"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(exp.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="ไม่อนุมัติ"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="บันทึกค่าใช้จ่าย"
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">ยกเลิก</button>
            <button className="btn-primary">ส่งขออนุมัติ</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">วันที่เกิดค่าใช้จ่าย <span className="text-red-500">*</span></label>
              <input type="date" className="form-input" />
            </div>
            <div>
              <label className="form-label">ประเภทค่าใช้จ่าย <span className="text-red-500">*</span></label>
              <select className="form-select">
                <option value="">-- เลือกประเภท --</option>
                {Object.entries(EXPENSE_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">รายละเอียด</label>
            <input className="form-input" placeholder="รายละเอียดค่าใช้จ่าย" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
              <input type="number" className="form-input" placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">ทะเบียนรถ</label>
              <select className="form-select">
                <option value="">-- เลือกรถ --</option>
                <option>กข-1234</option>
                <option>คง-5678</option>
                <option>จฉ-9012</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">เลขที่งาน (ถ้ามี)</label>
            <select className="form-select">
              <option value="">-- เลือกงาน --</option>
              <option>JOB-2568-0042</option>
              <option>JOB-2568-0041</option>
            </select>
          </div>
          <div>
            <label className="form-label">แนบรูปใบเสร็จ</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปใบเสร็จ</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (ขนาดสูงสุด 5 MB)</p>
            </div>
          </div>
          <div>
            <label className="form-label">หมายเหตุ</label>
            <textarea className="form-input resize-none" rows={2} placeholder="หมายเหตุเพิ่มเติม..." />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
