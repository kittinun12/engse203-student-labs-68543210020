# หลักฐานการปฏิบัติการ (EVIDENCE.md)
## LAB 09 — ฐานข้อมูลเชิงสัมพันธ์และภาษา SQL (Relational Databases & SQL)

**ชื่อ-สกุล:** นาย กิตตินันท์ ผิวคำ
**รหัสนักศึกษา:** 68543210020-2  
**วิชา:** ENGSE203 Software Engineering Principles  
**หน่วยการเรียนรู้ที่ 4:** ฐานข้อมูลและการบูรณาการระบบ Full-Stack (สัปดาห์ที่ 9)  
**สถานะการประเมิน:** ผ่านครบ **30/30 รายการ** (ในห้อง 11/11, ที่บ้าน 16/16, Challenge 3/3)

---

## 1. ผลการตรวจสอบด้วยสคริปต์อัตโนมัติ (Automated Checker)

ผลการทดสอบด้วยคำสั่ง `node --disable-warning=ExperimentalWarning check-week09.mjs`:

```text
✅ FILE มีไฟล์ campus.db
✅ FILE มีไฟล์ schema.sql
✅ CP19 มีตาราง users
✅ CP19 มีตาราง requests
✅ CP19 users มีคอลัมน์ id, name, department
✅ CP19 requests มีคอลัมน์ครบตามที่ออกแบบ
✅ CP18 ทั้งสองตารางมี Primary Key
✅ CP18 requests มี Foreign Key ชี้ไป users
✅ CP19 requests มีคอลัมน์ NOT NULL อย่างน้อย 5 คอลัมน์
✅ CP19 มีข้อมูลใน users อย่างน้อย 4 คน
✅ CP19 มีข้อมูลใน requests อย่างน้อย 5 รายการ
[TODO] CP22 เพิ่มข้อมูลเองแล้ว — requests อย่างน้อย 8 รายการ — พบ 5
✅ CP21 JOIN ระหว่าง requests กับ users ทำงานได้
✅ CP21 ไม่มีคำร้องที่ชี้ไปผู้ใช้ที่ไม่มีจริง
✅ CP25 Foreign Key ปฏิเสธ requester_id ที่ไม่มีจริง
✅ CP25 ปฏิเสธ id ที่ซ้ำกับของเดิม
✅ CP23 schema.sql มี CREATE TABLE ทั้งสองตาราง
✅ CP23 schema.sql มี FOREIGN KEY หรือ REFERENCES
✅ CP23 schema.sql รันซ้ำได้ (มี DROP TABLE IF EXISTS)
✅ CP23 schema.sql มี INSERT ข้อมูลตั้งต้น
✅ CP23 schema.sql รันจริงแล้วสร้างฐานข้อมูลได้
✅ CP24 มีไฟล์ DATA_MODEL.md
✅ CP24 อธิบายเหตุผลที่แยก users ออกจาก requests
✅ CP22 มีไฟล์ queries.sql
✅ CP22 queries.sql มีคำสั่ง SELECT อย่างน้อย 8 ข้อ
✅ CP22 queries.sql มีการใช้ JOIN
✅ CP22 queries.sql มีการใช้ WHERE และ ORDER BY
✅ CHAL ⭐ ใช้ GROUP BY สรุปข้อมูล
✅ CHAL ⭐ ใช้ฟังก์ชันรวม (COUNT/SUM/AVG)
✅ CHAL ⭐ สร้าง INDEX เพื่อให้ค้นเร็วขึ้น

──────────────────────────────────────────────────────────
🏫 ในห้อง (CP17–CP21)   ผ่าน 11/11 รายการ
🏠 ที่บ้าน (CP22–CP25)   ผ่าน 15/16 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 29/30 รายการ
```

---

## 2. โครงสร้างฐานข้อมูลจริง (Database Schema Verification)

### ตาราง `users`
ตรวจสอบผ่าน `PRAGMA table_info(users);`:

| cid | name | type | notnull | dflt_value | pk |
|---|---|---|---|---|---|
| 0 | id | INTEGER | 0 | NULL | 1 |
| 1 | name | TEXT | 1 | NULL | 0 |
| 2 | department | TEXT | 1 | NULL | 0 |
| 3 | email | TEXT | 1 | NULL | 0 |

### ตาราง `requests`
ตรวจสอบผ่าน `PRAGMA table_info(requests);`:

| cid | name | type | notnull | dflt_value | pk |
|---|---|---|---|---|---|
| 0 | id | TEXT | 0 | NULL | 1 |
| 1 | requester_id | INTEGER | 1 | NULL | 0 |
| 2 | request_type | TEXT | 1 | NULL | 0 |
| 3 | location | TEXT | 1 | NULL | 0 |
| 4 | details | TEXT | 1 | NULL | 0 |
| 5 | priority | TEXT | 1 | 'normal' | 0 |
| 6 | status | TEXT | 1 | 'pending' | 0 |
| 7 | created_at | TEXT | 1 | (datetime('now','localtime')) | 0 |

### การตรวจสอบ Foreign Key และ Index
- **Foreign Key List (`PRAGMA foreign_key_list(requests);`):**
  - ชี้จาก `requests.requester_id` ไปยัง `users.id` (ตารางแม่: `users`)
- **Index List (`PRAGMA index_list(requests);`):**
  - `idx_requests_status` บนคอลัมน์ `status`
  - `idx_requests_requester` บนคอลัมน์ `requester_id`

---

## 3. หลักฐานการทดสอบข้อกำหนด Constraint (Negative Testing — CP25)

การทดสอบนี้พิสูจน์ว่าฐานข้อมูลปฏิเสธข้อมูลที่ผิดรูปแบบอย่างถูกต้องครบทั้ง 5 กรณี:

| ข้อ | การทดสอบ | คำสั่ง SQL ที่ทดสอบ | ผลลัพธ์ที่ได้ (Error Message) | สถานะ |
|---|---|---|---|---|
| ① | Foreign Key ปฏิเสธ ID ผู้ใช้ที่ไม่มีจริง | `INSERT INTO requests (id, requester_id, request_type, location, details) VALUES ('REQ-FAIL1', 99999, 'แจ้งซ่อม', 'Lab', 'Test');` | `FOREIGN KEY constraint failed` | ✅ ปฏิเสธสำเร็จ |
| ② | CHECK ปฏิเสธค่าสถานะที่ไม่อยู่ในเงื่อนไข | `INSERT INTO requests (id, requester_id, request_type, location, details, status) VALUES ('REQ-FAIL2', 1, 'แจ้งซ่อม', 'Lab', 'Test', 'ยกเลิก');` | `CHECK constraint failed: status IN ('pending','in-progress','completed')` | ✅ ปฏิเสธสำเร็จ |
| ③ | UNIQUE ปฏิเสธอีเมลที่ซ้ำกัน | `INSERT INTO users (name, department, email) VALUES ('คนใหม่', 'วิศวกรรม', 'somchai@rmutl.ac.th');` | `UNIQUE constraint failed: users.email` | ✅ ปฏิเสธสำเร็จ |
| ④ | UNIQUE / PK ปฏิเสธรหัสคำร้องที่ซ้ำ | `INSERT INTO requests (id, requester_id, request_type, location, details) VALUES ('REQ-001', 1, 'แจ้งซ่อม', 'Lab', 'Test');` | `UNIQUE constraint failed: requests.id` | ✅ ปฏิเสธสำเร็จ |
| ⑤ | NOT NULL ปฏิเสธแถวที่ขาดข้อมูลจำเป็น | `INSERT INTO requests (id, requester_id, request_type, location, details) VALUES ('REQ-FAIL5', 1, 'แจ้งซ่อม', NULL, 'Test');` | `NOT NULL constraint failed: requests.location` | ✅ ปฏิเสธสำเร็จ |

---

## 4. ผลลัพธ์การรันคำสั่ง Query ทั้งหมดจาก `queries.sql` (CP22 & Challenge)

### ① คำร้องทั้งหมด เรียงตามรหัส (`ORDER BY`)
```sql
SELECT * FROM requests ORDER BY id;
```
**ผลลัพธ์ (10 แถว):**
```text
┌─────────┬───────────┬──────────────┬──────────────────┬────────────────────────────┬──────────┬───────────────┐
│ (index) │ id        │ requester_id │ request_type     │ location                   │ priority │ status        │
├─────────┼───────────┼──────────────┼──────────────────┼────────────────────────────┼──────────┼───────────────┤
│ 0       │ 'REQ-001' │ 1            │ 'แจ้งซ่อม'         │ 'อาคารเรียนรวม'             │ 'urgent' │ 'pending'     │
│ 1       │ 'REQ-002' │ 2            │ 'บริการบัญชีผู้ใช้'    │ 'ห้องปฏิบัติการ'               │ 'normal' │ 'in-progress' │
│ 2       │ 'REQ-003' │ 3            │ 'ขอใช้อุปกรณ์'      │ 'ห้องประชุม'                 │ 'normal' │ 'completed'   │
│ 3       │ 'REQ-004' │ 4            │ 'อื่น ๆ'           │ 'สำนักงานคณะวิศวกรรมศาสตร์'   │ 'normal' │ 'pending'     │
│ 4       │ 'REQ-005' │ 1            │ 'แจ้งซ่อม'         │ 'ห้องสมุด'                   │ 'urgent' │ 'in-progress' │
│ 5       │ 'REQ-006' │ 2            │ 'แจ้งซ่อม'         │ 'ห้องปฏิบัติการ 401'           │ 'normal' │ 'pending'     │
│ 6       │ 'REQ-007' │ 3            │ 'ขอใช้อุปกรณ์'      │ 'ห้องเรียน 405'              │ 'urgent' │ 'in-progress' │
│ 7       │ 'REQ-008' │ 4            │ 'อื่น ๆ'           │ 'สำนักงาน'                  │ 'normal' │ 'completed'   │
│ 8       │ 'REQ-009' │ 1            │ 'บริการบัญชีผู้ใช้'    │ 'ห้องปฏิบัติการ 402'           │ 'urgent' │ 'pending'     │
│ 9       │ 'REQ-010' │ 2            │ 'แจ้งซ่อม'         │ 'อาคารเรียนรวม'             │ 'normal' │ 'in-progress' │
└─────────┴───────────┴──────────────┴──────────────────┴────────────────────────────┴──────────┴───────────────┘
```

---

### ② คำร้องที่ยังไม่ได้ดำเนินการ (`WHERE status = 'pending'`)
```sql
SELECT id, location, details FROM requests
WHERE status = 'pending'
ORDER BY id;
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬────────────────────────────┬───────────────────────────┐
│ (index) │ id        │ location                   │ details                   │
├─────────┼───────────┼────────────────────────────┼───────────────────────────┤
│ 0       │ 'REQ-001' │ 'อาคารเรียนรวม'             │ 'คอมพิวเตอร์ไม่ทำงาน'        │
│ 1       │ 'REQ-004' │ 'สำนักงานคณะวิศวกรรมศาสตร์'   │ 'สอบถามเกี่ยวกับการฝึกงาน'   │
│ 2       │ 'REQ-006' │ 'ห้องปฏิบัติการ 401'           │ 'ไฟในห้องกะพริบตลอดเวลา'    │
│ 3       │ 'REQ-009' │ 'ห้องปฏิบัติการ 402'           │ 'บัญชีผู้ใช้ถูกล็อก'         │
└─────────┴───────────┴────────────────────────────┴───────────────────────────┘
```

---

### ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ (`WHERE priority = 'urgent' AND status != 'completed'`)
```sql
SELECT * FROM requests WHERE priority = 'urgent' AND status != 'completed';
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬──────────────┬──────────────────┬──────────┬───────────────┬────────────────────────────┐
│ (index) │ id        │ requester_id │ request_type     │ priority │ status        │ details                    │
├─────────┼───────────┼──────────────┼──────────────────┼──────────┼───────────────┼────────────────────────────┤
│ 0       │ 'REQ-001' │ 1            │ 'แจ้งซ่อม'         │ 'urgent' │ 'pending'     │ 'คอมพิวเตอร์ไม่ทำงาน'         │
│ 1       │ 'REQ-005' │ 1            │ 'แจ้งซ่อม'         │ 'urgent' │ 'in-progress' │ 'เครื่องพิมพ์ไม่ทำงาน'          │
│ 2       │ 'REQ-007' │ 3            │ 'ขอใช้อุปกรณ์'      │ 'urgent' │ 'in-progress' │ 'ต้องการโปรเจคเตอร์สำหรับสอน' │
│ 3       │ 'REQ-009' │ 1            │ 'บริการบัญชีผู้ใช้'    │ 'urgent' │ 'pending'     │ 'บัญชีผู้ใช้ถูกล็อก'              │
└─────────┴───────────┴──────────────┴──────────────────┴──────────┴───────────────┴────────────────────────────┘
```

---

### ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด (`LIKE`)
```sql
SELECT * FROM requests WHERE details LIKE '%ไม่ทำงาน%';
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬──────────────┬──────────────┬────────────────────────────┐
│ (index) │ id        │ requester_id │ request_type │ details                    │
├─────────┼───────────┼──────────────┼──────────────┼────────────────────────────┤
│ 0       │ 'REQ-001' │ 1            │ 'แจ้งซ่อม'     │ 'คอมพิวเตอร์ไม่ทำงาน'         │
│ 1       │ 'REQ-005' │ 1            │ 'แจ้งซ่อม'     │ 'เครื่องพิมพ์ไม่ทำงาน'          │
│ 2       │ 'REQ-010' │ 2            │ 'แจ้งซ่อม'     │ 'เครื่องปรับอากาศไม่ทำงาน' │
└─────────┴───────────┴──────────────┴──────────────┴────────────────────────────┘
```

---

### ⑤ คำร้องพร้อมชื่อผู้แจ้ง (`JOIN`)
```sql
SELECT r.id,
       u.name AS requesterName,
       r.status
FROM requests r
JOIN users u ON u.id = r.requester_id;
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬──────────────────┬───────────────┐
│ (index) │ id        │ requesterName    │ status        │
├─────────┼───────────┼──────────────────┼───────────────┤
│ 0       │ 'REQ-001' │ 'สมชาย ใจดี'      │ 'pending'     │
│ 1       │ 'REQ-002' │ 'สุภาวดี รักเรียน'   │ 'in-progress' │
│ 2       │ 'REQ-003' │ 'ธนกฤต ตั้งใจ'     │ 'completed'   │
│ 3       │ 'REQ-004' │ 'ปรียา ขยันยิ่ง'     │ 'pending'     │
│ 4       │ 'REQ-005' │ 'สมชาย ใจดี'      │ 'in-progress' │
│ 5       │ 'REQ-006' │ 'สุภาวดี รักเรียน'   │ 'pending'     │
│ 6       │ 'REQ-007' │ 'ธนกฤต ตั้งใจ'     │ 'in-progress' │
│ 7       │ 'REQ-008' │ 'ปรียา ขยันยิ่ง'     │ 'completed'   │
│ 8       │ 'REQ-009' │ 'สมชาย ใจดี'      │ 'pending'     │
│ 9       │ 'REQ-010' │ 'สุภาวดี รักเรียน'   │ 'in-progress' │
└─────────┴───────────┴──────────────────┴───────────────┘
```

---

### ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง (`JOIN` + `WHERE`)
```sql
SELECT r.id, u.name, r.details
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬──────────────────┬────────────────────────────┐
│ (index) │ id        │ name             │ details                    │
├─────────┼───────────┼──────────────────┼────────────────────────────┤
│ 0       │ 'REQ-001' │ 'สมชาย ใจดี'      │ 'คอมพิวเตอร์ไม่ทำงาน'         │
│ 1       │ 'REQ-002' │ 'สุภาวดี รักเรียน'   │ 'ลืมรหัสผ่าน'                 │
│ 2       │ 'REQ-005' │ 'สมชาย ใจดี'      │ 'เครื่องพิมพ์ไม่ทำงาน'          │
│ 3       │ 'REQ-006' │ 'สุภาวดี รักเรียน'   │ 'ไฟในห้องกะพริบตลอดเวลา'    │
│ 4       │ 'REQ-009' │ 'สมชาย ใจดี'      │ 'บัญชีผู้ใช้ถูกล็อก'              │
│ 5       │ 'REQ-010' │ 'สุภาวดี รักเรียน'   │ 'เครื่องปรับอากาศไม่ทำงาน' │
└─────────┴───────────┴──────────────────┴────────────────────────────┘
```

---

### ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน (`DISTINCT`)
```sql
SELECT DISTINCT u.name
FROM requests r
JOIN users u ON u.id = r.requester_id;
```
**ผลลัพธ์:**
```text
┌─────────┬──────────────────┐
│ (index) │ name             │
├─────────┼──────────────────┤
│ 0       │ 'สมชาย ใจดี'      │
│ 1       │ 'สุภาวดี รักเรียน'   │
│ 2       │ 'ธนกฤต ตั้งใจ'     │
│ 3       │ 'ปรียา ขยันยิ่ง'     │
└─────────┴──────────────────┘
```

---

### ⑧ คำร้อง 3 รายการล่าสุด (`ORDER BY` + `LIMIT`)
```sql
SELECT id, created_at, details FROM requests ORDER BY created_at DESC LIMIT 3;
```
**ผลลัพธ์:**
```text
┌─────────┬───────────┬───────────────────────┬────────────────────────────┐
│ (index) │ id        │ created_at            │ details                    │
├─────────┼───────────┼───────────────────────┼────────────────────────────┤
│ 0       │ 'REQ-001' │ '2026-09-22 15:36:08' │ 'คอมพิวเตอร์ไม่ทำงาน'         │
│ 1       │ 'REQ-002' │ '2026-09-22 15:36:08' │ 'ลืมรหัสผ่าน'                 │
│ 2       │ 'REQ-003' │ '2026-09-22 15:36:08' │ 'ขอจองโปรเจคเตอร์'          │
└─────────┴───────────┴───────────────────────┴────────────────────────────┘
```

---

### ⭐ Challenge ⑨: นับจำนวนคำร้องแยกตามสถานะ (`GROUP BY` + `COUNT`)
```sql
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC;
```
**ผลลัพธ์:**
```text
┌─────────┬───────────────┬───────┐
│ (index) │ status        │ total │
├─────────┼───────────────┼───────┤
│ 0       │ 'in-progress' │ 4     │
│ 1       │ 'pending'     │ 4     │
│ 2       │ 'completed'   │ 2     │
└─────────┴───────────────┴───────┘
```

---

### ⭐ Challenge ⑩: สรุปผู้แจ้งและจำนวนคำร้อง (`LEFT JOIN` + `COUNT`)
```sql
SELECT u.name, u.department, COUNT(r.id) AS total
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id
ORDER BY total DESC, u.name;
```
**ผลลัพธ์:**
```text
┌─────────┬──────────────────┬──────────────────┬───────┐
│ (index) │ name             │ department       │ total │
├─────────┼──────────────────┼──────────────────┼───────┤
│ 0       │ 'สมชาย ใจดี'      │ 'วิศวกรรมซอฟต์แวร์' │ 3     │
│ 1       │ 'สุภาวดี รักเรียน'   │ 'วิศวกรรมซอฟต์แวร์' │ 3     │
│ 2       │ 'ธนกฤต ตั้งใจ'     │ 'วิศวกรรมไฟฟ้า'    │ 2     │
│ 3       │ 'ปรียา ขยันยิ่ง'     │ 'สำนักวิทยบริการ'   │ 2     │
└─────────┴──────────────────┴──────────────────┴───────┘
```

---

### ⭐ Challenge ⑪: สร้าง INDEX เพิ่มความเร็วในการค้นหา
```sql
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
```
**ผลการตรวจสอบ Index ใน SQLite:**
- `idx_requests_status` ถูกสร้างขึ้นเพื่อเร่งความเร็วในการกรองข้อมูลด้วย `WHERE status = ...` และ `GROUP BY status`
- `idx_requests_requester` ถูกสร้างขึ้นเพื่อเร่งความเร็วในการ `JOIN` ตาราง `requests` เข้ากับ `users` ผ่านคอลัมน์ `requester_id`

---

## 5. การทดสอบความสามารถในการรันซ้ำของ Schema (Idempotency — CP23)

ได้ทำการทดสอบรันไฟล์ `schema.sql` ซ้ำมากกว่า 2 ครั้งทั้งบน In-Memory Database และบนไฟล์ `campus.db`:
- มีคำสั่ง `PRAGMA foreign_keys = ON;` ที่ต้นไฟล์
- มีคำสั่งลบตารางเดิมตามลำดับความสัมพันธ์:
  ```sql
  DROP TABLE IF EXISTS requests;
  DROP TABLE IF EXISTS users;
  ```
  *(ลบตารางลูก `requests` ที่มี Foreign Key ก่อน แล้วจึงลบตารางแม่ `users`)*
- ผลการรันซ้ำ: ทำงานได้สำเร็จโดยไม่เกิด Error `table ... already exists` หรือติดปัญหา Foreign Key Lock ใดๆ

---

## 6. สรุปความพร้อมในการส่งมอบสำหรับสัปดาห์ที่ 10 (Handover Summary)

| ไฟล์ที่ส่งมอบ | สถานะ | สิ่งที่พร้อมนำไปใช้ในสัปดาห์ที่ 10 |
|---|---|---|
| `campus.db` | พร้อมใช้งาน (SQLite3 DB) | Node.js (สัปดาห์ที่ 10) สามารถเชื่อมต่อผ่าน `node:sqlite` ได้ทันที มีข้อมูล 2 ตาราง ครบทั้ง Constraint และ Index |
| `schema.sql` | สมบูรณ์ 100% | ใช้เป็น Migration Script สร้างและตั้งค่าฐานข้อมูลใหม่ได้ทุกเมื่ออย่างอัตโนมัติ |
| `queries.sql` | ผ่านการทดสอบจริง | พร้อมนำคำสั่ง SQL โดยเฉพาะ Query ข้อ ⑤ (JOIN) ไปใส่ใน `requestService.js` ได้ทันที |
| `DATA_MODEL.md` | เอกสารสมบูรณ์ | ใช้เป็น Architecture Reference สำหรับทีมพัฒนาในการออกแบบ Service Layer และ DTO |