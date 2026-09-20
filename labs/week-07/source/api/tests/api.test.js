import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('API Automated Tests (CP16)', () => {

  // เคสที่ 1: GET /api/requests → 200 และได้ array
  describe('GET /api/requests', () => {
    test('คืนรายการทั้งหมด พร้อม status 200 และเป็น Array', async () => {
      const res = await request(app).get('/api/requests');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  // เคสที่ 2: GET /api/requests/:id พบ → 200
  describe('GET /api/requests/:id พบ', () => {
    test('คืนข้อมูลรายการพร้อม status 200', async () => {
      const res = await request(app).get('/api/requests/REQ-001');
      assert.equal(res.status, 200);
      assert.equal(res.body.id, 'REQ-001');
    });
  });

  // เคสที่ 3: GET /api/requests/:id ไม่พบ → 404
  describe('GET /api/requests/:id ไม่พบ', () => {
    test('คืน status 404 เมื่อไม่พบข้อมูล', async () => {
      const res = await request(app).get('/api/requests/REQ-999999');
      assert.equal(res.status, 404);
    });
  });

  // เคสที่ 4: POST ข้อมูลถูกต้อง → 201 และ status เป็น pending
  describe('POST /api/requests ข้อมูลถูกต้อง', () => {
    test('สร้างคำร้องสำเร็จ คืน status 201 และ status="pending"', async () => {
      const res = await request(app)
        .post('/api/requests')
        .send(validRequest);

      assert.equal(res.status, 201);
      assert.equal(res.body.status, 'pending');
      assert.ok(res.body.id);
    });
  });

  // เคสที่ 5: POST ข้อมูลไม่ครบ → 400
  describe('POST /api/requests ข้อมูลไม่ครบ', () => {
    test('ส่งข้อมูลไม่ครบถ้วน ตอบกลับด้วย status 400', async () => {
      const invalidRequest = {
        requesterName: 'A', // ชื่อสั้นเกินไป
        requestType: 'แจ้งซ่อม'
      };

      const res = await request(app)
        .post('/api/requests')
        .send(invalidRequest);

      assert.equal(res.status, 400);
    });
  });

  // เคสที่ 6: CORS header ตอบ origin ที่อนุญาต
  describe('CORS Header Check', () => {
    test('ตอบ origin ที่อนุญาตตรงตามค่าคอนฟิก', async () => {
      const res = await request(app)
        .get('/api/requests')
        .set('Origin', 'http://localhost:5173');

      assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    });
  });

});