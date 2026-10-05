import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  // 🏫 TODO W12-DEBUG (CP47 · BUG #2): เพิ่ม test ที่ใช้ข้อมูลหน้าตาเดียวกับที่ API ส่งมา
  test('นับสถานะ in-progress ถูกต้อง (BUG #2)', () => {
    const mockRequests = [
      { id: 'REQ-001', status: 'pending' },
      { id: 'REQ-002', status: 'in-progress' },
      { id: 'REQ-003', status: 'in-progress' },
      { id: 'REQ-004', status: 'completed' },
    ];

    const result = summarizeRequests(mockRequests);

    expect(result.total).toBe(4);
    expect(result.pending).toBe(1);
    expect(result.inProgress).toBe(2); // 🟢 ต้องนับได้ 2 ตามโจทย์ CP47
    expect(result.completed).toBe(1);
  });
});
