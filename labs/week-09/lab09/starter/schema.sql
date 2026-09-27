-- ═══════════════════════════════════════════════════════════
-- Campus Service Request — โครงสร้างฐานข้อมูล
-- ENGSE203 สัปดาห์ที่ 9 · หน่วยที่ 4
--
-- 🏠 TODO W09-SCHEMA (CP23)
-- ไฟล์นี้ต้องรันแล้วสร้างฐานข้อมูลได้ครบทั้งหมดในครั้งเดียว
-- และต้อง "รันซ้ำได้" โดยไม่ error
-- ═══════════════════════════════════════════════════════════


PRAGMA foreign_keys = ON;

-- TODO ①  ลบตารางเดิมก่อน เพื่อให้รันไฟล์นี้ซ้ำได้
--         ⚠ ลำดับสำคัญ — ต้องลบตารางที่มี foreign key ก่อน
--         คำใบ้: DROP TABLE IF EXISTS ...
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

-- TODO ②  สร้างตาราง users
--         ต้องมี: id (PK, INTEGER, AUTOINCREMENT)
--                name (TEXT, ห้ามว่าง)
--                department (TEXT, ห้ามว่าง)
--                email (TEXT, ห้ามว่าง, ห้ามซ้ำ)

CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);


-- TODO ③  สร้างตาราง requests
--         ต้องมี: id (PK, TEXT — ใช้รหัสแบบ REQ-001)
--                requester_id (INTEGER, ห้ามว่าง, ชี้ไป users(id))
--                request_type (TEXT, ห้ามว่าง, จำกัดค่าด้วย CHECK)
--                location, details (TEXT, ห้ามว่าง)
--                priority (ค่าเริ่มต้น 'normal', จำกัดด้วย CHECK)
--                status (ค่าเริ่มต้น 'pending', จำกัดด้วย CHECK)
--                created_at (ค่าเริ่มต้นเป็นเวลาปัจจุบัน)
--
--         ⚠ อย่าลืม FOREIGN KEY — เป็นหัวใจของสัปดาห์นี้
CREATE TABLE requests (
  id            TEXT PRIMARY KEY,
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL
                CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ')),
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('normal','urgent')),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in-progress','completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (requester_id) REFERENCES users(id)
);


-- TODO ④  ใส่ข้อมูลตั้งต้น
--         users อย่างน้อย 4 คน · requests อย่างน้อย 5 รายการ

INSERT INTO users (name, department, email) VALUES
  ('สมชาย ใจดี',      'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  ('สุภาวดี รักเรียน', 'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  ('ธนกฤต ตั้งใจ',     'วิศวกรรมไฟฟ้า',     'thanakrit@rmutl.ac.th'),
  ('ปรียา ขยันยิ่ง',   'สำนักวิทยบริการ',   'preeya@rmutl.ac.th');

INSERT INTO requests (id, requester_id, request_type, location, details, priority, status) VALUES
  ('REQ-001', 1, 'แจ้งซ่อม', 'อาคารเรียนรวม', 'คอมพิวเตอร์ไม่ทำงาน', 'urgent', 'pending'),
  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'ห้องปฏิบัติการ', 'ลืมรหัสผ่าน', 'normal', 'in-progress'),
  ('REQ-003', 3, 'ขอใช้อุปกรณ์', 'ห้องประชุม', 'ขอจองโปรเจคเตอร์', 'normal', 'completed'),
  ('REQ-004', 4, 'อื่น ๆ', 'สำนักงานคณะวิศวกรรมศาสตร์', 'สอบถามเกี่ยวกับการฝึกงาน', 'normal', 'pending'),
  ('REQ-005', 1, 'แจ้งซ่อม', 'ห้องสมุด', 'เครื่องพิมพ์ไม่ทำงาน', 'urgent', 'in-progress'),
  ('REQ-006', 2, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 401', 'ไฟในห้องกะพริบตลอดเวลา', 'normal', 'pending'),
  ('REQ-007', 3, 'ขอใช้อุปกรณ์', 'ห้องเรียน 405', 'ต้องการโปรเจคเตอร์สำหรับสอน', 'urgent', 'in-progress'),
  ('REQ-008', 4, 'อื่น ๆ', 'สำนักงาน', 'ขอเปลี่ยนรหัสผ่าน Wi-Fi', 'normal', 'completed'),
  ('REQ-009', 1, 'บริการบัญชีผู้ใช้', 'ห้องปฏิบัติการ 402', 'บัญชีผู้ใช้ถูกล็อก', 'urgent', 'pending'),
  ('REQ-010', 2, 'แจ้งซ่อม', 'อาคารเรียนรวม', 'เครื่องปรับอากาศไม่ทำงาน', 'normal', 'in-progress');
  ;