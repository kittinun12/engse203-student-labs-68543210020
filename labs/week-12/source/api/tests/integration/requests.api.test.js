import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

/**
 * Integration test — ยิง HTTP จริงผ่านทุกชั้น: route → controller → service → SQLite
 * vitest.config.js ตั้ง DB_FILE=':memory:' ไว้แล้ว
 */

const app = createApp();
beforeEach(async () => { await loadSeed(); });

const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ', requestType: 'แจ้งซ่อม',
  location: 'C3-401', details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืน array 5 รายการจากข้อมูลตั้งต้น พร้อม 200', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(5);
  });
  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.body[0]).toHaveProperty('requesterName');
    expect(r.body[0]).not.toHaveProperty('requester_id');
  });
  test('กรอง ?status= ทำงาน', async () => {
    const r = await request(app).get('/api/requests?status=pending');
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body.every((x) => x.status === 'pending')).toBe(true);
  });
  test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
    const r = await request(app).get("/api/requests?status=' OR '1'='1");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(0);
  });
});

describe('GET /api/requests/:id', () => {
  test('พบ → 200', async () => {
    const r = await request(app).get('/api/requests/REQ-001');
    expect(r.status).toBe(200);
    expect(r.body.id).toBe('REQ-001');
  });
  test('ไม่พบ → 404', async () => {
    const r = await request(app).get('/api/requests/REQ-999');
    expect(r.status).toBe(404);
  });
});

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป', async () => {
    const r = await request(app).post('/api/requests').send(valid);
    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });
  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ error', async () => {
    const r = await request(app).post('/api/requests').send({ requesterName: 'x' });
    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.details)).toBe(true);
  });
});

describe('PUT /api/requests/:id', () => {
  test('PUT เปลี่ยนสถานะเป็น in-progress → 200 และค่าใหม่ถูกบันทึก', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'in-progress' });
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('in-progress');
  });

  test('PUT สถานะนอกรายการ → 400', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'invalid-status' });
    expect(r.status).toBe(400);
  });
});

describe('DELETE /api/requests/:id', () => {
  test('DELETE รายการที่มีอยู่ → 204 และ GET ซ้ำได้ 404', async () => {
    const delRes = await request(app).delete('/api/requests/REQ-001');
    expect(delRes.status).toBe(204);

    const getRes = await request(app).get('/api/requests/REQ-001');
    expect(getRes.status).toBe(404);
  });

  test('DELETE รายการที่ไม่พบ → 404', async () => {
    const r = await request(app).delete('/api/requests/REQ-999');
    expect(r.status).toBe(404);
  });
});

describe('Regression Tests (CP47)', () => {
  test('BUG #1: ลบรายการตรงกลางแล้วเพิ่มรายการใหม่ → ตอบ 201 และไม่เกิด Error 500', async () => {
    await request(app).delete('/api/requests/REQ-003');
    const r = await request(app).post('/api/requests').send(valid);
    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });

  test('BUG #2: กรองรายการสถานะ in-progress ตอบกลับค่าที่ถูกต้อง', async () => {
    const r = await request(app).get('/api/requests?status=in-progress');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('BUG #3: PUT เปลี่ยนสถานะคำร้องที่ไม่พบ (REQ-999) → ตอบ 404 ไม่ใช่ 500', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-999')
      .send({ status: 'completed' });
    expect(r.status).toBe(404);
  });
});

// ⭐ Challenge: API Coverage Booster (ดัน Coverage ให้ทะลุ >= 85%)
describe('API Coverage Booster — ทดสอบทุกส่วนที่เหลือ', () => {
  test('GET /api/health → ตอบ 200 พร้อมสถานะ DB', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
    expect(r.body).toHaveProperty('status');
  });

  test('GET /api/users → ตอบ 200 และได้ array รายชื่อผู้ใช้', async () => {
    const r = await request(app).get('/api/users');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('GET /api/users/1/requests → ตอบ 200', async () => {
    const r = await request(app).get('/api/users/1/requests');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('GET /api/users/999/requests → ตอบ 200 และคืน array ว่าง', async () => {
    const r = await request(app).get('/api/users/999/requests');
    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });

  test('POST /api/requests โดยใช้ชื่อผู้ใช้ที่มีใน DB แล้ว', async () => {
    const existingUserReq = {
      requesterName: 'สมชาย ใจดี',
      requestType: 'แจ้งซ่อม',
      location: 'ห้อง 101',
      details: 'รายละเอียดสำหรับทดสอบผู้ใช้เดิมที่มีอยู่แล้ว',
      priority: 'normal',
    };
    const r = await request(app).post('/api/requests').send(existingUserReq);
    expect(r.status).toBe(201);
  });

  test('POST /api/requests (ไม่ส่ง body/ส่ง {}) → ตอบ 400', async () => {
    const r = await request(app).post('/api/requests').send({});
    expect(r.status).toBe(400);
  });

  test('PUT /api/requests/:id เปลี่ยนเป็น completed → 200', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('completed');
  });

  test('GET /api/unknown-route → ตอบ 404', async () => {
    const r = await request(app).get('/api/unknown-route');
    expect(r.status).toBe(404);
  });

  test('POST /api/requests ส่ง JSON ที่ syntax พัง → เข้า errorHandler.js', async () => {
    const r = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('{ "requesterName": ');
    expect(r.status).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/requests ส่งประเภทข้อมูลผิดเพื่อให้เกิด Server Error บังคับเข้า errorHandler 500', async () => {
    const invalidData = {
      requesterName: 'ทดสอบ เออร์เรอร์',
      requestType: 'แจ้งซ่อม',
      location: 'C3-401',
      details: 'รายละเอียดยาวพอสมควรจริง',
      priority: 'normal',
    };
    // ส่งค่า array/object ซ้อนในที่ที่ต้องการ string เพื่อบังคับให้ SQLite/Service พังแล้วเข้า Error Handler
    const r = await request(app).post('/api/requests').send({ ...invalidData, requesterName: { bad: 'type' } });
    expect(r.status).toBeGreaterThanOrEqual(400);
  });
});