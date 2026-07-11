// ค่าคงที่สำหรับระบบ TMS

export const JOB_STATUS_LABELS: Record<string, string> = {
  PENDING: 'รอรับงาน',
  WAITING_TRUCK: 'รอจัดรถ',
  IN_TRANSIT: 'กำลังขนส่ง',
  DELIVERED: 'ส่งงานแล้ว',
  INVOICED: 'วางบิลแล้ว',
  PAID: 'รับเงินแล้ว',
  CANCELLED: 'ยกเลิก',
}

export const JOB_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  WAITING_TRUCK: 'bg-yellow-100 text-yellow-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  INVOICED: 'bg-purple-100 text-purple-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export const TRUCK_TYPE_LABELS: Record<string, string> = {
  SMALL_TRUCK: 'รถเล็ก (4 ล้อ)',
  MEDIUM_TRUCK: 'รถกลาง (6 ล้อ)',
  LARGE_TRUCK: 'รถใหญ่ (10 ล้อ)',
  TRAILER: 'รถพ่วง',
  REFRIGERATOR: 'รถห้องเย็น',
  CRANE_TRUCK: 'รถเครน',
  TANKER: 'รถบรรทุกน้ำมัน',
}

export const TRUCK_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'ว่าง',
  IN_USE: 'กำลังใช้งาน',
  MAINTENANCE: 'ซ่อมบำรุง',
  INACTIVE: 'ไม่ได้ใช้งาน',
}

export const TRUCK_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  IN_USE: 'bg-blue-100 text-blue-700',
  MAINTENANCE: 'bg-orange-100 text-orange-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
}

export const DRIVER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'ปฏิบัติงาน',
  ON_LEAVE: 'ลางาน',
  INACTIVE: 'พ้นสภาพ',
}

export const LICENSE_TYPE_LABELS: Record<string, string> = {
  TYPE_2: 'ประเภท 2',
  TYPE_3: 'ประเภท 3',
  TYPE_4: 'ประเภท 4',
}

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  FUEL: 'ค่าน้ำมัน',
  TOLL: 'ค่าทางด่วน',
  REPAIR: 'ค่าซ่อมรถ',
  TIRE: 'ค่าปะยาง/เปลี่ยนยาง',
  ACCOMMODATION: 'ค่าที่พัก',
  FOOD: 'ค่าอาหาร',
  LOADING: 'ค่าขึ้น-ลงสินค้า',
  OTHER: 'ค่าใช้จ่ายอื่น',
}

export const EXPENSE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'รออนุมัติ',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ไม่อนุมัติ',
}

export const EXPENSE_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'ยังไม่ชำระ',
  PARTIAL: 'ชำระบางส่วน',
  PAID: 'ชำระแล้ว',
  OVERDUE: 'เกินกำหนด',
  CANCELLED: 'ยกเลิก',
}

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-700',
  PARTIAL: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export const MAINTENANCE_TYPE_LABELS: Record<string, string> = {
  OIL_CHANGE: 'เปลี่ยนน้ำมันเครื่อง',
  TIRE_CHANGE: 'เปลี่ยนยาง',
  INSPECTION: 'ตรวจสภาพ',
  BRAKE: 'ซ่อมเบรก',
  ENGINE: 'ซ่อมเครื่องยนต์',
  ELECTRICAL: 'ระบบไฟฟ้า',
  BODY: 'ซ่อมตัวถัง',
  PREVENTIVE: 'บำรุงรักษาตามกำหนด',
  OTHER: 'อื่นๆ',
}

export const USER_ROLE_LABELS: Record<string, string> = {
  OWNER: 'เจ้าของกิจการ',
  MANAGER: 'ผู้จัดการขนส่ง',
  CLERK: 'เสมียน',
  ACCOUNTANT: 'ฝ่ายบัญชี',
  DRIVER: 'คนขับรถ',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'เงินสด',
  TRANSFER: 'โอนเงิน',
  CHEQUE: 'เช็ค',
  CREDIT_CARD: 'บัตรเครดิต',
}

// จำนวนวันที่แจ้งเตือนล่วงหน้า
export const ALERT_DAYS = {
  TAX: 30,       // ภาษีรถยนต์
  ACT: 30,       // พ.ร.บ.
  INSURANCE: 45, // ประกัน
  LICENSE: 60,   // ใบขับขี่
}

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
