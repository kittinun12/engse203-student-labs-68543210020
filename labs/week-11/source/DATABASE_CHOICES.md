# Database Choices & Asynchronous I/O

## การเปรียบเทียบ SQLite / NoSQL / Relational DB
- **SQLite**: เป็น Relational Database แบบ Serverless ที่เก็บข้อมูลไว้ในไฟล์เดียว เหมาะกับการทดสอบ พัฒนา หรือแอปพลิเคชันขนาดเล็กถึงปานกลาง
- **NoSQL**: เหมาะสำหรับข้อมูลที่ไม่มีโครงสร้างตายตัว (Unstructured Data) และต้องการขยายระบบแบบ Horizontal Scaling ได้ง่าย
- **Relational DB**: เหมาะสำหรับระบบขนาดใหญ่ที่มีโครงสร้างและความสัมพันธ์ของข้อมูลซับซ้อน และต้องการความถูกต้องของข้อมูลสูง (ACID Compliance)

## ทำไมต้องใช้ Async I/O ในการจัดการ Database?
การใช้ Asynchronous I/O (async/await หรือ Promises) ช่วยไม่ให้ Thread หลักของ Node.js ถูกบล็อก (Non-blocking I/O) ขณะรออ่าน/เขียนข้อมูลจากฐานข้อมูล ทำให้ Server สามารถสลับไปรับและตอบสนอง Request อื่นๆ ได้พร้อมกันอย่างมีประสิทธิภาพ