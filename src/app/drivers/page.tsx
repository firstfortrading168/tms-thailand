'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Plus, Search, AlertTriangle, Edit, Phone, Truck } from 'lucide-react'
import { formatThaiDate, daysUntil, getExpiryColor } from '@/lib/utils'
import { DRIVER_STATUS_LABELS, LICENSE_TYPE_LABELS } from '@/lib/constants'

const mockDrivers = [
  {
    id: '1', code: 'D001', firstName: 'สมพงษ์', lastName: 'ขับดี',
    phone: '089-111-1111', licenseNo: '12345678', licenseType: 'TYPE_3',
    licenseExpiry: '2026-06-30', assignedTruck: 'กข-1234', status: 'ACTIVE',
    startDate: '2020-01-01', totalJobs: 248,
  },
  {
    id: '2', code: 'D002', firstName: 'วิรัตน์', lastName: 'ปลอดภัย',
    phone: '089-222-2222', licenseNo: '23456789', licenseType: 'TYPE_4',
    licenseExpiry: '2025-09-15', assignedTruck: 'คง-5678', status: 'ACTIVE',
    startDate: '2018-03-15', totalJobs: 415,
  },
  {
    id: '3', code: 'D003', firstName: 'ประเสริฐ', lastName: 'วิ่งเก่ง',
    phone: '089-333-3333', licenseNo: '34567890', licenseType: 'TYPE_3',
    licenseExpiry: '2027-03-20', assignedTruck: 'จฉ-9012', status: 'ACTIVE',
    startDate: '2021-07-01', totalJobs: 183,
  },
  {
    id: '4', code: 'D004', firstName: 'สมบัติ', lastName: 'ขับเก่ง',
    phone: '089-444-4444', licenseNo: '45678901', licenseType: 'TYPE_4',
    licenseExpiry: '2025-07-10', assignedTruck: 'ชซ-3456', status: 'ACTIVE',
    startDate: '2019-05-20', totalJobs: 322,
  },
  {
    id: '5', code: 'D005', firstName: 'มานะ', lastName: 'ใจดี',
    phone: '089-555-5555', licenseNo: '56789012', licenseType: 'TYPE_3',
    licenseExpiry: '2026-11-25', assignedTruck: '-', status: 'ON_LEAVE',
    startDate: '2022-02-14', totalJobs: 97,
  },
]

const DRIVER_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_LEAVE: 'bg-yellow-100 text-yellow-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
}

export default function DriversPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockDrivers.filter((d) =>
    search === '' ||
    `${d.firstName} ${d.lastName}`.includes(search) ||
    d.code.includes(search) ||
    d.phone.includes(search) ||
    d.assignedTruck.includes(search)
  )

  const licenseWarnings = mockDrivers.filter((d) => {
    const days = daysUntil(d.licenseExpiry)
    return days !== null && days <= 60
  })

  return (
    <AppShell title="จัดการคนขับรถ" subtitle={`คนขับทั้งหมด ${mockDrivers.length} คน`} userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* License Warnings */}
      {licenseWarnings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-orange-600" />
            <p className="text-sm font-medium text-orange-800">ใบขับขี่ใกล้หมดอายุ</p>
          </div>
          {licenseWarnings.map((d) => {
            const days = daysUntil(d.licenseExpiry)
            return (
              <p key={d.id} className="text-xs text-orange-700">
                <strong>{d.firstName} {d.lastName}</strong> — หมดอายุ {formatThaiDate(d.licenseExpiry)} (อีก {days} วัน)
              </p>
            )
          })}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัส, เบอร์โทร, ทะเบียนรถ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary whitespace-nowrap">
          <Plus size={16} />
          เพิ่มคนขับ
        </button>
      </div>

      {/* Cards Grid (mobile) / Table (desktop) */}
      <div className="md:hidden space-y-3">
        {filtered.map((driver) => {
          const days = daysUntil(driver.licenseExpiry)
          return (
            <div key={driver.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{driver.firstName} {driver.lastName}</p>
                  <p className="text-xs text-gray-400">{driver.code}</p>
                </div>
                <Badge label={DRIVER_STATUS_LABELS[driver.status]} colorClass={DRIVER_STATUS_COLORS[driver.status]} />
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={13} /><span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck size={13} /><span>{driver.assignedTruck || 'ยังไม่ได้รับมอบหมาย'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">ใบขับขี่:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getExpiryColor(days)}`}>
                    {formatThaiDate(driver.licenseExpiry)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">รหัส / ชื่อ</th>
                <th className="table-header">เบอร์โทร</th>
                <th className="table-header">ประเภทใบขับขี่</th>
                <th className="table-header">วันหมดอายุใบขับขี่</th>
                <th className="table-header">รถประจำ</th>
                <th className="table-header">งานทั้งหมด</th>
                <th className="table-header">สถานะ</th>
                <th className="table-header text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((driver) => {
                const days = daysUntil(driver.licenseExpiry)
                return (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <p className="font-medium text-gray-900">{driver.firstName} {driver.lastName}</p>
                      <p className="text-xs text-gray-400">{driver.code} · เริ่มงาน {formatThaiDate(driver.startDate)}</p>
                    </td>
                    <td className="table-cell text-sm">{driver.phone}</td>
                    <td className="table-cell text-sm">{LICENSE_TYPE_LABELS[driver.licenseType]}</td>
                    <td className="table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExpiryColor(days)}`}>
                        {formatThaiDate(driver.licenseExpiry)}
                        {days !== null && days <= 60 && <span className="ml-1">(อีก {days} ว.)</span>}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-sm">{driver.assignedTruck}</span>
                    </td>
                    <td className="table-cell text-sm font-medium">{driver.totalJobs} เที่ยว</td>
                    <td className="table-cell">
                      <Badge label={DRIVER_STATUS_LABELS[driver.status]} colorClass={DRIVER_STATUS_COLORS[driver.status]} />
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><Edit size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="เพิ่มคนขับรถใหม่"
        size="lg"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">ยกเลิก</button>
            <button className="btn-primary">บันทึก</button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">ชื่อ <span className="text-red-500">*</span></label>
            <input className="form-input" placeholder="ชื่อ" />
          </div>
          <div>
            <label className="form-label">นามสกุล <span className="text-red-500">*</span></label>
            <input className="form-input" placeholder="นามสกุล" />
          </div>
          <div>
            <label className="form-label">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
            <input type="tel" className="form-input" placeholder="0xx-xxx-xxxx" />
          </div>
          <div>
            <label className="form-label">เบอร์ฉุกเฉิน</label>
            <input type="tel" className="form-input" placeholder="0xx-xxx-xxxx" />
          </div>
          <div>
            <label className="form-label">เลขบัตรประชาชน <span className="text-red-500">*</span></label>
            <input className="form-input" placeholder="1-XXXX-XXXXX-XX-X" maxLength={13} />
          </div>
          <div>
            <label className="form-label">เลขใบขับขี่ <span className="text-red-500">*</span></label>
            <input className="form-input" placeholder="เลขใบขับขี่" />
          </div>
          <div>
            <label className="form-label">ประเภทใบขับขี่ <span className="text-red-500">*</span></label>
            <select className="form-select">
              <option value="">-- เลือกประเภท --</option>
              {Object.entries(LICENSE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">วันหมดอายุใบขับขี่ <span className="text-red-500">*</span></label>
            <input type="date" className="form-input" />
          </div>
          <div>
            <label className="form-label">รถประจำ</label>
            <select className="form-select">
              <option value="">-- เลือกรถ --</option>
              <option>กข-1234</option>
              <option>คง-5678</option>
              <option>จฉ-9012</option>
            </select>
          </div>
          <div>
            <label className="form-label">เงินเดือน (บาท)</label>
            <input type="number" className="form-input" placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">ที่อยู่</label>
            <textarea className="form-input resize-none" rows={2} placeholder="ที่อยู่..." />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
