'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Fuel, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatThaiDate } from '@/lib/utils'

const mockFuelLogs = [
  { id: '1', logDate: '2024-06-14', truck: 'กข-1234', driver: 'สมพงษ์ ขับดี', liters: 90, amount: 3600, pricePerLit: 40, odometer: 125800, station: 'ปตท. พหลโยธิน' },
  { id: '2', logDate: '2024-06-13', truck: 'คง-5678', driver: 'วิรัตน์ ปลอดภัย', liters: 120, amount: 4800, pricePerLit: 40, odometer: 98200, station: 'บางจาก รังสิต' },
  { id: '3', logDate: '2024-06-12', truck: 'ชซ-3456', driver: 'สมบัติ ขับเก่ง', liters: 150, amount: 6000, pricePerLit: 40, odometer: 201500, station: 'ปตท. บางนา' },
  { id: '4', logDate: '2024-06-11', truck: 'กข-1234', driver: 'สมพงษ์ ขับดี', liters: 85, amount: 3400, pricePerLit: 40, odometer: 125200, station: 'เชลล์ ลาดพร้าว' },
  { id: '5', logDate: '2024-06-11', truck: 'ฌญ-7890', driver: 'มนัส ดี', liters: 200, amount: 8000, pricePerLit: 40, odometer: 55000, station: 'ปตท. สุขุมวิท' },
]

// สรุปข้อมูลน้ำมันแต่ละคัน
const truckFuelSummary = [
  { truck: 'กข-1234', totalLiters: 175, totalAmount: 7000, avgPerKm: 3.2 },
  { truck: 'คง-5678', totalLiters: 120, totalAmount: 4800, avgPerKm: 2.8 },
  { truck: 'ชซ-3456', totalLiters: 150, totalAmount: 6000, avgPerKm: 3.5 },
  { truck: 'ฌญ-7890', totalLiters: 200, totalAmount: 8000, avgPerKm: 4.1 },
]

const totalFuel = mockFuelLogs.reduce((s, l) => s + l.amount, 0)
const totalLiters = mockFuelLogs.reduce((s, l) => s + l.liters, 0)

export default function FuelPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'logs' | 'summary'>('logs')

  const filtered = mockFuelLogs.filter((l) =>
    search === '' ||
    l.truck.includes(search) ||
    l.driver.includes(search) ||
    l.station.includes(search)
  )

  return (
    <AppShell title="ระบบน้ำมัน" subtitle="บันทึกการเติมน้ำมันและวิเคราะห์การใช้น้ำมัน" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <Fuel size={20} className="text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">น้ำมันรวมเดือนนี้</p>
          <p className="text-xl font-bold text-gray-900">{totalLiters.toLocaleString()}</p>
          <p className="text-xs text-gray-400">ลิตร</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <TrendingUp size={20} className="text-green-600 mb-2" />
          <p className="text-xs text-gray-500">ค่าน้ำมันรวม</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalFuel)}</p>
          <p className="text-xs text-gray-400">บาท</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <Fuel size={20} className="text-yellow-600 mb-2" />
          <p className="text-xs text-gray-500">ราคาเฉลี่ย/ลิตร</p>
          <p className="text-xl font-bold text-gray-900">40.00</p>
          <p className="text-xs text-gray-400">บาท/ลิตร</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <AlertTriangle size={20} className="text-orange-600 mb-2" />
          <p className="text-xs text-gray-500">รถที่ใช้น้ำมันสูง</p>
          <p className="text-xl font-bold text-orange-600">ฌญ-7890</p>
          <p className="text-xs text-gray-400">4.1 ลิตร/กม.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          บันทึกการเติมน้ำมัน
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            activeTab === 'summary' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          สรุปตามรถ
        </button>
      </div>

      {activeTab === 'logs' && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาทะเบียน, คนขับ, ปั๊มน้ำมัน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary whitespace-nowrap">
              <Plus size={16} />
              บันทึกเติมน้ำมัน
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">วันที่</th>
                    <th className="table-header">ทะเบียนรถ</th>
                    <th className="table-header hidden md:table-cell">คนขับ</th>
                    <th className="table-header text-right">จำนวน (ลิตร)</th>
                    <th className="table-header text-right">ราคา/ลิตร</th>
                    <th className="table-header text-right">รวม (บาท)</th>
                    <th className="table-header hidden lg:table-cell text-right">เลขไมล์</th>
                    <th className="table-header hidden md:table-cell">ปั๊ม</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="table-cell text-sm">{formatThaiDate(log.logDate)}</td>
                      <td className="table-cell font-mono font-semibold text-sm">{log.truck}</td>
                      <td className="table-cell hidden md:table-cell text-sm">{log.driver}</td>
                      <td className="table-cell text-right font-medium">{log.liters}</td>
                      <td className="table-cell text-right text-sm text-gray-600">{log.pricePerLit.toFixed(2)}</td>
                      <td className="table-cell text-right font-semibold text-gray-900">{formatCurrency(log.amount)}</td>
                      <td className="table-cell hidden lg:table-cell text-right text-sm text-gray-500">
                        {log.odometer.toLocaleString()} กม.
                      </td>
                      <td className="table-cell hidden md:table-cell text-sm text-gray-500">{log.station}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">รวม</td>
                    <td className="px-4 py-3 text-right text-sm font-bold">{totalLiters}</td>
                    <td className="px-4 py-3 text-right text-sm">-</td>
                    <td className="px-4 py-3 text-right text-sm font-bold">{formatCurrency(totalFuel)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'summary' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ทะเบียนรถ</th>
                  <th className="table-header text-right">น้ำมันรวม (ลิตร)</th>
                  <th className="table-header text-right">ค่าน้ำมันรวม (บาท)</th>
                  <th className="table-header text-right">เฉลี่ย (ลิตร/กม.)</th>
                  <th className="table-header text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {truckFuelSummary.map((s) => (
                  <tr key={s.truck} className="hover:bg-gray-50">
                    <td className="table-cell font-mono font-semibold">{s.truck}</td>
                    <td className="table-cell text-right">{s.totalLiters}</td>
                    <td className="table-cell text-right font-semibold">{formatCurrency(s.totalAmount)}</td>
                    <td className="table-cell text-right">{s.avgPerKm}</td>
                    <td className="table-cell text-center">
                      {s.avgPerKm > 3.5 ? (
                        <span className="badge bg-red-100 text-red-700">ใช้สูง</span>
                      ) : s.avgPerKm > 3.0 ? (
                        <span className="badge bg-yellow-100 text-yellow-700">ปานกลาง</span>
                      ) : (
                        <span className="badge bg-green-100 text-green-700">ปกติ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Fuel Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="บันทึกการเติมน้ำมัน"
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">ยกเลิก</button>
            <button className="btn-primary">บันทึก</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">วันที่เติม <span className="text-red-500">*</span></label>
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
            <label className="form-label">จำนวนลิตร <span className="text-red-500">*</span></label>
            <input type="number" className="form-input" placeholder="0" step="0.1" />
          </div>
          <div>
            <label className="form-label">ราคาต่อลิตร (บาท)</label>
            <input type="number" className="form-input" placeholder="40.00" step="0.01" />
          </div>
          <div>
            <label className="form-label">จำนวนเงินรวม (บาท) <span className="text-red-500">*</span></label>
            <input type="number" className="form-input" placeholder="0.00" />
          </div>
          <div>
            <label className="form-label">เลขไมล์ (กม.)</label>
            <input type="number" className="form-input" placeholder="0" />
          </div>
          <div className="col-span-2">
            <label className="form-label">ปั๊มน้ำมัน</label>
            <input className="form-input" placeholder="ชื่อปั๊มน้ำมัน / สถานที่" />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
