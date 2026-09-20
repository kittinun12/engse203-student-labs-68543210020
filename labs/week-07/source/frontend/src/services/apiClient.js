/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน requestService จะเรียกผ่านตรงนี้
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

/** error ที่รู้ว่ามาจาก API พร้อม status ที่ได้กลับมา — ให้มาแล้ว */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

// ฟังก์ชันสำหรับหน่วงเวลา ก่อนทำ Retry
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Challenge ข้อ 3: apiFetch พร้อมระบบ Retry อัตโนมัติ
 * จะ Retry เฉพาะ Error ที่มี Status 0 (ต่อเซิร์ฟเวอร์ไม่ได้) หรือ 5xx (Server Error)
 * จะไม่ Retry กรณี 4xx (Client Error เช่น 400, 404)
 */
export async function apiFetch(path, options = {}, retries = 3, delay = 500) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    // ① ต่อเซิร์ฟเวอร์ไม่ได้เลย (Status 0)
    if (retries > 0) {
      await sleep(delay);
      return apiFetch(path, options, retries - 1, delay * 2); // Retry[cite: 9]
    }
    throw new ApiError('ติดต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจว่าเปิด API ที่พอร์ต 3001 แล้วหรือยัง', 0);
  }

  // ② ตอบ 4xx หรือ 5xx
  if (!response.ok) {
    // Retry เฉพาะกรณี status 5xx เท่านั้น (ไม่ retry เมื่อได้ 400 หรือ 404)[cite: 9]
    if (response.status >= 500 && retries > 0) {
      await sleep(delay);
      return apiFetch(path, options, retries - 1, delay * 2); // Retry[cite: 9]
    }
    throw new ApiError(await parseError(response), response.status);
  }

  // ③ ตอบ 204 → คืน null
  if (response.status === 204) return null;

  // ④ ตอบ 2xx อื่นๆ
  return response.json();
}