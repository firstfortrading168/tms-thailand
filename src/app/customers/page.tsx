'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Search, Plus, Phone, Building2, FileText, Edit2, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const mockCustomers = [
  {
    id: '1',
    code: 'C001',
    name: 'บริษัท ไทยฟู้ด จำกัด',
    taxId: '0105560123456',
    phone: '02-123-4567',
    contact: 'คุณสมศักดิ์ ใจดี',
    address: '123 ถ.รัชดา เขตห้วยขวาง กรุงเทพฯ',
    paymentTerms: 30,
    creditLimit: 500000,
    outstanding: 128400,
    totalJobs: 24,
  },
  {
    id: '2',
    code: 'C002',
    name: 'บริษัท โชคดี อินดัสตรี้',
    taxId: '0105550234567',
    phone: '038-456-7890',
    contact: 'คุณมาลี รักงาน',
    address: '456 ถ.สุขุมวิท อ.เมือง ชลบุรี',
    paymentTerms: 45,
    creditLimit: 300000,
    outstanding: 45950,
    totalJobs: 18,
  },
  {
    id: '3',
    code: 'C003',
    name: 'ห้างหุ้นส่วนจำกัด สินค้าไทย',
    taxId: '0103540345678',
    phone: '02-789-0123',
    contact: 'คุณวิเชียร พาณิชย์',
    address: '789 ถ.พระราม 4 เขตสาทร กรุงเทพฯ',
    paymentTerms: 30,
    creditLimit: 200000,
    outstanding: 44940,
    totalJobs: 9,
  },
  {
    id: '4',
    code: 'C004',
    name: 'บริษัท ขนส่งไทย จำกัด',
    taxId: '0105530456789',
    phone: '02-234-5678',
    contact: 'คุณประยุทธ ส่งดี',
    address: '321 ถ.วิภาวดี เขตจตุจักร กรุงเทพฯ',
    paymentTerms: 60,
    creditLimit: 1000000,
    outstanding: 0,
    totalJobs: 42,
  },
]

const emptyForm = {
  name: '', taxId: '', phone: '', contact: '', address: '',
  paymentTerms: '30', creditLimit: '', note: '',
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [viewCustomer, setViewCustomer] = useState<typeof mockCustomers[0] | null>(null)

  const filtered = mockCustomers.filter(c =>
    c.name.includes(search) || c.phone.includes(search) || c.contact.includes(search) || c.code.includes(search)
  )

  const totalOutstanding = mockCustomers.reduce((s, c) => s + c.outstanding, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('บันทึกลูกค้าแล้ว! (ตัวอย่าง)')
    setShowModal(false)
    setForm(emptyForm)
  }

  return (
    <AppShell title="ลูกค้า" subtitle="จัดการข้อมูลลูกค้าและเครดิต" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">ลูกค้าทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-900">{mockCustomers.length}</p>
          <p className="text-xs text-gray-400">ราย</p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-4">
          <p className="text-xs text-gray-500 mb-1">ยอดค้างชำระรวม</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">ลูกค้ามียอดค้าง</p>
          <p className="text-2xl font-bold text-orange-500">{mockCustomers.filter(c => c.outstanding > 0).length}</p>
          <p className="text-xs text-gray-400">ราย</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">งานทั้งหมด</p>
          <p className="text-2xl font-bold text-blue-600">{mockCustomers.reduce((s, c) => s + c.totalJobs, 0)}</p>
          <p className="text-xs text-gray-400">เที่ยว</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เบอร์โทร, ผู้ติดต่อ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          เพิ่มลูกค้า
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">รหัส / ชื่อลูกค้า</th>
                <th className="table-header hidden md:table-cell">ผู้ติดต่อ</th>
                <th className="table-header hidden lg:table-cell">เบอร์โทร</th>
                <th className="table-header text-center hidden md:table-cell">เครดิต (วัน)</th>
                <th className="table-header text-right hidden lg:table-cell">วงเงินเครดิต</th>
                <th className="table-header text-right">ยอดค้างชำระ</th>
                <th className="table-header text-center hidden md:table-cell">เที่ยวทั้งหมด</th>
                <th className="table-header text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewCustomer(c)}>
                  <td className="table-cell">
                    <p className="text-xs text-gray-400">{c.code}</p>
                    <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">{c.taxId ? `เลขภาษี: ${c.taxId}` : ''}</p>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <p className="text-sm">{c.contact}</p>
                  </td>
                  <td className="table-cell hidden lg:table-cell text-sm text-gray-600">{c.phone}</td>
                  <td className="table-cell text-center hidden md:table-cell">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {c.paymentTerms} วัน
                    </span>
                  </td>
                  <td className="table-cell text-right hidden lg:table-cell text-sm">{formatCurrency(c.creditLimit)}</td>
                  <td className="table-cell text-right">
                    {c.outstanding > 0 ? (
                      <span className="font-bold text-red-600 text-sm">{formatCurrency(c.outstanding)}</span>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">✓ ไม่มีหนี้</span>
                    )}
                  </td>
                  <td className="table-cell text-center hidden md:table-cell">
                    <span className="text-sm text-gray-600">{c.totalJobs} เที่ยว</span>
                  </td>
                  <td className="table-cell text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewCustomer(c)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">เพิ่มลูกค้าใหม่</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="form-label">ชื่อบริษัท / ร้านค้า <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="form-input"
                  placeholder="เช่น บริษัท ไทยฟู้ด จำกัด"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">เลขผู้เสียภาษี</label>
                  <input
                    value={form.taxId}
                    onChange={e => setForm({...form, taxId: e.target.value})}
                    className="form-input"
                    placeholder="13 หลัก"
                  />
                </div>
                <div>
                  <label className="form-label">เบอร์โทร <span className="text-red-500">*</span></label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="form-input"
                    placeholder="02-xxx-xxxx"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">ชื่อผู้ติดต่อ</label>
                <input
                  value={form.contact}
                  onChange={e => setForm({...form, contact: e.target.value})}
                  className="form-input"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
              <div>
                <label className="form-label">ที่อยู่</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="form-input resize-none"
                  rows={2}
                  placeholder="ที่อยู่สำหรับออกใบแจ้งหนี้"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">เครดิต (วัน)</label>
                  <select
                    value={form.paymentTerms}
                    onChange={e => setForm({...form, paymentTerms: e.target.value})}
                    className="form-select"
                  >
                    <option value="0">เงินสด (0 วัน)</option>
                    <option value="7">7 วัน</option>
                    <option value="15">15 วัน</option>
                    <option value="30">30 วัน</option>
                    <option value="45">45 วัน</option>
                    <option value="60">60 วัน</option>
                    <option value="90">90 วัน</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">วงเงินเครดิต (บาท)</label>
                  <input
                    type="number"
                    value={form.creditLimit}
                    onChange={e => setForm({...form, creditLimit: e.target.value})}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">หมายเหตุ</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm({...form, note: e.target.value})}
                  className="form-input resize-none"
                  rows={2}
                  placeholder="หมายเหตุเพิ่มเติม..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary justify-center">
                  ยกเลิก
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Detail Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewCustomer(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400">{viewCustomer.code}</p>
                <h2 className="text-base font-semibold text-gray-900">{viewCustomer.name}</h2>
              </div>
              <button onClick={() => setViewCustomer(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">ยอดค้างชำระ</p>
                  <p className={`text-xl font-bold ${viewCustomer.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {viewCustomer.outstanding > 0 ? formatCurrency(viewCustomer.outstanding) : 'ไม่มีหนี้ ✓'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">งานทั้งหมด</p>
                  <p className="text-xl font-bold text-blue-600">{viewCustomer.totalJobs} เที่ยว</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {viewCustomer.phone} ({viewCustomer.contact})
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Building2 size={14} className="text-gray-400 mt-0.5" />
                  {viewCustomer.address}
                </div>
                {viewCustomer.taxId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText size={14} className="text-gray-400" />
                    เลขภาษี: {viewCustomer.taxId}
                  </div>
                )}
              </div>
              <div className="flex gap-2 text-sm mt-2">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  เครดิต {viewCustomer.paymentTerms} วัน
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  วงเงิน {formatCurrency(viewCustomer.creditLimit)}
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 btn-secondary justify-center text-sm">ดูงานทั้งหมด</button>
                <button className="flex-1 btn-secondary justify-center text-sm">ดูบิลค้างชำระ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
