'use client'

import AppShell from '@/components/layout/AppShell'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTruckPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('บันทึกรถใหม่เสร็จแล้ว! (ตัวอย่าง)')
  }

  return (
    <AppShell title="เพิ่มรถใหม่" subtitle="ลงทะเบียนรถบรรทุกเข้าระบบ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="max-w-2xl">
        <Link href="/trucks" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-6">
          <ChevronLeft size={16} />
          กลับ
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ *</label>
              <input
                type="text"
                placeholder="เช่น กข-1234"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อรถ</label>
              <input
                type="text"
                placeholder="เช่น คอย 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อ/รุ่น *</label>
              <input
                type="text"
                placeholder="เช่น HINO 500 Series"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ปีที่ผลิต</label>
              <input
                type="number"
                placeholder="2564"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่ตัวถัง (VIN)</label>
              <input
                type="text"
                placeholder="VIN number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขเครื่องยนต์</label>
              <input
                type="text"
                placeholder="Engine number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ความจุ (ตัน)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทเชื้อเพลิง *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">-- เลือก --</option>
                <option>ดีเซล</option>
                <option>เบนซิน</option>
                <option>แอลพีจี</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค่าบำรุงรักษา (บาท/เดือน)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค่าเบี้ยประกัน (บาท/ปี)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>ใช้งานได้</option>
              <option>ซ่อมบำรุง</option>
              <option>รอประมวล</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              placeholder="หมายเหตุเพิ่มเติมเกี่ยวกับรถ"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/trucks" className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
              ยกเลิก
            </Link>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
