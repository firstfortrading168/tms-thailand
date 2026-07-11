'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Wrench, AlertTriangle, CalendarClock } from 'lucide-react'
import { formatCurrency, formatThaiDate, daysUntil } from '@/lib/utils'
import { MAINTENANCE_TYPE_LABELS } from '@/lib/constants'

const mockMaintenance = [
  {
    id: '1', maintenanceDate: '2024-06-10', truck: 'จฉ-9012', type: 'BRAKE',
    description: 'เปลี่ยนผ้าเบรกหน้า-หลัง', cost: 12500, garage: 'อู่ช่างสมชัย',
    odometer: 185000, nextOdometer: 210000, nextDate: '2024-12-10',
  },
  {
    id: '2', maintenanceDate: '2024-06-05', truck: 'กข-1234', type: 'OIL_CHANGE',
    description: 'เปลี่ยนน้ำมันเครื่อง + กรองน้ำมัน', cost: 3200, garage: 'ศูนย์บริการ HINO',
    odometer: 124500, nextOdometer: 139500, nextDate: '2024-09-05',
  },
  {
    id: '3', maintenanceDate: '2024-05-28', truck: 'คง-5678', type: 'TIRE_CHANGE',
    description: 'เปลี่ยนยาง 2 เส้น (หน้าซ้าย-ขวา)', cost: 18000, garage: 'ร้านยาง เจริญมิตร',
    odometer: 97000, nextOdometer: 147000, nextDate: '2025-05-28',
  },
  {
    id: '4', maintenanceDate: '2024-05-15', truck: 'ชซ-3456', type: 'ENGINE',
    description: 'ซ่อมหัวฉีดน้ำมัน 4 หัว', cost: 45000, garage: 'ศูนย์บริการ SCANIA',
    odometer: 200000, nextOdometer: null, nextDate: null,
  },
]

// รถที่ถึงเวลาซ่อมบำรุง
const upcomingMaintenance = [
  { truck: 'กข-1234', type: 'เปลี่ยนน้ำมันเครื่อง', nextDate: '2024-09-05', daysLeft: 83 },
  { truck: 'คง-5678', type: 'ตรวจสภาพประจำปี', nextDate: '2024-08-31', daysLeft: 78 },
  { truck: 'ฌญ-7890', type: 'เปลี่ยนยาง', nextDate: '2024-07-15', daysLeft: 31 },
]

export default function MaintenancePage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [typeFilter, setTypeFilter] = useState('ALL')

  const totalCost = mockMaintenance.reduce((s, m) => s + m.cost, 0)

  const filtered = mockMaintenance.filter((m) => {
    const matchType = typeFilter === 'ALL' || m.type === typeFilter
    const matchSearch = search === '' ||
      m.truck.includes(search) ||
      m.description.includes(search) ||
      m.garage.includes(search)
    return matchType && matchSearch
  })

  return (
    <AppShell title="ซ่อมบำรุง" subtitle="ประวัติการซ่อมและแจ้งเตือนการบำรุงรักษา" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* Upcoming Maintenance Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock size={16} className="text-blue-600" />
          <p className="text-sm font-medium text-blue-800">กำหนดซ่อมบำรุงที่กำลังมาถึง</p>
        </div>
        <div className="space-y-2">
          {upcomingMaintenance.map((u, i) => (
            <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-sm">{u.truck}</span>
                <span className="text-sm text-gray-600">{u.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{formatThaiDate(u.nextDate)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.daysLeft <= 30 ? 'bg-red-100 text-red-700' :
                  u.daysLeft <= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  อีก {u.daysLeft} วัน
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border p-4">
          <Wrench size={18} className="text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">ครั้งที่ซ่อม (เดือนนี้)</p>
          <p className="text-2xl font-bold">{mockMaintenance.length}</p>
          <p className="text-xs text-gray-400">ครั้ง</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <Wrench size={18} className="text-red-600 mb-2" />
          <p className="text-xs text-gray-500">ค่าซ่อมรวม</p>
          <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <AlertTriangle size={18} className="text-orange-600 mb-2" />
          <p className="text-xs text-gray-500">รถซ่อมอยู่</p>
          <p className="text-2xl font-bold text-orange-600">1</p>
          <p className="text-xs text-gray-400">คัน</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <CalendarClock size={18} className="text-purple-600 mb-2" />
          <p className="text-xs text-gray-500">นัดซ่อมที่กำลังมา</p>
          <p className="text-2xl font-bold text-purple-600">{upcomingMaintenance.length}</p>
          <p className="text-xs text-gray-400">รายการ</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาทะเบียน, รายการซ่อม, อู่..."
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
          {Object.entries(MAINTENANCE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary whitespace-nowrap">
          <Plus size={16} />
          บันทึกการซ่อม
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">วันที่ซ่อม</th>
                <th className="table-header">รถ</th>
                <th className="table-header">ประเภท</th>
                <th className="table-header hidden md:table-cell">รายการซ่อม</th>
                <th className="table-header hidden lg:table-cell">อู่</th>
                <th className="table-header text-right">ค่าใช้จ่าย</th>
                <th className="table-header hidden md:table-cell text-right">เลขไมล์</th>
                <th className="table-header hidden lg:table-cell">ซ่อมครั้งถัดไป</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="table-cell text-sm">{formatThaiDate(m.maintenanceDate)}</td>
                  <td className="table-cell font-mono font-semibold text-sm">{m.truck}</td>
                  <td className="table-cell">
                    <span className="badge bg-blue-100 text-blue-700 text-xs">
                      {MAINTENANCE_TYPE_LABELS[m.type]}
                    </span>
                  </td>
                  <td className="table-cell hidden md:table-cell text-sm text-gray-700">{m.description}</td>
                  <td className="table-cell hidden lg:table-cell text-sm text-gray-500">{m.garage}</td>
                  <td className="table-cell text-right font-semibold text-gray-900">{formatCurrency(m.cost)}</td>
                  <td className="table-cell hidden md:table-cell text-right text-sm text-gray-500">
                    {m.odometer.toLocaleString()}
                  </td>
                  <td className="table-cell hidden lg:table-cell text-sm">
                    {m.nextDate ? (
                      <div>
                        <p>{formatThaiDate(m.nextDate)}</p>
                        {m.nextOdometer && <p className="text-xs text-gray-400">หรือ {m.nextOdometer.toLocaleString()} กม.</p>}
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="บันทึกการซ่อมบำรุง"
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
            <label className="form-label">วันที่ซ่อม <span className="text-red-500">*</span></label>
            <input type="date" className="form-input" />
          </div>
          <div>
            <label className="form-label">ทะเบียนรถ <span className="text-red-500">*</span></label>
            <select className="form-select">
              <option value="">-- เลือกรถ --</option>
              <option>กข-1234</option>
              <option>คง-5678</option>
              <option>จฉ-9012</option>
            </select>
          </div>
          <div>
            <label className="form-label">ประเภทการซ่อม <span className="text-red-500">*</span></label>
            <select className="form-select">
              <option value="">-- เลือกประเภท --</option>
              {Object.entries(MAINTENANCE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">อู่ซ่อม</label>
            <input className="form-input" placeholder="ชื่ออู่/ศูนย์บริการ" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">รายการซ่อม <span className="text-red-500">*</span></label>
            <textarea className="form-input resize-none" rows={3} placeholder="รายละเอียดรายการซ่อม..." />
          </div>
          <div>
            <label className="form-label">ค่าใช้จ่าย (บาท) <span className="text-red-500">*</span></label>
            <input type="number" className="form-input" placeholder="0.00" />
          </div>
          <div>
            <label className="form-label">เลขไมล์ที่ซ่อม (กม.)</label>
            <input type="number" className="form-input" placeholder="0" />
          </div>
          <div>
            <label className="form-label">วันนัดซ่อมครั้งถัดไป</label>
            <input type="date" className="form-input" />
          </div>
          <div>
            <label className="form-label">เลขไมล์ครั้งถัดไป (กม.)</label>
            <input type="number" className="form-input" placeholder="0" />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
