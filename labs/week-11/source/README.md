# Campus Service — Full-Stack (Week 11)

ระบบบริการ campus service แบบ Full-Stack พร้อมสำหรับ Production Deployment

## สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)

1. **Presentation Layer (Frontend)**: พัฒนาด้วย React + Vite ทำหน้าที่แสดงผลหน้าจอผู้ใช้ (UI) และรับ-ส่งข้อมูลกับ API
2. **Application Layer (Backend)**: พัฒนาด้วย Node.js + Express สำหรับจัดการ Business Logic, Routing, Error Handling และ REST API
3. **Data Layer (Database)**: จัดเก็บข้อมูลด้วย SQLite / Turso ผ่าน Database Client

## Environment Variables (.env)

ระบบใช้การอ่านค่า Config จาก Environment Variables ผ่าน `src/config.js` ดังนี้:

- `PORT`: พอร์ตที่ Express Server ทำงาน (Default: `3001`)
- `NODE_ENV`: สถานะแวดล้อมระบบ (`development` หรือ `production`)
- `CORS_ORIGIN`: อนุญาต Origin สำหรับ CORS Policy (Default: `http://localhost:5173`)
- `DB_FILE`: Path สำหรับไฟล์ข้อมูล SQLite
- `STATIC_DIR`: Path สำหรับไฟล์ Static Frontend (`frontend/dist`)

## วิธีรันระบบ (npm Scripts)

### 1. การติดตั้ง dependencies
```bash
npm install