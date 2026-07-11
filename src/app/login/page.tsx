'use client'

import { useState } from 'react'
import { Truck, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: เชื่อมต่อ next-auth signIn
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ระบบขนส่ง TMS</h1>
          <p className="text-blue-200 text-sm">Transportation Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">เข้าสู่ระบบ</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">ชื่อผู้ใช้</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น somchai_owner"
                required
              />
            </div>

            <div>
              <label className="form-label">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="ใส่รหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-600">จำรหัสผ่าน</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                ลืมรหัสผ่าน?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-2">บัญชีทดสอบ:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>เจ้าของ:</strong> somchai_owner</p>
              <p><strong>ผู้จัดการ:</strong> somying_manager</p>
              <p><strong>เสมียน:</strong> nida_clerk</p>
              <p className="text-gray-400">รหัสผ่าน (ทั้งหมด): password123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200/50 text-xs mt-6">
          © 2568 ระบบบริหารจัดการขนส่ง TMS Thailand
        </p>
      </div>
    </div>
  )
}
