'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { formatThaiDate, daysUntil } from '@/lib/utils'
import { TRUCK_STATUS_LABELS, TRUCK_STATUS_COLORS } from '@/lib/constants'

interface RenewalRecord {
  id: string
  truckId: string
  licensePlate: string
  brand: string
  model: string
  driver: string
  truckStatus: string
  documentType: 'act' | 'insurance'
  expiryDate: string
  renewedDate?: string
  status: 'pending' | 'renewed'
  createdAt: string
  completedBy?: string
  insuranceCompany?: string
  documentNumber?: string
  notes?: string
}

const mockTrucks = [
  { id: '1', licensePlate: 'กข-1234', brand: 'HINO', model: 'FM8JMSA', year: 2020, driver: 'สมพงษ์ ขับดี', status: 'IN_USE', actExpiry: '2026-03-31', insuranceExpiry: '2026-04-30' },
  { id: '2', licensePlate: 'คง-5678', brand: 'ISUZU', model: 'FXZ 360', year: 2019, driver: 'วิรัตน์ ปลอดภัย', status: 'ACTIVE', actExpiry: '2025-08-31', insuranceExpiry: '2025-07-15' },
  { id: '3', licensePlate: 'จฉ-9012', brand: 'HINO', model: '500 FC9JLTA', year: 2021, driver: 'ประเสริฐ วิ่งเก่ง', status: 'MAINTENANCE', actExpiry: '2026-11-30', insuranceExpiry: '2026-12-31' },
  { id: '4', licensePlate: 'ชซ-3456', brand: 'SCANIA', model: 'R500', year: 2018, driver: 'สมบัติ ขับเก่ง', status: 'IN_USE', actExpiry: '2025-12-31', insuranceExpiry: '2026-01-31' },
  { id: '5', licensePlate: 'ฌญ-7890', brand: 'ISUZU', model: 'FRR 210', year: 2022, driver: '-', status: 'ACTIVE', actExpiry: '2027-05-31', insuranceExpiry: '2027-06-30' },
  { id: '6', licensePlate: 'ดต-1111', brand: 'HINO', model: '300 XZU', year: 2020, driver: 'สมศักดิ์ ขับดี', status: 'IN_USE', actExpiry: '2026-06-30', insuranceExpiry: '2026-07-31' },
  { id: '7', licensePlate: 'ถท-2222', brand: 'HINO', model: 'FM8JMSA', year: 2021, driver: '-', status: 'ACTIVE', actExpiry: '2026-09-30', insuranceExpiry: '2026-10-31' },
  { id: '8', licensePlate: 'นบ-3333', brand: 'VOLVO', model: 'FH500', year: 2019, driver: 'วิชัย ขับเก่ง', status: 'MAINTENANCE', actExpiry: '2025-11-30', insuranceExpiry: '2025-12-31' },
]

const extractPlateNumber = (plate: string) => {
  const match = plate.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

const groupByDateSorted = (renewals: RenewalRecord[]) => {
  const groups: { [key: string]: RenewalRecord[] } = {}
  renewals.forEach(r => {
    if (!groups[r.expiryDate]) groups[r.expiryDate] = []
    groups[r.expiryDate].push(r)
  })
  return Object.entries(groups)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, trucks]) => ({
      date,
      trucks: trucks.sort((a, b) => extractPlateNumber(a.licensePlate) - extractPlateNumber(b.licensePlate))
    }))
}

const PendingWidget = ({ title, renewals, onRenew, colorClass }: { title: string; renewals: RenewalRecord[]; onRenew: (r: RenewalRecord) => void; colorClass: string }) => {
  const groups = groupByDateSorted(renewals)

  return (
    <div className={`${colorClass} rounded-lg border`}>
      <div className="px-5 py-4 border-b border-opacity-30">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-1">{renewals.length} รายการ</p>
      </div>

      <div>
        {groups.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500">
            <p className="text-sm">ไม่มีรายการที่ต้องดำเนินการ</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {groups.map((group) => (
              <div key={group.date}>
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    วันที่ต่อ {formatThaiDate(group.date)}
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.trucks.map((truck) => {
                    const days = daysUntil(truck.expiryDate)
                    return (
                      <div key={truck.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-mono font-bold text-gray-900">{truck.licensePlate}</p>
                              <p className="text-sm text-gray-600">{truck.brand}</p>
                            </div>
                            <p className="text-xs text-gray-500">คนขับ: {truck.driver}</p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {days !== null && (
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{days}</p>
                                <p className="text-xs text-gray-500">วัน</p>
                              </div>
                            )}
                            <Badge label={TRUCK_STATUS_LABELS[truck.truckStatus]} colorClass={TRUCK_STATUS_COLORS[truck.truckStatus]} />
                            <button
                              onClick={() => onRenew(truck)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                            >
                              ต่อ
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const HistoryWidget = ({ title, renewals, filterYear, filterVehicle, searchPlate }: { title: string; renewals: RenewalRecord[]; filterYear: string; filterVehicle: string; searchPlate: string }) => {
  const filtered = renewals.filter(r => {
    if (filterYear && new Date(r.renewedDate || '').getFullYear().toString() !== filterYear) return false
    if (filterVehicle && r.truckId !== filterVehicle) return false
    if (searchPlate && !r.licensePlate.includes(searchPlate)) return false
    return true
  })

  const groups = groupByDateSorted(filtered)

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-1">{filtered.length} รายการ</p>
      </div>

      <div>
        {groups.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500">
            <p className="text-sm">ไม่มีรายการประวัติ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">ป้ายทะเบียน</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">ยี่ห้อ/รุ่น</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">วันที่ต่อ</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">บริษัทประกัน</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">เลขที่เอกสาร</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">ดำเนินการโดย</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-gray-900">{record.licensePlate}</td>
                    <td className="px-5 py-3 text-gray-700">{record.brand} {record.model}</td>
                    <td className="px-5 py-3 text-gray-700">{formatThaiDate(record.renewedDate || '')}</td>
                    <td className="px-5 py-3 text-gray-700">{record.insuranceCompany || '-'}</td>
                    <td className="px-5 py-3 text-gray-700 font-mono text-xs">{record.documentNumber || '-'}</td>
                    <td className="px-5 py-3 text-gray-700">{record.completedBy || '-'}</td>
                    <td className="px-5 py-3 text-gray-700 max-w-xs truncate" title={record.notes}>{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InsurancePage() {
  const [renewals, setRenewals] = useState<RenewalRecord[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [showModal, setShowModal] = useState(false)
  const [selectedRenewal, setSelectedRenewal] = useState<RenewalRecord | null>(null)
  const [renewalDate, setRenewalDate] = useState('')
  const [renewalDetails, setRenewalDetails] = useState({
    completedBy: '',
    insuranceCompany: '',
    documentNumber: '',
    notes: '',
  })
  const [filterYear, setFilterYear] = useState('')
  const [filterVehicle, setFilterVehicle] = useState('')
  const [searchPlate, setSearchPlate] = useState('')

  useEffect(() => {
    initializeRenewals()
  }, [])

  const initializeRenewals = () => {
    const saved = localStorage.getItem('renewals')
    if (saved) {
      setRenewals(JSON.parse(saved))
    } else {
      const initial: RenewalRecord[] = []
      mockTrucks.forEach(truck => {
        initial.push({
          id: `${truck.id}-act-0`,
          truckId: truck.id,
          licensePlate: truck.licensePlate,
          brand: truck.brand,
          model: truck.model,
          driver: truck.driver,
          truckStatus: truck.status,
          documentType: 'act',
          expiryDate: truck.actExpiry,
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
        initial.push({
          id: `${truck.id}-insurance-0`,
          truckId: truck.id,
          licensePlate: truck.licensePlate,
          brand: truck.brand,
          model: truck.model,
          driver: truck.driver,
          truckStatus: truck.status,
          documentType: 'insurance',
          expiryDate: truck.insuranceExpiry,
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
      })
      setRenewals(initial)
      localStorage.setItem('renewals', JSON.stringify(initial))
    }
  }

  const handleRenew = (renewal: RenewalRecord) => {
    setSelectedRenewal(renewal)
    setRenewalDate(renewal.expiryDate)
    setRenewalDetails({ completedBy: '', insuranceCompany: '', documentNumber: '', notes: '' })
    setShowModal(true)
  }

  const confirmRenewal = () => {
    if (!selectedRenewal || !renewalDate) return

    const newExpiryDate = new Date(renewalDate)
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1)
    const nextExpiryString = newExpiryDate.toISOString().split('T')[0]

    const updated = renewals.map(r =>
      r.id === selectedRenewal.id
        ? {
            ...r,
            status: 'renewed' as const,
            renewedDate: renewalDate,
            completedBy: renewalDetails.completedBy,
            insuranceCompany: renewalDetails.insuranceCompany,
            documentNumber: renewalDetails.documentNumber,
            notes: renewalDetails.notes,
          }
        : r
    )

    const newRenewal: RenewalRecord = {
      id: `${selectedRenewal.truckId}-${selectedRenewal.documentType}-${Date.now()}`,
      truckId: selectedRenewal.truckId,
      licensePlate: selectedRenewal.licensePlate,
      brand: selectedRenewal.brand,
      model: selectedRenewal.model,
      driver: selectedRenewal.driver,
      truckStatus: selectedRenewal.truckStatus,
      documentType: selectedRenewal.documentType,
      expiryDate: nextExpiryString,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const final = [...updated, newRenewal]
    setRenewals(final)
    localStorage.setItem('renewals', JSON.stringify(final))
    setShowModal(false)
    setSelectedRenewal(null)
    setRenewalDate('')
    setRenewalDetails({ completedBy: '', insuranceCompany: '', documentNumber: '', notes: '' })
  }

  const pendingRenewals = renewals.filter(r => r.status === 'pending')
  const historyRenewals = renewals.filter(r => r.status === 'renewed')

  const actPending = pendingRenewals.filter(r => r.documentType === 'act')
  const insurancePending = pendingRenewals.filter(r => r.documentType === 'insurance')

  const actHistory = historyRenewals.filter(r => r.documentType === 'act')
  const insuranceHistory = historyRenewals.filter(r => r.documentType === 'insurance')

  const uniqueYears = Array.from(new Set(historyRenewals.map(r => new Date(r.renewedDate || '').getFullYear())))
    .filter(y => y > 0)
    .sort((a, b) => b - a)

  const uniqueVehicles = Array.from(new Map(historyRenewals.map(r => [r.truckId, r])).values())

  return (
    <AppShell
      title="จัดการประกัน / ภาษี"
      subtitle="ระบบจัดการการต่ออายุประกัน ภาษี และพ.ร.บ."
      userName="สมชาย วงศ์ขนส่ง"
      userRole="OWNER"
    >
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('pending')
              setSearchPlate('')
              setFilterYear('')
              setFilterVehicle('')
            }}
            className={`px-4 py-3 font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            รอดำเนินการ ({pendingRenewals.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Complete History ({historyRenewals.length})
          </button>
        </div>

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <PendingWidget
              title="พ.ร.บ."
              renewals={actPending}
              onRenew={handleRenew}
              colorClass="bg-blue-50 border-blue-200"
            />
            <PendingWidget
              title="ประกัน"
              renewals={insurancePending}
              onRenew={handleRenew}
              colorClass="bg-emerald-50 border-emerald-200"
            />
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาป้ายทะเบียน</label>
                  <input
                    type="text"
                    placeholder="เช่น กข-1234"
                    value={searchPlate}
                    onChange={(e) => setSearchPlate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">กรองตามปี</label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">ทั้งหมด</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">กรองตามรถ</label>
                  <select
                    value={filterVehicle}
                    onChange={(e) => setFilterVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">ทั้งหมด</option>
                    {uniqueVehicles.map(vehicle => (
                      <option key={vehicle.truckId} value={vehicle.truckId}>
                        {vehicle.licensePlate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* History Tables */}
            <HistoryWidget
              title="พ.ร.บ. - ประวัติ"
              renewals={actHistory}
              filterYear={filterYear}
              filterVehicle={filterVehicle}
              searchPlate={searchPlate}
            />
            <HistoryWidget
              title="ประกัน - ประวัติ"
              renewals={insuranceHistory}
              filterYear={filterYear}
              filterVehicle={filterVehicle}
              searchPlate={searchPlate}
            />
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">ยืนยันการต่ออายุ</h2>

            {selectedRenewal && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-mono font-bold text-lg">{selectedRenewal.licensePlate}</p>
                <p className="text-sm text-gray-600">{selectedRenewal.documentType === 'act' ? 'พ.ร.บ.' : 'ประกัน'} • {selectedRenewal.brand} {selectedRenewal.model}</p>
                <p className="text-sm text-gray-700 mt-2">วันหมดอายุปัจจุบัน: {formatThaiDate(selectedRenewal.expiryDate)}</p>
              </div>
            )}

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ต่ออายุ *</label>
                <input
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {renewalDate && selectedRenewal && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>วันหมดอายุปีถัดไป:</strong>{' '}
                    {formatThaiDate(new Date(new Date(renewalDate).getFullYear() + 1, new Date(renewalDate).getMonth(), new Date(renewalDate).getDate()).toISOString().split('T')[0])}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ดำเนินการโดย</label>
                <input
                  type="text"
                  placeholder="ชื่อผู้ทำการต่ออายุ"
                  value={renewalDetails.completedBy}
                  onChange={(e) => setRenewalDetails({ ...renewalDetails, completedBy: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">บริษัทประกัน/ผู้ออกใบ</label>
                <input
                  type="text"
                  placeholder="เช่น บริษัท ABC ประกัน"
                  value={renewalDetails.insuranceCompany}
                  onChange={(e) => setRenewalDetails({ ...renewalDetails, insuranceCompany: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เลขที่เอกสาร</label>
                <input
                  type="text"
                  placeholder="เช่น 12345678"
                  value={renewalDetails.documentNumber}
                  onChange={(e) => setRenewalDetails({ ...renewalDetails, documentNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
                <textarea
                  placeholder="หมายเหตุเพิ่มเติม"
                  value={renewalDetails.notes}
                  onChange={(e) => setRenewalDetails({ ...renewalDetails, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmRenewal}
                disabled={!renewalDate}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors text-sm"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  )
}
