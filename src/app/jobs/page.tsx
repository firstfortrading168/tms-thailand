'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Filter, FileText, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency, formatThaiDate } from '@/lib/utils'
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from '@/lib/constants'
import { addDays, format } from 'date-fns'
import { th } from 'date-fns/locale'

const mockJobs = [
  {
    id: '1', jobNo: 'JOB-2568-0042', receivedDate: '2024-06-14', deliveryDate: '2024-06-15',
    customer: 'บริษัท ไทยฟู้ด จำกัด', originAddress: '123 ถ.สุขุมวิท กรุงเทพฯ',
    destAddress: '456 ถ.มิตรภาพ ขอนแก่น', cargoType: 'อาหารแห้ง', cargoWeight: '15,000',
    price: 25000, truck: 'กข-1234', driver: 'สมพงษ์ ขับดี', status: 'IN_TRANSIT',
  },
  {
    id: '2', jobNo: 'JOB-2568-0041', receivedDate: '2024-06-13', deliveryDate: '2024-06-14',
    customer: 'บริษัท โชคดี อินดัสตรี้', originAddress: '789 ถ.พระราม 9 กรุงเทพฯ',
    destAddress: '101 ถ.นิมมานเหมินท์ เชียงใหม่', cargoType: 'อุปกรณ์อิเล็กทรอนิกส์', cargoWeight: '8,500',
    price: 38000, truck: 'คง-5678', driver: 'วิรัตน์ ปลอดภัย', status: 'DELIVERED',
  },
  {
    id: '3', jobNo: 'JOB-2568-0040', receivedDate: '2024-06-12', deliveryDate: null,
    customer: 'ห้างหุ้นส่วนจำกัด สินค้าไทย', originAddress: '222 ถ.สุขุมวิท ชลบุรี',
    destAddress: '333 ถ.รัชดาภิเษก กรุงเทพฯ', cargoType: 'ชิ้นส่วนยานยนต์', cargoWeight: '20,000',
    price: 15000, truck: 'จฉ-9012', driver: 'ประเสริฐ วิ่งเก่ง', status: 'INVOICED',
  },
  {
    id: '4', jobNo: 'JOB-2568-0039', receivedDate: '2024-06-11', deliveryDate: '2024-06-13',
    customer: 'บริษัท ไทยฟู้ด จำกัด', originAddress: '123 ถ.สุขุมวิท กรุงเทพฯ',
    destAddress: '444 ถ.ดอนนก สุราษฎร์ธานี', cargoType: 'อาหารแห้ง', cargoWeight: '18,000',
    price: 42000, truck: 'ชซ-3456', driver: 'สมบัติ ขับเก่ง', status: 'PAID',
  },
  {
    id: '5', jobNo: 'JOB-2568-0038', receivedDate: '2024-06-14', deliveryDate: null,
    customer: 'บริษัท ขนส่งไทย จำกัด', originAddress: '555 ถ.มิตรภาพ นครราชสีมา',
    destAddress: '666 ถ.สุขุมวิท กรุงเทพฯ', cargoType: 'เฟอร์นิเจอร์', cargoWeight: '10,000',
    price: 18000, truck: '-', driver: '-', status: 'WAITING_TRUCK',
  },
]

const statusFilters = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอรับงาน' },
  { value: 'WAITING_TRUCK', label: 'รอจัดรถ' },
  { value: 'IN_TRANSIT', label: 'กำลังขนส่ง' },
  { value: 'DELIVERED', label: 'ส่งงานแล้ว' },
  { value: 'INVOICED', label: 'วางบิลแล้ว' },
  { value: 'PAID', label: 'รับเงินแล้ว' },
]

// ข้อมูลตารางรถ 30 วัน
const trucks = ['กข-1234', 'คง-5678', 'จฉ-9012', 'ชซ-3456', 'ฌญ-7890']

const scheduleData: Record<string, Record<string, { type: string; from?: string; to?: string; garage?: string } | null>> = {
  'กข-1234': {
    '2024-06-14': { type: 'job', from: 'กรุงเทพฯ', to: 'ขอนแก่น' },
    '2024-06-15': { type: 'job', from: 'ชลบุรี', to: 'กรุงเทพฯ' },
    '2024-06-16': null,
    '2024-06-17': { type: 'maintenance', garage: 'ช่างสมชัย' },
    '2024-06-18': { type: 'job', from: 'กรุงเทพฯ', to: 'เชียงใหม่' },
    '2024-06-19': { type: 'job', from: 'ขอนแก่น', to: 'กรุงเทพฯ' },
    '2024-06-20': null,
  },
  'คง-5678': {
    '2024-06-14': { type: 'maintenance', garage: 'ศูนย์บริการ ISUZU' },
    '2024-06-15': { type: 'maintenance', garage: 'ศูนย์บริการ ISUZU' },
    '2024-06-16': { type: 'job', from: 'ชลบุรี', to: 'ระยอง' },
    '2024-06-17': { type: 'job', from: 'เชียงใหม่', to: 'กรุงเทพฯ' },
    '2024-06-18': null,
    '2024-06-19': { type: 'job', from: 'นนทบุรี', to: 'สมุทรปราการ' },
  },
  'จฉ-9012': {
    '2024-06-14': { type: 'job', from: 'กรุงเทพฯ', to: 'สุราษฎร์ธานี' },
    '2024-06-15': { type: 'job', from: 'สุราษฎร์ธานี', to: 'กรุงเทพฯ' },
    '2024-06-16': null,
    '2024-06-17': null,
    '2024-06-18': { type: 'job', from: 'พัทยา', to: 'ชลบุรี' },
  },
  'ชซ-3456': {
    '2024-06-14': null,
    '2024-06-15': { type: 'job', from: 'กรุงเทพฯ', to: 'หัวหิน' },
    '2024-06-16': { type: 'job', from: 'ราชบุรี', to: 'ปราจีนบุรี' },
    '2024-06-17': { type: 'job', from: 'นครปฐม', to: 'กรุงเทพฯ' },
    '2024-06-18': { type: 'maintenance', garage: 'ศูนย์บริการ SCANIA' },
  },
  'ฌญ-7890': {
    '2024-06-14': { type: 'job', from: 'กรุงเทพฯ', to: 'อยุธยา' },
    '2024-06-15': null,
    '2024-06-16': null,
    '2024-06-17': { type: 'job', from: 'สมุทรปราการ', to: 'นนทบุรี' },
    '2024-06-18': { type: 'job', from: 'กาญจนบุรี', to: 'กรุงเทพฯ' },
  },
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [scheduleStartDay, setScheduleStartDay] = useState(0)

  const filtered = mockJobs.filter((j) => {
    const matchStatus = statusFilter === 'ALL' || j.status === statusFilter
    const matchSearch = search === '' ||
      j.jobNo.includes(search) ||
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.truck.includes(search)
    return matchStatus && matchSearch
  })

  // สร้างวันที่สำหรับตารางตั้งแต่วันนี้ + 30 วัน
  const baseDate = new Date('2024-06-14')
  const scheduleDays = Array.from({ length: 30 }, (_, i) =>
    addDays(baseDate, i + scheduleStartDay)
  )

  return (
    <AppShell title="จัดการงานขนส่ง" subtitle="บันทึกและติดตามงานขนส่งทั้งหมด" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขที่งาน, ลูกค้า, ทะเบียนรถ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Plus size={16} />
            เพิ่มงานใหม่
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">เลขที่งาน</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">ลูกค้า</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">เส้นทาง</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">ประเภท</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">รถ</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">สถานะ</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">ราคา (บาท)</th>
                  <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => { setSelectedJob(job); setModalMode('edit'); setShowModal(true) }}>{job.jobNo}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-700">{job.customer}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{job.originAddress} → {job.destAddress}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{job.cargoType}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm font-mono text-gray-700">{job.truck}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${JOB_STATUS_COLORS[job.status]}`}>
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(job.price)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setSelectedJob(job); setModalMode('view'); setShowModal(true) }}
                          title="ดูรายละเอียด"
                          className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() => { setSelectedJob(job); setModalMode('edit'); setShowModal(true) }}
                          title="แก้ไข"
                          className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => { setSelectedJob(job); setShowDeleteConfirm(true) }}
                          title="ลบ"
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            แสดง {filtered.length} รายการ
          </div>
        </div>

        {/* 30-Day Schedule */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">ตาราง {scheduleDays.length} วันข้างหน้า</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScheduleStartDay(Math.max(0, scheduleStartDay - 7))}
                disabled={scheduleStartDay === 0}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-600 w-32 text-center">
                {format(scheduleDays[0], 'd MMM', { locale: th })} - {format(scheduleDays[scheduleDays.length - 1], 'd MMM', { locale: th })}
              </span>
              <button
                onClick={() => setScheduleStartDay(Math.min(30 - 30, scheduleStartDay + 7))}
                disabled={scheduleStartDay >= 30 - 30}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 sticky left-0 bg-gray-50 z-10 min-w-[80px]">รถ / วันที่</th>
                  {scheduleDays.slice(0, 8).map((day, i) => (
                    <th key={i} className="text-center text-[10px] font-semibold text-gray-500 uppercase px-2 py-2 min-w-[90px] whitespace-nowrap">
                      <div className="font-bold text-gray-700">{format(day, 'd', { locale: th })}</div>
                      <div className="text-gray-400">{format(day, 'EEE', { locale: th }).substring(0, 3)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => (
                  <tr key={truck} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="text-left text-xs font-semibold text-gray-900 px-4 py-2 sticky left-0 bg-white z-10 min-w-[80px]">
                      {truck}
                    </td>
                    {scheduleDays.slice(0, 8).map((day, i) => {
                      const dayStr = format(day, 'yyyy-MM-dd')
                      const schedule = scheduleData[truck]?.[dayStr] || null
                      return (
                        <td key={i} className="text-center px-2 py-2 min-w-[90px]">
                          {schedule ? (
                            schedule.type === 'job' ? (
                              <div className="bg-emerald-100 text-emerald-700 px-2 py-1.5 rounded-lg">
                                <div className="text-[10px] font-semibold whitespace-nowrap">
                                  {schedule.from} → {schedule.to}
                                </div>
                              </div>
                            ) : schedule.type === 'maintenance' ? (
                              <div className="bg-orange-100 text-orange-700 px-2 py-1.5 rounded-lg">
                                <div className="text-[10px] font-semibold leading-tight">
                                  ซ่อมอยู่อู่<br />{schedule.garage}
                                </div>
                              </div>
                            ) : null
                          ) : (
                            <span></span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500">
            เลื่อนไปยังวันต่างๆ ด้วยปุ่มลูกศร ↑ เห็นตาราง 8 วัน สามารถเลื่อนดูได้ต่อไป
          </div>
        </div>

      </div>

      {/* Add / View / Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); setSelectedJob(null); setModalMode('view') }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {!selectedJob ? 'เพิ่มงานขนส่งใหม่' : modalMode === 'view' ? `${selectedJob.jobNo} - ดูรายละเอียด` : `${selectedJob.jobNo} - แก้ไข`}
              </h2>
              <button
                onClick={() => { setShowModal(false); setSelectedJob(null); setModalMode('view') }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {selectedJob && (
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${JOB_STATUS_COLORS[selectedJob.status]}`}>
                    {JOB_STATUS_LABELS[selectedJob.status]}
                  </span>
                  <span className="text-sm text-gray-500">{selectedJob.customer}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่งาน</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    value={selectedJob?.jobNo ?? ''}
                    placeholder="ระบบสร้างให้อัตโนมัติ"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่รับงาน *</label>
                  <input
                    type="date"
                    defaultValue={selectedJob?.receivedDate ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ลูกค้า *</label>
                <select
                  defaultValue={selectedJob?.customer ?? ''}
                  disabled={modalMode === 'view'}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">-- เลือกลูกค้า --</option>
                  <option>บริษัท ไทยฟู้ด จำกัด</option>
                  <option>บริษัท โชคดี อินดัสตรี้</option>
                  <option>ห้างหุ้นส่วนจำกัด สินค้าไทย</option>
                  <option>บริษัท ขนส่งไทย จำกัด</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จุดรับสินค้า *</label>
                  <input
                    defaultValue={selectedJob?.originAddress ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="ที่อยู่ต้นทาง"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จุดส่งสินค้า *</label>
                  <input
                    defaultValue={selectedJob?.destAddress ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="ที่อยู่ปลายทาง"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทสินค้า</label>
                  <input
                    defaultValue={selectedJob?.cargoType ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="เช่น อาหารแห้ง"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (กก.)</label>
                  <input
                    type="number"
                    defaultValue={selectedJob?.cargoWeight ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ราคาค่าขนส่ง (บาท) *</label>
                  <input
                    type="number"
                    defaultValue={selectedJob?.price ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รถที่รับงาน</label>
                  <select
                    defaultValue={selectedJob?.truck ?? ''}
                    disabled={modalMode === 'view'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${modalMode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">-- เลือกรถ --</option>
                    <option>กข-1234</option>
                    <option>คง-5678</option>
                    <option>จฉ-9012</option>
                    <option>ชซ-3456</option>
                    <option>ฌญ-7890</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => { setShowModal(false); setSelectedJob(null); setModalMode('view') }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {modalMode === 'view' ? 'ปิด' : 'ยกเลิก'}
              </button>
              {modalMode === 'edit' && (
                <button
                  onClick={() => { setShowModal(false); setSelectedJob(null); setModalMode('view') }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {selectedJob ? 'บันทึกการแก้ไข' : 'บันทึกงาน'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setSelectedJob(null); setModalMode('view') }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-600 mb-1">คุณต้องการลบงานขนส่งนี้หรือไม่?</p>
            <p className="text-sm font-semibold text-gray-800 mb-6">{selectedJob.jobNo} — {selectedJob.customer}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedJob(null); setModalMode('view') }}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedJob(null); setModalMode('view') }}
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
