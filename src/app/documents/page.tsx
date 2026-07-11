'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Upload, FileText, Download, Trash2, Eye } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'CONTRACT' | 'RECEIPT' | 'INVOICE' | 'OTHER'
  size: string
  uploadedAt: string
  uploadedBy: string
}

const typeLabels: Record<string, string> = {
  CONTRACT: 'สัญญา',
  RECEIPT: 'ใบเสร็จ',
  INVOICE: 'ใบกำกับภาษี',
  OTHER: 'อื่นๆ',
}

const typeColors: Record<string, string> = {
  CONTRACT: 'bg-purple-100 text-purple-700',
  RECEIPT: 'bg-green-100 text-green-700',
  INVOICE: 'bg-blue-100 text-blue-700',
  OTHER: 'bg-gray-100 text-gray-700',
}

const mockDocuments: Document[] = [
  { id: '1', name: 'สัญญาการขนส่ง_บริษัท ABC', type: 'CONTRACT', size: '2.4 MB', uploadedAt: '2024-06-15', uploadedBy: 'admin' },
  { id: '2', name: 'ใบเสร็จรับเงิน_2024-06-14', type: 'RECEIPT', size: '890 KB', uploadedAt: '2024-06-14', uploadedBy: 'accountant01' },
  { id: '3', name: 'ใบกำกับภาษี_JOB-2568-0042', type: 'INVOICE', size: '1.2 MB', uploadedAt: '2024-06-13', uploadedBy: 'accountant01' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) {
      setDocuments(documents.filter(d => d.id !== id))
    }
  }

  return (
    <AppShell title="เอกสาร" subtitle="จัดเก็บและจัดการเอกสารทั้งหมด" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="space-y-6">

        {/* Upload Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Upload size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">อัปโหลดเอกสารใหม่</h2>
              <p className="text-sm text-gray-600">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์ (PDF, DOC, XLS)</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex-shrink-0"
            >
              เลือกไฟล์
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">เอกสารทั้งหมด ({documents.length})</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">ยังไม่มีเอกสาร</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">ชื่อไฟล์</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">ประเภท</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">ขนาด</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">อัปโหลดเมื่อ</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">อัปโหลดโดย</th>
                    <th className="text-center text-sm font-semibold text-gray-600 px-6 py-3">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-400 flex-shrink-0" />
                          <p className="font-medium text-gray-900">{doc.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColors[doc.type]}`}>
                          {typeLabels[doc.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedAt}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ดูไฟล์"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="ดาวน์โหลด"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">อัปโหลดเอกสาร</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทเอกสาร *</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- เลือกประเภท --</option>
                  <option value="CONTRACT">สัญญา</option>
                  <option value="RECEIPT">ใบเสร็จ</option>
                  <option value="INVOICE">ใบกำกับภาษี</option>
                  <option value="OTHER">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เลือกไฟล์ *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">ลากไฟล์มาวาง หรือคลิกเพื่อเลือก</p>
                  <p className="text-xs text-gray-400 mt-1">สูงสุด 10 MB</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                อัปโหลด
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
