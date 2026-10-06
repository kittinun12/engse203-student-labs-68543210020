import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { tokenFor, loginAsStaff } from '../helpers/auth.js';

const app = createApp();

beforeEach(async () => {
  await loadSeed();
});

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@rmutl.ac.th', password: 'staff1234' });

    expect(r.status).toBe(200);
    expect(r.body).toHaveProperty('token');
    expect(r.body.token.split('.')).toHaveLength(3);
  });

  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@rmutl.ac.th', password: 'wrong' });

    expect(r.status).toBe(401);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  // 🏫 CP51: เพิ่ม Test ตรวจสอบสิทธิ์ (401 vs 403)
  test('token ของคนไม่ใช่เจ้าหน้าที่ (requester) → 403', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${tokenFor('requester')}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(403);
  });

  test('token ปลอม (secret อื่น) → 401', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${tokenFor('staff', 'not-the-real-secret')}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  test('เจ้าหน้าที่ PUT → 200 และ DELETE → 204', async () => {
    const token = await loginAsStaff(app);
    const authHeader = { Authorization: `Bearer ${token}` };

    const putRes = await request(app)
      .put('/api/requests/REQ-001')
      .set(authHeader)
      .send({ status: 'completed' });
    expect(putRes.status).toBe(200);

    const deleteRes = await request(app)
      .delete('/api/requests/REQ-001')
      .set(authHeader);
    expect(deleteRes.status).toBe(204);
  });
});