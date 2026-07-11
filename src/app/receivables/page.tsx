'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Search, FileText, DollarSign, AlertCircle, TrendingDown } from 'lucide-react'
import { formatCurrency, formatThaiDate, daysUntil } from '@/lib/utils'
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '@/lib/constants'

const mockInvoices = [
  {
    id: '1', invoiceNo: 'INV-2568-06-0001', invoiceDate: '2024-06-01', dueDate: '2024-07-01',
    customer: 'บริษัท ไทยฟู้ด จำกัด', subtotal: 120000, vatAmount: 8400, totalAmount: 128400,
    paidAmount: 0, status: 'UNPAID',
  },
  {
    id: '2', invoiceNo: 'INV-2568-06-0002', invoiceDate: '2024-06-03', dueDate: '2024-07-03',
    customer: 'บริษัท โชคดี อินดัสตรี้', subtotal: 85000, vatAmount: 5950, totalAmount: 90950,
    paidAmount: 45000, status: 'PARTIAL',
  },
  {
    id: '3', invoiceNo: 'INV-2568-05-0015', invoiceDate: '2024-05-10', dueDate: '2024-06-09',
    customer: 'ห้างหุ้นส่วนจำกัด สินค้าไทย', subtotal: 42000, vatAmount: 2940, totalAmount: 44940,
    paidAmount: 0, status: 'OVERDUE',
  },
  {
    id: '4', invoiceNo: 'INV-2568-05-0012', invoiceDate: '2024-05-05', dueDate: '2024-06-04',
    customer: 'บริษัท ขนส่งไทย จำกัด', subtotal: 65000, vatAmount: 4550, totalAmount: 69550,
    paidAmount: 69550, status: 'PAID',
  },
]

const totalReceivables = mockInvoices
  .filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
  .reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0)

const overdueAmount = mockInvoices
  .filter(i => i.status === 'OVERDUE')
  .reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0)

export default function ReceivablesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  const filtered = mockInvoices.filter((inv) => {
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter
    const matchSearch = search === '' ||
      inv.invoiceNo.includes(search) ||
      inv.customer.includes(search)
    return matchStatus && matchSearch
  })

  return (
    <AppShell title="ลูกหนี้" subtitle="จัดการใบแจ้งหนี้และติดตามการชำระเงิน" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <DollarSign size={18} className="text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">ลูกหนี้รวม</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalReceivables)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <AlertCircle size={18} className="text-red-600 mb-2" />
          <p className="text-xs text-gray-500">เกินกำหนด</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <FileText size={18} className="text-purple-600 mb-2" />
          <p className="text-xs text-gray-500">ใบแจ้งหนี้ค้าง</p>
          <p className="text-xl font-bold text-purple-600">
            {mockInvoices.filter(i => i.status !== 'PAID').length}
          </p>
          <p className="text-xs text-gray-400">ฉบับ</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <TrendingDown size={18} className="text-green-600 mb-2" />
          <p className="text-xs text-gray-500">ชำระแล้ว (เดือนนี้)</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(mockInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.paidAmount, 0))}
          </p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ใบแจ้งหนี้, ลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'UNPAID', 'PARTIAL', 'OVERDUE', 'PAID'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors whitespace-nowrap ${
                statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {s === 'ALL' ? 'ทั้งหมด' : INVOICE_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">เลขที่ใบแจ้งหนี้</th>
                <th className="table-header">ลูกค้า</th>
                <th className="table-header hidden md:table-cell">วันที่ออก</th>
                <th className="table-header">วันครบกำหนด</th>
                <th className="table-header text-right">ยอดรวม</th>
                <th className="table-header text-right hidden md:table-cell">ชำระแล้ว</th>
                <th className="table-header text-right">คงค้าง</th>
                <th className="table-header text-center">สถานะ</th>
                <th className="table-header text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const days = daysUntil(inv.dueDate)
                const outstanding = inv.totalAmount - inv.paidAmount
                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <p className="font-medium text-blue-600 text-sm">{inv.invoiceNo}</p>
                    </td>
                    <td className="table-cell text-sm font-medium">{inv.customer}</td>
                    <td className="table-cell hidden md:table-cell text-sm text-gray-500">
                      {formatThaiDate(inv.invoiceDate)}
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-sm">{formatThaiDate(inv.dueDate)}</p>
                        {inv.status !== 'PAID' && days !== null && days < 0 && (
                          <p className="text-xs text-red-600 font-medium">เกิน {Math.abs(days)} วัน</p>
                        )}
                        {inv.status !== 'PAID' && days !== null && days >= 0 && days <= 7 && (
                          <p className="text-xs text-orange-600">อีก {days} วัน</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold">{formatCurrency(inv.totalAmount)}</td>
                    <td className="table-cell text-right text-sm text-green-600 hidden md:table-cell">
                      {inv.paidAmount > 0 ? formatCurrency(inv.paidAmount) : '-'}
                    </td>
                    <td className="table-cell text-right font-bold text-red-600">
                      {outstanding > 0 ? formatCurrency(outstanding) : '✓'}
                    </td>
                    <td className="table-cell text-center">
                      <Badge label={INVOICE_STATUS_LABELS[inv.status]} colorClass={INVOICE_STATUS_COLORS[inv.status]} />
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-1">
                        {inv.status !== 'PAID' && (
                          <button
                            onClick={() => { setSelectedInvoice(inv.id); setShowPayModal(true) }}
                            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            รับเงิน
                          </button>
                        )}
                        <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                          ดูบิล
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700">รวมทั้งหมด</td>
                <td className="px-4 py-3 text-right text-sm font-bold">
                  {formatCurrency(filtered.reduce((s, i) => s + i.totalAmount, 0))}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-green-600 hidden md:table-cell">
                  {formatCurrency(filtered.reduce((s, i) => s + i.paidAmount, 0))}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-red-600">
                  {formatCurrency(filtered.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0))}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="บันทึกการรับชำระเงิน"
        size="sm"
        footer={
          <>
            <button onClick={() => setShowPayModal(false)} className="btn-secondary">ยกเลิก</button>
            <button className="btn-success">บันทึกการรับเงิน</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">วันที่รับชำระ <span className="text-red-500">*</span></label>
            <input type="date" className="form-input" />
          </div>
          <div>
            <label className="form-label">จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
            <input type="number" className="form-input" placeholder="0.00" />
          </div>
          <div>
            <label className="form-label">วิธีชำระเงิน</label>
            <select className="form-select">
              <option value="CASH">เงินสด</option>
              <option value="TRANSFER">โอนเงิน</option>
              <option value="CHEQUE">เช็ค</option>
              <option value="CREDIT_CARD">บัตรเครดิต</option>
            </select>
          </div>
          <div>
            <label className="form-label">เลขอ้างอิง</label>
            <input className="form-input" placeholder="เลขอ้างอิง/เลขเช็ค" />
          </div>
          <div>
            <label className="form-label">หมายเหตุ</label>
            <textarea className="form-input resize-none" rows={2} placeholder="หมายเหตุ..." />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
