'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Plus, Search, AlertTriangle, Edit, Trash2, Info, X } from 'lucide-react'
import { formatThaiDate, daysUntil, getExpiryColor } from '@/lib/utils'
import { TRUCK_TYPE_LABELS, TRUCK_STATUS_LABELS, TRUCK_STATUS_COLORS } from '@/lib/constants'

import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const mockTrucks = [
  {
    id: '1', licensePlate: 'กข-1234', truckType: 'LARGE_TRUCK', brand: 'HINO', model: 'FM8JMSA',
    year: 2020, driver: 'สมพงษ์ ขับดี', status: 'IN_USE',
    taxExpiry: '2026-03-31', actExpiry: '2026-03-31', insuranceExpiry: '2026-04-30',
  },
  {
    id: '2', licensePlate: 'คง-5678', truckType: 'LARGE_TRUCK', brand: 'ISUZU', model: 'FXZ 360',
    year: 2019, driver: 'วิรัตน์ ปลอดภัย', status: 'ACTIVE',
    taxExpiry: '2025-08-31', actExpiry: '2025-08-31', insuranceExpiry: '2025-07-15',
  },
  {
    id: '3', licensePlate: 'จฉ-9012', truckType: 'MEDIUM_TRUCK', brand: 'HINO', model: '500 FC9JLTA',
    year: 2021, driver: 'ประเสริฐ วิ่งเก่ง', status: 'MAINTENANCE',
    taxExpiry: '2026-11-30', actExpiry: '2026-11-30', insuranceExpiry: '2026-12-31',
  },
  {
    id: '4', licensePlate: 'ชซ-3456', truckType: 'TRAILER', brand: 'SCANIA', model: 'R500',
    year: 2018, driver: 'สมบัติ ขับเก่ง', status: 'IN_USE',
    taxExpiry: '2025-12-31', actExpiry: '2025-12-31', insuranceExpiry: '2026-01-31',
  },
  {
    id: '5', licensePlate: 'ฌญ-7890', truckType: 'REFRIGERATOR', brand: 'ISUZU', model: 'FRR 210',
    year: 2022, driver: '-', status: 'ACTIVE',
    taxExpiry: '2027-05-31', actExpiry: '2027-05-31', insuranceExpiry: '2027-06-30',
  },
  {
    id: '6', licensePlate: 'ดต-1111', truckType: 'MEDIUM_TRUCK', brand: 'HINO', model: '300 XZU',
    year: 2020, driver: 'สมศักดิ์ ขับดี', status: 'IN_USE',
    taxExpiry: '2026-06-30', actExpiry: '2026-06-30', insuranceExpiry: '2026-07-31',
  },
  {
    id: '7', licensePlate: 'ถท-2222', truckType: 'LARGE_TRUCK', brand: 'HINO', model: 'FM8JMSA',
    year: 2021, driver: '-', status: 'ACTIVE',
    taxExpiry: '2026-09-30', actExpiry: '2026-09-30', insuranceExpiry: '2026-10-31',
  },
  {
    id: '8', licensePlate: 'นบ-3333', truckType: 'TRAILER', brand: 'VOLVO', model: 'FH500',
    year: 2019, driver: 'วิชัย ขับเก่ง', status: 'MAINTENANCE',
    taxExpiry: '2025-11-30', actExpiry: '2025-11-30', insuranceExpiry: '2025-12-31',
  },
]

const statusTabs = [
  { value: 'ALL',         label: 'ทั้งหมด',    color: 'bg-gray-100 text-gray-700' },
  { value: 'IN_USE',      label: 'ใช้งานอยู่',  color: 'bg-green-100 text-green-700' },
  { value: 'ACTIVE',      label: 'ว่าง',        color: 'bg-gray-200 text-gray-600' },
  { value: 'MAINTENANCE', label: 'ซ่อมบำรุง',   color: 'bg-red-100 text-red-700' },
  { value: 'INACTIVE',    label: 'ไม่ใช้งาน',   color: 'bg-slate-100 text-slate-500' },
]

function TrucksPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedTruck, setSelectedTruck] = useState<typeof mockTrucks[0] | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // รับ status จาก URL เมื่อ page โหลด
  useEffect(() => {
    const s = searchParams.get('status')
    if (s) setStatusFilter(s)
  }, [searchParams])

  const hasFilter = statusFilter !== 'ALL' || search !== ''

  const clearFilters = () => {
    setStatusFilter('ALL')
    setSearch('')
    router.replace('/trucks')
  }

  const handleStatusTab = (val: string) => {
    setStatusFilter(val)
    if (val === 'ALL') {
      router.replace('/trucks')
    } else {
      router.replace(`/trucks?status=${val}`)
    }
  }

  const filtered = mockTrucks.filter((t) => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    const matchSearch = search === '' ||
      t.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      t.brand.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.includes(search)
    return matchStatus && matchSearch
  })

  const expiryWarnings = mockTrucks.filter((t) => {
    const days = [daysUntil(t.taxExpiry), daysUntil(t.actExpiry), daysUntil(t.insuranceExpiry)]
    return days.some(d => d !== null && d <= 30)
  })

  const countByStatus = (s: string) => mockTrucks.filter(t => t.status === s).length

  return (
    <AppShell title="จัดการรถบรรทุก" subtitle={`รถทั้งหมด ${mockTrucks.length} คัน`} userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">

      {/* Expiry Alerts */}
      {expiryWarnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">รถที่เอกสารใกล้หมดอายุ</p>
          </div>
          <div className="space-y-1">
            {expiryWarnings.map((t) => {
              const taxDays = daysUntil(t.taxExpiry)
              const actDays = daysUntil(t.actExpiry)
              const insDays = daysUntil(t.insuranceExpiry)
              return (
                <p key={t.id} className="text-xs text-yellow-700">
                  <strong>{t.licensePlate}</strong>:{' '}
                  {taxDays !== null && taxDays <= 30 && `ภาษีอีก ${taxDays} วัน `}
                  {actDays !== null && actDays <= 30 && `พ.ร.บ.อีก ${actDays} วัน `}
                  {insDays !== null && insDays <= 30 && `ประกันอีก ${insDays} วัน`}
                </p>
              )
            })}
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusTabs.map((tab) => {
          const count = tab.value === 'ALL' ? mockTrucks.length : countByStatus(tab.value)
          const isActive = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => handleStatusTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : tab.color
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search + Clear + Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาทะเบียนรถ, ยี่ห้อ, คนขับ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Clear filter button */}
        {hasFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition-colors whitespace-nowrap"
          >
            <X size={14} />
            ล้าง filter
          </button>
        )}

        <button onClick={() => { setSelectedTruck(null); setModalMode('add'); setShowModal(true) }} className="btn-primary whitespace-nowrap">
          <Plus size={16} />
          เพิ่มรถ
        </button>
      </div>

      {/* Active filter badge */}
      {statusFilter !== 'ALL' && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500">กำลังแสดง:</span>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
            {statusTabs.find(t => t.value === statusFilter)?.label}
            <button onClick={clearFilters} className="hover:text-blue-900">
              <X size={11} />
            </button>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ทะเบียน</th>
                <th className="table-header">ประเภท / ยี่ห้อ</th>
                <th className="table-header hidden md:table-cell">คนขับประจำ</th>
                <th className="table-header hidden lg:table-cell">ภาษี</th>
                <th className="table-header hidden lg:table-cell">พ.ร.บ.</th>
                <th className="table-header hidden lg:table-cell">ประกัน</th>
                <th className="table-header">สถานะ</th>
                <th className="table-header text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    ไม่พบรถที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : filtered.map((truck) => {
                const taxDays = daysUntil(truck.taxExpiry)
                const actDays = daysUntil(truck.actExpiry)
                const insDays = daysUntil(truck.insuranceExpiry)
                return (
                  <tr key={truck.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <p className="font-mono font-semibold text-gray-900">{truck.licensePlate}</p>
                      <p className="text-xs text-gray-400">ปี {truck.year + 543}</p>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm font-medium">{TRUCK_TYPE_LABELS[truck.truckType]}</p>
                      <p className="text-xs text-gray-500">{truck.brand} {truck.model}</p>
                    </td>
                    <td className="table-cell hidden md:table-cell text-sm">{truck.driver}</td>
                    <td className="table-cell hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExpiryColor(taxDays)}`}>
                        {formatThaiDate(truck.taxExpiry)}
                        {taxDays !== null && taxDays <= 60 && <span className="ml-1">({taxDays}ว.)</span>}
                      </span>
                    </td>
                    <td className="table-cell hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExpiryColor(actDays)}`}>
                        {formatThaiDate(truck.actExpiry)}
                        {actDays !== null && actDays <= 60 && <span className="ml-1">({actDays}ว.)</span>}
                      </span>
                    </td>
                    <td className="table-cell hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExpiryColor(insDays)}`}>
                        {formatThaiDate(truck.insuranceExpiry)}
                        {insDays !== null && insDays <= 60 && <span className="ml-1">({insDays}ว.)</span>}
                      </span>
                    </td>
                    <td className="table-cell">
                      <Badge
                        label={TRUCK_STATUS_LABELS[truck.status]}
                        colorClass={TRUCK_STATUS_COLORS[truck.status]}
                      />
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setSelectedTruck(truck); setModalMode('view'); setShowModal(true) }}
                          title="ดูรายละเอียด"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Info size={15} />
                        </button>
                        <button
                          onClick={() => { setSelectedTruck(truck); setModalMode('edit'); setShowModal(true) }}
                          title="แก้ไข"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => { setSelectedTruck(truck); setShowDeleteConfirm(true) }}
                          title="ลบ"
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">แสดง {filtered.length} จาก {mockTrucks.length} คัน</p>
          {hasFilter && (
            <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              แสดงทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Add / View / Edit Truck Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); setSelectedTruck(null); setModalMode('view') }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'เพิ่มรถบรรทุกใหม่' : modalMode === 'view' ? `${selectedTruck?.licensePlate} - ดูรายละเอียด` : `${selectedTruck?.licensePlate} - แก้ไข`}
              </h2>
              <button
                onClick={() => { setShowModal(false); setSelectedTruck(null); setModalMode('view') }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ <span className="text-red-500">*</span></label>
                  <input
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="เช่น กข-1234"
                    defaultValue={selectedTruck?.licensePlate ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทรถ <span className="text-red-500">*</span></label>
                  <select
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    defaultValue={selectedTruck?.truckType ?? ''}
                    disabled={modalMode === 'view'}
                  >
                    <option value="">-- เลือกประเภท --</option>
                    {Object.entries(TRUCK_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อ <span className="text-red-500">*</span></label>
                  <input
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="เช่น HINO, ISUZU"
                    defaultValue={selectedTruck?.brand ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รุ่น</label>
                  <input
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="รุ่นรถ"
                    defaultValue={selectedTruck?.model ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ปีที่ซื้อ (พ.ศ.)</label>
                  <input
                    type="number"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="เช่น 2565"
                    defaultValue={selectedTruck ? selectedTruck.year + 543 : ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">คนขับประจำ</label>
                  <select
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    defaultValue={selectedTruck?.driver ?? ''}
                    disabled={modalMode === 'view'}
                  >
                    <option value="">-- เลือกคนขับ --</option>
                    <option>สมพงษ์ ขับดี</option>
                    <option>วิรัตน์ ปลอดภัย</option>
                    <option>ประเสริฐ วิ่งเก่ง</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันต่อภาษี</label>
                  <input
                    type="date"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    defaultValue={selectedTruck?.taxExpiry ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันต่อ พ.ร.บ.</label>
                  <input
                    type="date"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    defaultValue={selectedTruck?.actExpiry ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันต่อประกัน</label>
                  <input
                    type="date"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    defaultValue={selectedTruck?.insuranceExpiry ?? ''}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => { setShowModal(false); setSelectedTruck(null); setModalMode('view') }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {modalMode === 'view' ? 'ปิด' : 'ยกเลิก'}
              </button>
              {(modalMode === 'edit' || modalMode === 'add') && (
                <button
                  onClick={() => { setShowModal(false); setSelectedTruck(null); setModalMode('view') }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {modalMode === 'add' ? 'บันทึกรถใหม่' : 'บันทึกการแก้ไข'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && selectedTruck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setSelectedTruck(null); setModalMode('view') }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-600 mb-1">คุณต้องการลบรถนี้หรือไม่?</p>
            <p className="text-sm font-semibold text-gray-800 mb-6">{selectedTruck.licensePlate} — {selectedTruck.brand} {selectedTruck.model}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedTruck(null); setModalMode('view') }}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedTruck(null); setModalMode('view') }}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default function TrucksPage() {
  return (
    <Suspense fallback={null}>
      <TrucksPageContent />
    </Suspense>
  )
}
