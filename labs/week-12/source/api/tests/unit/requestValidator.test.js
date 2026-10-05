import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล
 * กรณีทดสอบมาจากตาราง TEST_CASES.md (CP44)
 *
 * รัน:  npm test            (ครั้งเดียว)
 *       npm run test:watch  (รันใหม่ทุกครั้งที่บันทึกไฟล์)
 */

// ข้อมูลที่ถูกต้องทุกช่อง — แต่ละ test เปลี่ยนทีละช่องเพื่อให้รู้ว่าพังเพราะอะไร
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });

  // 🏫 TODO W12-UNIT (CP45): กรณีทดสอบรายละเอียดเพิ่มเติม
  test('10 ตัวอักษรพอดี → ผ่าน (ค่าขอบ)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });

  test('11 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });

  test('ช่องว่างล้วน → error', () => {
    expect(validateRequestInput(withField({ details: '          ' }))).not.toEqual([]);
  });
});

// 🏫 TODO W12-UNIT (CP45): กรณีทดสอบ ชื่อผู้แจ้ง (ค่าขอบ 2 ตัวอักษร)
describe('validateRequestInput — ชื่อผู้แจ้ง', () => {
  test('ชื่อ 1 ตัวอักษร → error (ต่ำกว่าขอบ)', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).not.toEqual([]);
  });

  test('ชื่อ 2 ตัวอักษร → ผ่าน (ค่าขอบ)', () => {
    expect(validateRequestInput(withField({ requesterName: 'กข' }))).toEqual([]);
  });
});

// 🏫 TODO W12-UNIT (CP45): กรณีทดสอบ ประเภทคำร้อง และ priority
describe('validateRequestInput — ประเภทคำร้อง และ Priority', () => {
  test('ประเภทคำร้องนอกรายการ → error', () => {
    expect(validateRequestInput(withField({ requestType: 'ประเภทที่ไม่มีในระบบ' }))).not.toEqual([]);
  });

  test('priority "urgent" → ผ่าน', () => {
    expect(validateRequestInput(withField({ priority: 'urgent' }))).toEqual([]);
  });

  test('priority "high" (นอกเหนือจาก normal/urgent) → error', () => {
    expect(validateRequestInput(withField({ priority: 'high' }))).not.toEqual([]);
  });
});

// 🏫 TODO W12-UNIT (CP45): กรณีทดสอบ Input ผิดรูปแบบ
describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([
    ['null', null],
    ['undefined', undefined],
    ['Array', []],
    ['ตัวเลข', 12345],
    ['String', 'not-an-object'],
  ])('input เป็น %s → ควรส่งกลับ error หรือจัดการได้โดยไม่ crash', (_, invalidInput) => {
    const errors = validateRequestInput(invalidInput);
    expect(errors).not.toEqual([]);
  });
});

// 🏫 TODO W12-UNIT (CP45): กรณีทดสอบ isValidStatus
describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('"in-progress" → true', () => {
    expect(isValidStatus('in-progress')).toBe(true);
  });

  test('"completed" → true', () => {
    expect(isValidStatus('completed')).toBe(true);
  });

  test('สถานะไม่ถูกต้อง (เช่น "done" หรือ "invalid_status") → false', () => {
    expect(isValidStatus('done')).toBe(false);
    expect(isValidStatus('invalid_status')).toBe(false);
  });
});