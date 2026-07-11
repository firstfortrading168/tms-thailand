'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Download, TrendingUp, Truck, Users, MapPin } from 'lucide-react'

// ข้อมูลตัวอย่างสำหรับรายงาน
const revenueByTruck = [
  { truck: 'กข-1234', revenue: 185000, cost: 82000, profit: 103000 },
  { truck: 'คง-5678', revenue: 162000, cost: 95000, profit: 67000 },
  { truck: 'จฉ-9012', revenue: 98000, cost: 45000, profit: 53000 },
  { truck: 'ชซ-3456', revenue: 225000, cost: 110000, profit: 115000 },
  { truck: 'ฌญ-7890', revenue: 140000, cost: 78000, profit: 62000 },
]

const revenueByMonth = [
  { month: 'ม.ค.', revenue: 1800000, cost: 1200000 },
  { month: 'ก.พ.', revenue: 2100000, cost: 1350000 },
  { month: 'มี.ค.', revenue: 1950000, cost: 1280000 },
  { month: 'เม.ย.', revenue: 2300000, cost: 1450000 },
  { month: 'พ.ค.', revenue: 2150000, cost: 1380000 },
  { month: 'มิ.ย.', revenue: 2480000, cost: 1560000 },
]

const topCustomers = [
  { customer: 'บริษัท ไทยฟู้ด จำกัด', revenue: 850000, jobs: 42, profit: 320000 },
  { customer: 'บริษัท โชคดี อินดัสตรี้', revenue: 620000, jobs: 28, profit: 245000 },
  { customer: 'ห้างหุ้นส่วนจำกัด สินค้าไทย', revenue: 380000, jobs: 19, profit: 145000 },
  { customer: 'บริษัท ขนส่งไทย จำกัด', revenue: 290000, jobs: 15, profit: 98000 },
]

const topRoutes = [
  { route: 'กรุงเทพฯ → เชียงใหม่', jobs: 35, avgPrice: 42000, profit: 580000 },
  { route: 'กรุงเทพฯ → ขอนแก่น', jobs: 48, avgPrice: 25000, profit: 480000 },
  { route: 'กรุงเทพฯ → สุราษฎร์ธานี', jobs: 22, avgPrice: 45000, profit: 385000 },
  { route: 'ชลบุรี → กรุงเทพฯ', jobs: 55, avgPrice: 15000, profit: 330000 },
]

const maintenanceCostByTruck = [
  { truck: 'คง-5678', cost: 95000, type: 'ซ่อมเครื่อง' },
  { truck: 'ชซ-3456', cost: 45000, type: 'เปลี่ยนยาง' },
  { truck: 'จฉ-9012', cost: 38000, type: 'ซ่อมเบรก' },
  { truck: 'กข-1234', cost: 22000, type: 'บำรุงรักษา' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month')
  const [activeReport, setActiveReport] = useState('overview')

  const reports = [
    { id: 'overview', label: 'ภาพรวม' },
    { id: 'by_truck', label: 'แยกตามรถ' },
    { id: 'customers', label: 'ลูกค้า' },
    { id: 'routes', label: 'เส้นทาง' },
    { id: 'maintenance', label: 'ค่าซ่อม' },
  ]

  return (
    <AppShell title="รายงาน" subtitle="สรุปผลการดำเนินงานสำหรับเจ้าของกิจการ" userName="สมชาย วงศ์ขนส่ง" userRole="OWNER">
      {/* Date Filter + Export */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          {[
            { value: 'today', label: 'วันนี้' },
            { value: 'week', label: 'สัปดาห์นี้' },
            { value: 'month', label: 'เดือนนี้' },
            { value: 'quarter', label: 'ไตรมาส' },
            { value: 'year', label: 'ปีนี้' },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setDateRange(d.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                dateRange === d.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input type="date" className="form-input w-auto text-sm" />
          <span className="text-gray-400 text-sm">ถึง</span>
          <input type="date" className="form-input w-auto text-sm" />
          <button className="btn-secondary text-sm">
            <Download size={15} />
            Excel
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`px-4 py-2 text-sm rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeReport === r.id ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && (
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'รายได้รวม', value: '2,480,000', unit: 'บาท', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'ค่าใช้จ่ายรวม', value: '1,560,000', unit: 'บาท', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'กำไรขั้นต้น', value: '920,000', unit: 'บาท', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'จำนวนเที่ยว', value: '186', unit: 'เที่ยว', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                  <kpi.icon size={18} className={kpi.color} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-400">{kpi.unit}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">รายได้และค่าใช้จ่ายรายเดือน</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByMonth} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}ล.`} />
                <Tooltip formatter={(value) => [`${formatCurrency(value as number)} บาท`]} />
                <Bar dataKey="revenue" name="รายได้" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="ค่าใช้จ่าย" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* By Truck Report */}
      {activeReport === 'by_truck' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">รายได้แยกตามรถ</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByTruck} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="truck" tick={{ fontSize: 12, fontFamily: 'monospace' }} width={60} />
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)} บาท`]} />
                  <Bar dataKey="revenue" name="รายได้" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="profit" name="กำไร" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Profit Pie */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">สัดส่วนกำไรตามรถ</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueByTruck}
                    dataKey="profit"
                    nameKey="truck"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ truck, percent }) => `${truck} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {revenueByTruck.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)} บาท`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">กำไรขาดทุนแยกตามรถ</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">ทะเบียนรถ</th>
                    <th className="table-header text-right">รายได้ (บาท)</th>
                    <th className="table-header text-right">ค่าใช้จ่าย (บาท)</th>
                    <th className="table-header text-right">กำไร (บาท)</th>
                    <th className="table-header text-right">อัตรากำไร</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueByTruck.sort((a, b) => b.profit - a.profit).map((row) => (
                    <tr key={row.truck} className="hover:bg-gray-50">
                      <td className="table-cell font-mono font-semibold">{row.truck}</td>
                      <td className="table-cell text-right">{formatCurrency(row.revenue)}</td>
                      <td className="table-cell text-right text-red-600">{formatCurrency(row.cost)}</td>
                      <td className="table-cell text-right font-bold text-green-600">{formatCurrency(row.profit)}</td>
                      <td className="table-cell text-right">
                        <span className={`badge ${
                          (row.profit / row.revenue) > 0.4 ? 'bg-green-100 text-green-700' :
                          (row.profit / row.revenue) > 0.3 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {((row.profit / row.revenue) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customers Report */}
      {activeReport === 'customers' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">ลูกค้าที่ทำรายได้สูงสุด</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">อันดับ</th>
                  <th className="table-header">ลูกค้า</th>
                  <th className="table-header text-right">จำนวนงาน</th>
                  <th className="table-header text-right">รายได้รวม (บาท)</th>
                  <th className="table-header text-right">กำไร (บาท)</th>
                  <th className="table-header text-right">อัตรากำไร</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="table-cell font-medium text-sm">{c.customer}</td>
                    <td className="table-cell text-right text-sm">{c.jobs} เที่ยว</td>
                    <td className="table-cell text-right font-semibold">{formatCurrency(c.revenue)}</td>
                    <td className="table-cell text-right font-bold text-green-600">{formatCurrency(c.profit)}</td>
                    <td className="table-cell text-right">
                      {((c.profit / c.revenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routes Report */}
      {activeReport === 'routes' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">เส้นทางที่ทำกำไรสูงสุด</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">เส้นทาง</th>
                  <th className="table-header text-right">จำนวนเที่ยว</th>
                  <th className="table-header text-right">ราคาเฉลี่ย/เที่ยว</th>
                  <th className="table-header text-right">กำไรรวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-sm">{r.route}</td>
                    <td className="table-cell text-right text-sm">{r.jobs} เที่ยว</td>
                    <td className="table-cell text-right">{formatCurrency(r.avgPrice)}</td>
                    <td className="table-cell text-right font-bold text-green-600">{formatCurrency(r.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Report */}
      {activeReport === 'maintenance' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">ค่าซ่อมบำรุงแยกตามรถ</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={maintenanceCostByTruck}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="truck" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => [`${formatCurrency(value as number)} บาท`, 'ค่าซ่อม']} />
                <Bar dataKey="cost" name="ค่าซ่อม" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">รถที่มีค่าซ่อมสูงสุด</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ทะเบียนรถ</th>
                  <th className="table-header">ประเภทการซ่อมหลัก</th>
                  <th className="table-header text-right">ค่าซ่อมรวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceCostByTruck.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-cell font-mono font-semibold">{m.truck}</td>
                    <td className="table-cell text-sm">{m.type}</td>
                    <td className="table-cell text-right font-bold text-red-600">{formatCurrency(m.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  )
}
