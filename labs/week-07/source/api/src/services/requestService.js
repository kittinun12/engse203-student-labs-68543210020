import { readFile } from 'node:fs/promises';

const SEED_PATH = new URL('../../data/initialRequests.json', import.meta.url);

/** ข้อมูลอยู่ในหน่วยความจำของเซิร์ฟเวอร์ — หน่วย 4 จะเปลี่ยนเป็นฐานข้อมูล */
let requests = [];

export async function loadSeed() {
  const raw = await readFile(SEED_PATH, 'utf8');
  requests = JSON.parse(raw);
  return requests;
}

export function findAll({ status } = {}) {
  if (!status) return structuredClone(requests);
  return structuredClone(requests.filter((r) => r.status === status));
}

export function findById(id) {
  const found = requests.find((r) => r.id === id);
  return found ? structuredClone(found) : null;
}

function createId() {
  let id;
  do {
    const time = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    id = `REQ-${time}-${rand}`;
  } while (requests.some((r) => r.id === id));
  return id;
}

export function create(input) {
  const newRequest = {
    id: createId(),
    requesterName: input.requesterName.trim(),
    requestType: input.requestType,
    location: input.location.trim(),
    details: input.details.trim(),
    priority: input.priority,
    status: 'pending',
  };
  requests.push(newRequest);
  return structuredClone(newRequest);
}

export function updateStatus(id, status) {
  // 1. ตรวจสอบค่า status ที่ส่งมา ต้องเป็น 1 ใน 3 ค่านิยามเท่านั้น
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status value');
    error.statusCode = 400; // คืน status 400[cite: 13]
    throw error;
  }

  // 2. ค้นหาคำร้องตาม id[cite: 13]
  const found = requests.find((r) => r.id === id);
  if (!found) {
    const error = new Error('Request not found');
    error.statusCode = 404; // คืน status 404[cite: 13]
    throw error;
  }

  // 3. ปรับเปลี่ยนสถานะ และคืนค่าคำร้องที่อัปเดตแล้ว (status 200)[cite: 13]
  found.status = status;
  return structuredClone(found);
}

export function remove(id) {
  const before = requests.length;
  requests = requests.filter((r) => r.id !== id);
  return requests.length < before;
}