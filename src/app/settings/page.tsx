'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

type UserRole = 'OWNER' | 'MANAGER' | 'DRIVER' | 'ACCOUNTANT'

interface User {
  id: string
  username: string
  role: UserRole
  createdAt: string
  lastLogin?: string
}

const roleColors: Record<UserRole, string> = {
  OWNER: 'bg-purple-100 text-purple-700',
  MANAGER: 'bg-blue-100 text-blue-700',
  DRIVER: 'bg-green-100 text-green-700',
  ACCOUNTANT: 'bg-orange-100 text-orange-700',
}

const roleLabels: Record<UserRole, string> = {
  OWNER: 'เจ้าของ',
  MANAGER: 'ผู้จัดการ',
  DRIVER: 'คนขับ',
  ACCOUNTANT: 'บัญชีการ',
}

interface Permission {
  id: string
  name: string
  description: string
}

const permissions: Permission[] = [
  { id: 'jobs', name: 'จัดการงานขนส่ง', description: 'สร้าง แก้ไข ดูงานขนส่ง' },
  { id: 'routes', name: 'วางแผนเส้นทาง', description: 'ใช้เครื่องมือวางแผนเส้นทาง' },
  { id: 'trucks', name: 'จัดการรถ', description: 'บันทึก แก้ไข ดูข้อมูลรถ' },
  { id: 'maintenance', name: 'ซ่อมบำรุง', description: 'จัดการการซ่อมบำรุงรถ' },
  { id: 'insurance', name: 'ประกัน/ภาษี', description: 'ดูและจัดการประกันภาษี' },
  { id: 'drivers', name: 'จัดการคนขับ', description: 'บันทึก แก้ไข ข้อมูลคนขับ' },
  { id: 'reports', name: 'รายงาน', description: 'ดูรายงานการดำเนินงาน' },
  { id: 'expenses', name: 'ค่าใช้จ่าย', description: 'บันทึกและอนุมัติค่าใช้จ่าย' },
  { id: 'receivables', name: 'ลูกหนี้/เจ้าหนี้', description: 'จัดการใบแจ้งหนี้' },
  { id: 'payroll', name: 'เงินเดือน', description: 'จัดการบัญชีเงินเดือน' },
  { id: 'documents', name: 'เอกสาร', description: 'ดูและจัดเก็บเอกสาร' },
]

const defaultPermissions: Record<UserRole, Set<string>> = {
  OWNER: new Set(permissions.map(p => p.id)),
  MANAGER: new Set(['jobs', 'trucks', 'maintenance', 'insurance', 'drivers', 'expenses']),
  DRIVER: new Set(['jobs', 'insurance']),
  ACCOUNTANT: new Set(['reports', 'expenses', 'receivables', 'payroll', 'documents']),
}

const mockUsers: User[] = [
  { id: '1', username: 'admin', role: 'OWNER', createdAt: '2024-01-15', lastLogin: '2024-06-20 14:30' },
  { id: '2', username: 'manager01', role: 'MANAGER', createdAt: '2024-02-01', lastLogin: '2024-06-20 10:15' },
  { id: '3', username: 'sompong', role: 'DRIVER', createdAt: '2024-03-10', lastLogin: '2024-06-19 18:45' },
  { id: '4', username: 'accountant01', role: 'ACCOUNTANT', createdAt: '2024-01-20', lastLogin: '2024-06-20 09:00' },
]

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, Set<string>>>(defaultPermissions)
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<UserRole>('OWNER')

  const handleAddUser = () => {
    setSelectedUser(null)
    setModalMode('add')
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteConfirm(false)
      setSelectedUser(null)
    }
  }

  const togglePermission = (permissionId: string) => {
    setRolePermissions(prev => {
      const newPerms = new Set(prev[selectedRoleForPermissions])
      if (newPerms.has(permissionId)) {
        newPerms.delete(permissionId)
      } else {
        newPerms.add(permissionId)
      }
      return {
        ...prev,
        [selectedRoleForPermissions]: newPerms,
      }
    })
  }

  const hasPermission = (permissionId: string) => {
    return rolePermissions[selectedRoleForPermissions].has(permissionId)
  }

  return (
    <AppShell title="ตั้งค่าระบบ" subtitle="จัดการผู้ใช้งานและสิทธิ์การเข้าถึง" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      <div className="space-y-6">

        {/* Users Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">จัดการผู้ใช้งาน</h2>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              เพิ่มผู้ใช้งาน
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">ชื่อผู้ใช้</th>
                  <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">บทบาท</th>
                  <th className="text-left text-sm font-semibold text-gray-600 px-6 py-3">ล็อกอินล่าสุด</th>
                  <th className="text-center text-sm font-semibold text-gray-600 px-6 py-3">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.username}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.lastLogin || <span className="text-gray-400">ไม่เคยเข้าสู่ระบบ</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
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
          </div>
        </div>

        {/* Permissions Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">จัดการสิทธิ์การเข้าถึง</h2>

          {/* Role Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleForPermissions(role)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedRoleForPermissions === role
                    ? `border-blue-600 text-blue-600 ${roleColors[role].split(' ')[0]}`
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {roleLabels[role]}
              </button>
            ))}
          </div>

          {/* Permissions Toggle List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{permission.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                </div>
                <button
                  onClick={() => togglePermission(permission.id)}
                  className={`ml-4 flex-shrink-0 w-12 h-6 rounded-full transition-colors ${
                    hasPermission(permission.id)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      hasPermission(permission.id) ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {modalMode === 'add' ? 'เพิ่มผู้ใช้งานใหม่' : 'แก้ไขผู้ใช้งาน'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ *</label>
                <input
                  type="text"
                  defaultValue={selectedUser?.username ?? ''}
                  placeholder="เช่น admin, manager01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน *</label>
                <div className="relative">
                  <input
                    type={showPassword[selectedUser?.id || 'new'] ? 'text' : 'password'}
                    defaultValue={selectedUser ? '••••••••' : ''}
                    placeholder="ตั้งรหัสผ่านใหม่"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const key = selectedUser?.id || 'new'
                      setShowPassword(prev => ({ ...prev, [key]: !prev[key] }))
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword[selectedUser?.id || 'new'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท *</label>
                <select
                  defaultValue={selectedUser?.role ?? 'MANAGER'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OWNER">เจ้าของ</option>
                  <option value="MANAGER">ผู้จัดการ</option>
                  <option value="DRIVER">คนขับ</option>
                  <option value="ACCOUNTANT">บัญชีการ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {modalMode === 'add' ? 'สร้างบัญชี' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-600 mb-6">คุณต้องการลบผู้ใช้งาน <strong>{selectedUser.username}</strong> หรือไม่?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
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
