# B1 · บันทึกการแก้บั๊ก (กรอกให้ครบทั้ง 6 จุด)

> แต่ละบั๊กให้เขียน 4 อย่าง: ไฟล์ · บรรทัด · สาเหตุ (ทำไมทำงานผิด) · แก้อย่างไร
> เขียนด้วยคำของตัวเอง — จุดนี้จะถูกถามใน oral

## บั๊กที่ 1 — อาการ: Console เตือนสีเหลืองเรื่องรายการ
- ไฟล์/บรรทัด: `src/components/RequestList.jsx` บรรทัดที่ 8
- สาเหตุ: มีการใช้ `.map()` แสดงผลรายการ `<RequestCard />` แต่ลืมใส่ prop `key` ทำให้ React แจ้งเตือนเรื่อง unique key prop ใน console
- แก้อย่างไร: ใส่ `key={request.id}` เพิ่มเข้าไปที่คอมโพเนนต์ `<RequestCard />`

## บั๊กที่ 2 — อาการ: ตัวเลข "รอดำเนินการ" ในแผงสรุปไม่ตรงกับที่เห็น
- ไฟล์/บรรทัด: `src/pages/DashboardPage.jsx` บรรทัดที่ 43
- สาเหตุ: การคำนวณค่า `pending` ใน `useMemo` เขียนเงื่อนไขกรองสถานะผิด โดยไปกรองด้วย `request.status === 'completed'` แทนที่จะเป็น `'pending'`
- แก้อย่างไร: แก้ไขเงื่อนไขของ `pending` ให้เป็น `requests.filter((request) => request.status === 'pending').length`

## บั๊กที่ 3 — อาการ: กดตัวกรอง "รอดำเนินการ" แล้วได้รายการที่ไม่ใช่
- ไฟล์/บรรทัด: `src/pages/DashboardPage.jsx` บรรทัดที่ 49
- สาเหตุ: ตัวกรอง `filteredRequests` ใช้เงื่อนไขเปรียบเทียบผิด โดยใช้ `request.status !== statusFilter` ทำให้ได้รายการที่มีสถานะตรงข้ามกับที่เลือก
- แก้อย่างไร: เปลี่ยนเงื่อนไขเปรียบเทียบเป็น `request.status === statusFilter`

## บั๊กที่ 4 — อาการ: เปลี่ยน URL จาก REQ-001 เป็น REQ-002 แล้วข้อมูลไม่เปลี่ยน
- ไฟล์/บรรทัด: `src/pages/RequestDetailPage.jsx` บรรทัดที่ 26
- สาเหตุ: Dependency array ของ `useEffect` ขาดตัวแปร `requestId` ทำให้เมื่อมีการเปลี่ยน URL และค่า Parameter เปลี่ยน แต่ `useEffect` ไม่ถูกเรียกทำงานใหม่เพื่อโหลดข้อมูลของ ID ใหม่
- แก้อย่างไร: เพิ่ม `requestId` เข้าไปใน Dependency Array ของ `useEffect` เป็น `[requestId, reloadKey]`

## บั๊กที่ 5 — อาการ: กด "ลบ" แล้วรายการยังอยู่ ต้องรีเฟรชถึงหาย
- ไฟล์/บรรทัด: `src/pages/DashboardPage.jsx` บรรทัดที่ 56
- สาเหตุ: ฟังก์ชัน `handleDelete` เรียกใช้ `setRequests(requests)` ซึ่งเป็นการนำ state ข้อมูลอันเดิมก่อนลบมาบันทึกซ้ำ ทำให้ UI แสดงผลรายการเดิมไม่ยอมอัปเดตข้อมูลชุดใหม่
- แก้อย่างไร: เปลี่ยนการอัปเดต state เป็น `setRequests(nextRequests)` เพื่อใช้ข้อมูลอัปเดตล่าสุดที่คืนมาจากฟังก์ชัน `deleteRequest`

## บั๊กที่ 6 — อาการ: กด "Reset Demo Data" แล้วหน้าพัง/ว่างเปล่า
- ไฟล์/บรรทัด: `src/pages/DashboardPage.jsx` บรรทัดที่ 65
- สาเหตุ: ฟังก์ชัน `handleReset` เรียกใช้ `setRequests(resetRequests())` โดยไม่ได้ใส่ `await` เพื่อรอผลลัพธ์ข้อมูลจากฟังก์ชัน asynchronous ทำให้ state รับค่าเป็น Promise แทนที่จะเป็น Array ส่งผลให้การทำงานแสดงผลของ React พัง
- แก้อย่างไร: เปลี่ยนเป็น `const resetData = await resetRequests();` แล้วค่อยอัปเดต state ด้วย `setRequests(resetData)`
