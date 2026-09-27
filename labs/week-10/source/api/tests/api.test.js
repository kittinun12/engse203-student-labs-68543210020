import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

describe('W10 - API Tests', () => {

  // เคสที่ 1: GET /api/requests → 200 และได้ array
  test('1. GET /api/requests → 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  // เคสที่ 2: คืน requesterName ไม่ใช่ requester_id
  test('2. คืน requesterName ในข้อมูล', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    if (res.body.length > 0) {
      assert.ok('requesterName' in res.body[0]);
    }
  });

  // เคสที่ 3: GET /:id พบ → 200 · ไม่พบ → 404
  test('3. GET /:id พบ → 200 · ไม่พบ → 404', async () => {
    const resFound = await request(app).get('/api/requests/REQ-001');
    assert.equal(resFound.status, 200);

    const resNotFound = await request(app).get('/api/requests/NOT-FOUND-999');
    assert.equal(resNotFound.status, 404);
  });

  // เคสที่ 4: POST ถูกต้อง → 201
  test('4. POST ถูกต้อง → 201', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({
        title: 'แจ้งซ่อมไฟ',
        description: 'ไฟห้อง 101 เสีย',
        requesterName: 'Dan'
      });
    assert.equal(res.status, 201);
  });

  // เคสที่ 5: POST ไม่ครบ → 400
  test('5. POST ไม่ครบ → 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({});
    assert.equal(res.status, 400);
  });

  // เคสที่ 6: ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
  test('6. SQL injection ผ่าน ?status= ต้องปลอดภัย', async () => {
    const res = await request(app).get("/api/requests?status=' OR '1'='1");
    assert.ok(res.status === 200 || res.status === 400);
  });

});