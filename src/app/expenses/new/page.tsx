'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { ChevronLeft, Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewExpensePage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [truck, setTruck] = useState('')
  const [driver, setDriver] = useState('')
  const [jobNo, setJobNo] = useState('')
  const [note, setNote] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [uploadedReceipt, setUploadedReceipt] = useState<{ url: string; name: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setReceipt(file)
    setUploadError('')
    setUploadSuccess(false)

    // Upload ไปยัง API
    await uploadReceipt(file)
  }

  const uploadReceipt = async (file: File) => {
    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('receipt', file)

      const response = await fetch('/api/expenses/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setUploadError(data.message || data.error || 'ไม่สามารถอัปโหลดได้')
        if (data.suspicious) {
          // บันทึก suspicious receipt ไว้ใน localStorage
          const suspiciousReceipts = JSON.parse(
            typeof window !== 'undefined' ? localStorage.getItem('suspiciousReceipts') || '[]' : '[]'
          )
          suspiciousReceipts.push({
            id: Date.now(),
            fileName: file.name,
            reason: data.reason || data.error,
            timestamp: new Date().toISOString(),
            status: 'PENDING_REVIEW',
          })
          if (typeof window !== 'undefined') {
            localStorage.setItem('suspiciousReceipts', JSON.stringify(suspiciousReceipts))
          }

          setUploadError(`⚠️ ${data.error} - ได้บันทึกไว้รอการตรวจสอบ`)
        }
        return
      }

      setUploadedReceipt({ url: data.url, name: data.originalName })
      setUploadSuccess(true)
      setReceipt(null)

      // Reset file input
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      if (input) input.value = ''
    } catch (err) {
      setUploadError('เกิดข้อผิดพลาดในการอัปโหลด')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveReceipt = () => {
    setUploadedReceipt(null)
    setUploadSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedReceipt) {
      setUploadError('กรุณาแนบใบเสร็จ')
      return
    }

    setFormSubmitting(true)

    // Simulate submit delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitSuccess(true)

    // Auto redirect after 2 seconds
    setTimeout(() => {
      router.push('/expenses')
    }, 2000)
  }

  // Success screen
  if (submitSuccess) {
    return (
      <AppShell title="เพิ่มค่าใช้จ่ายใหม่" subtitle="บันทึกค่าใช้จ่ายของรถและคนขับ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
        <div className="max-w-md mx-auto text-center py-12">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">บันทึกเสร็จแล้ว!</h2>
            <p className="text-sm text-green-700 mb-6">
              ค่าใช้จ่ายได้ถูกบันทึกสำเร็จ กำลังพาคุณกลับหน้าค่าใช้จ่าย...
            </p>
            <Link
              href="/expenses"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              ←  กลับหน้าค่าใช้จ่าย
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="เพิ่มค่าใช้จ่ายใหม่" subtitle="บันทึกค่าใช้จ่ายของรถและคนขับ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="max-w-2xl">
        <Link href="/expenses" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-6">
          <ChevronLeft size={16} />
          กลับ
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">

          {/* แถว 1: วันที่ + ประเภท */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทค่าใช้จ่าย *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- เลือก --</option>
                <option value="FUEL">ค่าน้ำมัน</option>
                <option value="TOLL">ค่าทางด่วน</option>
                <option value="REPAIR">ค่าซ่อมรถ</option>
                <option value="ACCOMMODATION">เบี้ยเลี้ยง / ที่พัก</option>
                <option value="ADVANCE">เงินเบิก</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="รายละเอียดค่าใช้จ่าย"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* จำนวน + รถ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ</label>
              <select
                value={truck}
                onChange={e => setTruck(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- เลือกรถ --</option>
                <option value="กข-1234">กข-1234</option>
                <option value="คง-5678">คง-5678</option>
                <option value="จฉ-9012">จฉ-9012</option>
              </select>
            </div>
          </div>

          {/* คนขับ + งาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คนขับ</label>
              <select
                value={driver}
                onChange={e => setDriver(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- เลือกคนขับ --</option>
                <option value="สมพงษ์ ขับดี">สมพงษ์ ขับดี</option>
                <option value="วิรัตน์ ปลอดภัย">วิรัตน์ ปลอดภัย</option>
                <option value="ประเสริฐ วิ่งเก่ง">ประเสริฐ วิ่งเก่ง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">งาน (ถ้ามี)</label>
              <select
                value={jobNo}
                onChange={e => setJobNo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- เลือกงาน --</option>
                <option value="JOB-2568-0042">JOB-2568-0042</option>
                <option value="JOB-2568-0041">JOB-2568-0041</option>
              </select>
            </div>
          </div>

          {/* ▼ ส่วน Upload ใบเสร็จ */}
          <div className="border-t border-gray-200 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">แนบใบเสร็จ (ต้องทำให้ชัดเห็นตัวอักษร) *</label>

            {/* Upload area */}
            {!uploadedReceipt ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                <Upload size={28} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">คลิกเพื่ออัปโหลดใบเสร็จ</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (ขนาดสูงสุด 10 MB)</p>
                {uploading && <p className="text-xs text-blue-600 mt-2">กำลังอัปโหลด...</p>}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">✓ ไฟล์อัปโหลดสำเร็จ</p>
                    <p className="text-xs text-green-700 mt-1">{uploadedReceipt.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="text-green-600 hover:text-green-700 ml-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{uploadError}</p>
              </div>
            )}
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href="/expenses" className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={!uploadedReceipt || uploading || formSubmitting}
              className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
