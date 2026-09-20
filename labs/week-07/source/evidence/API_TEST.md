# รายงานผลการทดสอบระบบ API (API Test Report)

**โปรเจกต์:** Campus API (Week 07)
**คำสั่งที่ใช้รันการทดสอบ:** `npm run test`
**เครื่องมือทดสอบ:** Node.js Native Test Runner (`node --test`) & Supertest

---

## 📊 สรุปผลการทดสอบ (Test Summary)

* **รวมเคสทั้งหมด:** 6 เคส
* **ผ่าน (Pass):** 6 ✅
* **ไม่ผ่าน (Fail):** 0 ❌
* **เวลาที่ใช้ทั้งหมด:** 431.171 ms
* **สถานะ:** **พร้อมใช้งาน (All Tests Passed)** 

---

## 📝 รายละเอียดเทสต์เคส (Test Cases)

| # | HTTP Method | Endpoint | รายละเอียดการทดสอบ (Description) | Status Code ที่คาดหวัง | ผลลัพธ์ |
|---|-------------|----------|----------------------------------|------------------------|---------|
| 1 | `GET` | `/api/requests` | คืนรายการทั้งหมดและตรวจสอบว่าข้อมูลเป็น Array | `200 OK` | ✅ ผ่าน |
| 2 | `GET` | `/api/requests/:id` | คืนข้อมูลคำร้องที่ระบุได้อย่างถูกต้อง (กรณีมีข้อมูล) | `200 OK` | ✅ ผ่าน |
| 3 | `GET` | `/api/requests/:id` | ค้นหาข้อมูลคำร้องที่ไม่มีในระบบ | `404 Not Found` | ✅ ผ่าน |
| 4 | `POST` | `/api/requests` | ส่งข้อมูลครบถ้วน ถูกต้อง และตรวจสอบสถานะเริ่มต้น (pending) | `201 Created` | ✅ ผ่าน |
| 5 | `POST` | `/api/requests` | ส่งข้อมูลไม่ครบถ้วนเพื่อทดสอบระบบ Validation | `400 Bad Request` | ✅ ผ่าน |
| 6 | `GET` | `/api/requests` | ตรวจสอบการอนุญาต CORS header (`Access-Control-Allow-Origin`) | `200 OK` | ✅ ผ่าน |

---

## 💻 บันทึกการรันคำสั่ง (Execution Log)

```text
> engse203-week06-campus-api@2.0.0 test
> node --test "tests/*.test.js"

GET /api/requests 200 2.577 ms - 1030
▶ GET /api/requests
  ✔ 1. GET /api/requests คืนรายการทั้งหมด พร้อม status 200 (19.9395ms)
GET /api/requests 200 0.385 ms - 1030
GET /api/requests/REQ-001 200 0.574 ms - 321
  ✔ 2. GET /api/requests/:id คืนข้อมูลคำร้องที่ระบุ พร้อม status 200 (8.9839ms)
GET /api/requests/REQ-INVALID-999 404 0.650 ms - 405
  ✔ 3. GET /api/requests/:id ที่ไม่มีในระบบ ต้องตอบ status 404 (4.6522ms)
POST /api/requests 201 14.981 ms - 258
  ✔ 4. POST /api/requests ส่งข้อมูลถูกต้อง ต้องตอบ 201 และสถานะเป็น pending (20.2282ms)
POST /api/requests 400 0.525 ms - 445
  ✔ 5. POST /api/requests ส่งข้อมูลไม่ครบถ้วน ต้องตอบ status 400 (7.3575ms)
GET /api/requests 200 0.363 ms - 1289
  ✔ 6. CORS header ต้องตอบ Access-Control-Allow-Origin ตามที่อนุญาต (4.517ms)
✔ GET /api/requests (70.1137ms)
ℹ tests 6
ℹ suites 1
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 431.171