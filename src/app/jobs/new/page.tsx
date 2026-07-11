'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { ChevronLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const customers = [
  { id: '1', name: 'บริษัท ไทยฟู้ด จำกัด', paymentTerms: 30 },
  { id: '2', name: 'บริษัท โชคดี อินดัสตรี้', paymentTerms: 45 },
  { id: '3', name: 'ห้างหุ้นส่วนจำกัด สินค้าไทย', paymentTerms: 30 },
  { id: '4', name: 'บริษัท ขนส่งไทย จำกัด', paymentTerms: 60 },
]

const trucks = [
  { id: '1', plate: 'กข-1234', type: '10 ล้อ' },
  { id: '2', plate: 'คง-5678', type: '6 ล้อ' },
  { id: '3', plate: 'จฉ-9012', type: '18 ล้อ' },
]

const drivers = [
  { id: '1', name: 'สมพงษ์ ขับดี' },
  { id: '2', name: 'วิรัตน์ ปลอดภัย' },
  { id: '3', name: 'ประเสริฐ วิ่งเก่ง' },
]

export default function NewJobPage() {
  const [customerId, setCustomerId] = useState('')
  const [jobDate, setJobDate] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [cargoType, setCargoType] = useState('')
  const [weight, setWeight] = useState('')
  const [price, setPrice] = useState('')           // ราคารับจากลูกค้า
  const [driverWage, setDriverWage] = useState('') // ค่าแรงคนขับต่อเที่ยว
  const [truckId, setTruckId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [paymentDue, setPaymentDue] = useState('') // กำหนดชำระ (วันที่)
  const [note, setNote] = useState('')

  // Auto-calc due date when customer + date selected
  const handleCustomerChange = (val: string) => {
    setCustomerId(val)
    if (jobDate && val) {
      const cust = customers.find(c => c.id === val)
      if (cust) {
        const d = new Date(jobDate)
        d.setDate(d.getDate() + cust.paymentTerms)
        setPaymentDue(d.toISOString().split('T')[0])
      }
    }
  }
  const handleDateChange = (val: string) => {
    setJobDate(val)
    if (customerId && val) {
      const cust = customers.find(c => c.id === customerId)
      if (cust) {
        const d = new Date(val)
        d.setDate(d.getDate() + cust.paymentTerms)
        setPaymentDue(d.toISOString().split('T')[0])
      }
    }
  }

  const priceNum = parseFloat(price) || 0
  const wageNum = parseFloat(driverWage) || 0
  const grossProfit = priceNum - wageNum

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('บันทึกงานเสร็จแล้ว!')
  }

  return (
    <AppShell title="สร้างงานขนส่งใหม่" subtitle="กรอกรายละเอียดงาน" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="max-w-2xl">
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-5">
          <ChevronLeft size={16} />
          กลับรายการงาน
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section: งาน */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">ข้อมูลงาน</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">ลูกค้า <span className="text-red-500">*</span></label>
                  <select
                    value={customerId}
                    onChange={e => handleCustomerChange(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- เลือกลูกค้า --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {customerId && (
                    <p className="text-xs text-blue-600 mt-1">
                      เครดิต {customers.find(c => c.id === customerId)?.paymentTerms} วัน
                    </p>
                  )}
                </div>
                <div>
                  <label className="form-label">วันที่รับงาน <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={jobDate}
                    onChange={e => handleDateChange(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">จุดรับสินค้า (ต้นทาง) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="form-input"
                    placeholder="จังหวัด / ที่อยู่"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">จุดส่งสินค้า (ปลายทาง) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="form-input"
                    placeholder="จังหวัด / ที่อยู่"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">ประเภทสินค้า</label>
                  <input
                    type="text"
                    value={cargoType}
                    onChange={e => setCargoType(e.target.value)}
                    className="form-input"
                    placeholder="เช่น อาหารแห้ง"
                  />
                </div>
                <div>
                  <label className="form-label">น้ำหนัก (กก.)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: รถและคนขับ */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">รถและคนขับ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">รถที่รับงาน</label>
                <select value={truckId} onChange={e => setTruckId(e.target.value)} className="form-select">
                  <option value="">-- เลือกรถ --</option>
                  {trucks.map(t => (
                    <option key={t.id} value={t.id}>{t.plate} ({t.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">คนขับ</label>
                <select value={driverId} onChange={e => setDriverId(e.target.value)} className="form-select">
                  <option value="">-- เลือกคนขับ --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: การเงิน ← ส่วนสำคัญ */}
          <div className="bg-white rounded-xl border border-blue-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">การเงิน</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    ราคาค่าขนส่ง (รับจากลูกค้า) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="form-input pr-10"
                      placeholder="0.00"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-400">฿</span>
                  </div>
                </div>
                <div>
                  <label className="form-label flex items-center gap-1">
                    ค่าแรงคนขับต่อเที่ยว
                    <span title="จำนวนที่จ่ายให้คนขับสำหรับเที่ยวนี้ ใช้คำนวณ payroll" className="text-gray-400 cursor-help">
                      <Info size={13} />
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={driverWage}
                      onChange={e => setDriverWage(e.target.value)}
                      className="form-input pr-10"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-400">฿</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    กำหนดชำระเงิน
                  </label>
                  <input
                    type="date"
                    value={paymentDue}
                    onChange={e => setPaymentDue(e.target.value)}
                    className="form-input"
                  />
                  <p className="text-xs text-gray-400 mt-1">คำนวณอัตโนมัติจากเครดิตลูกค้า</p>
                </div>
                <div>
                  <label className="form-label">สถานะชำระ</label>
                  <select className="form-select">
                    <option value="PENDING">รอวางบิล</option>
                    <option value="INVOICED">วางบิลแล้ว</option>
                    <option value="PAID">รับเงินแล้ว</option>
                  </select>
                </div>
              </div>

              {/* Summary box */}
              {(priceNum > 0 || wageNum > 0) && (
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">รายรับ</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(priceNum)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ค่าแรงคนขับ</p>
                    <p className="text-lg font-bold text-red-500">{formatCurrency(wageNum)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">กำไรขั้นต้น</p>
                    <p className={`text-lg font-bold ${grossProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(grossProfit)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <label className="form-label">หมายเหตุ</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="form-input resize-none"
              rows={3}
              placeholder="รายละเอียดเพิ่มเติม..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/jobs" className="flex-1 btn-secondary justify-center">
              ยกเลิก
            </Link>
            <button type="submit" className="flex-1 btn-primary justify-center">
              บันทึกงาน
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
