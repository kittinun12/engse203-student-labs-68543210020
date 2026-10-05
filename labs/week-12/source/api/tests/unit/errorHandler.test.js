import { describe, test, expect, vi } from 'vitest';
import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('errorHandler middleware', () => {
  test('จัดการ error ทั่วไปและส่งสถานะ 500', () => {
    const err = new Error('Test Server Error');
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });
});