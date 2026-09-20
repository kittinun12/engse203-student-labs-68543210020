import { config } from '../config.js';

/** จับ error ที่หลุดมาจากทุก route — ต้องมี 4 พารามิเตอร์ Express ถึงจะรู้ว่าเป็น error handler */
export function errorHandler(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500;

  // Log error 5xx ไว้ฝั่งเซิร์ฟเวอร์เพื่อนำไปตรวจสอบแก้ไข[cite: 11]
  if (status >= 500) {
    console.error('เกิดข้อผิดพลาดภายใน:', err.message);
  }

  res.status(status).json({
    // ถ้าเป็น 5xx ขึ้นไป ให้บอกผู้ใช้แบบกลางๆ แต่ถ้าเป็น 4xx ให้แสดง err.message[cite: 10, 11]
    error: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message,
    
    // ส่ง stack trace เฉพาะตอนพัฒนาเท่านั้น (production จะตัดออก)[cite: 10, 11]
    ...(config.isProduction ? {} : { stack: err.stack?.split('\n').slice(0, 3) }),
  });
}

/** ไม่มี route ไหนตรง */
export function notFound(req, res) {
  res.status(404).json({ error: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}` });
}
