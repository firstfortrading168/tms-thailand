import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

// Validate receipt
function validateReceipt(fileName: string, fileSize: number): { valid: boolean; suspicious: boolean; reason?: string } {
  // ตรวจขนาดไฟล์ (max 10MB)
  if (fileSize > 10 * 1024 * 1024) {
    return { valid: false, suspicious: true, reason: 'ไฟล์ใหญ่เกินไป (>10MB)' }
  }

  // ตรวจ format (JPG, PNG, PDF)
  const allowedExts = ['jpg', 'jpeg', 'png', 'pdf']
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (!ext || !allowedExts.includes(ext)) {
    return { valid: false, suspicious: true, reason: 'ประเภทไฟล์ไม่รองรับ' }
  }

  return { valid: true, suspicious: false }
}

// Compress image
async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType.includes('pdf')) {
    return buffer // PDF ไม่บีบอัด
  }

  return await sharp(buffer)
    .resize(1280, 960, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 70, progressive: true })
    .toBuffer()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('receipt') as File

    if (!file) {
      return NextResponse.json({ error: 'ไม่มีไฟล์' }, { status: 400 })
    }

    // Validate
    const validation = validateReceipt(file.name, file.size)
    if (!validation.valid) {
      return NextResponse.json({
        error: validation.reason,
        suspicious: true,
      }, { status: 400 })
    }

    // Compress
    const bufferData = await file.arrayBuffer()
    let compressedBuffer: Buffer = Buffer.from(bufferData as ArrayBuffer)
    if (file.type.includes('image')) {
      compressedBuffer = (await compressImage(compressedBuffer, file.type)) as Buffer
    }

    // Save file
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const timestamp = Date.now()
    const safeFileName = `receipt-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadsDir, safeFileName)

    await writeFile(filePath, compressedBuffer)

    return NextResponse.json({
      success: true,
      fileName: safeFileName,
      originalName: file.name,
      size: compressedBuffer.length,
      url: `/uploads/receipts/${safeFileName}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 })
  }
}
