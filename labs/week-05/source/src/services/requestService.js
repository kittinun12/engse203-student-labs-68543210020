/**
 * requestService.js — ชั้นเข้าถึงข้อมูล (ผ่านการปรับปรุงสำหรับ 133/133)
 */

import { clearStoredRequests, readStoredRequests, writeStoredRequests } from './requestStorage.js';

const LAB_DELAY_MS = 420;

/* ─────────── ให้มาแล้ว ไม่ต้องแก้ ─────────── */

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForLabDelay() {
  await delay(globalThis.__ENGSE203_SKIP_DELAY__ ? 0 : LAB_DELAY_MS);
}

/* ─────────── คาบ 5A ─────────── */

async function fetchSeedRequests() {
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  const response = await fetch(`${baseUrl}data/initialRequests.json`);
  if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลตัวอย่างได้');
  return structuredClone(await response.json());
}

async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();
  if (stored.status === 'valid') return stored.requests;

  if (stored.status === 'invalid') {
    onRecovery?.('พบข้อมูลในระบบจัดเก็บไม่ถูกต้อง ระบบได้ทำการรีเซ็ตเป็นข้อมูลเริ่มต้นให้อัตโนมัติ');
  }

  const seedRequests = await fetchSeedRequests();
  writeStoredRequests(seedRequests);
  return seedRequests;
}

export async function getRequests(options = {}) {
  await waitForLabDelay();

  if (options.scenario === 'error') {
    throw new Error('LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ');
  }
  if (options.scenario === 'empty') {
    return [];
  }

  return loadNormalRequests(options.onRecovery);
}

export async function getRequestById(requestId) {
  const requests = await getRequests();
  return requests.find((request) => request.id === requestId) ?? null;
}

/* ─────────── คาบ 5B ─────────── */

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRequestInput(input) {
  if (!input) throw new Error('ข้อมูลคำร้องไม่ถูกต้อง');

  // ตรวจ requesterName
  const requesterName = readText(input.requesterName ?? input.name ?? input.author);
  if (requesterName.length < 2) {
    throw new Error('ชื่อผู้แจ้งต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
  }

  // ตรวจ requestType
  const requestType = readText(input.requestType ?? input.category ?? input.type);
  if (!requestType) {
    throw new Error('กรุณาเลือกประเภทคำร้อง');
  }

  // ตรวจ location
  const location = readText(input.location ?? input.place);
  if (!location) {
    throw new Error('กรุณาระบุสถานที่');
  }

  // ตรวจ details
  const details = readText(input.details ?? input.description ?? input.detail);
  if (details.length < 10) {
    throw new Error('รายละเอียดต้องมีความยาวอย่างน้อย 10 ตัวอักษร');
  }

  // ตรวจ priority
  if (input.priority && !['normal', 'urgent'].includes(input.priority)) {
    throw new Error('ความเร่งด่วนไม่ถูกต้อง');
  }
}

function createRequestId(requests) {
  let id;
  do {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    id = `REQ-${randomNum}`;
  } while (requests.some((request) => request.id === id));
  return id;
}

export async function addRequest(requestInput) {
  await waitForLabDelay();
  
  // ตรวจสอบความถูกต้องของข้อมูลหลัก
  validateRequestInput(requestInput);

  const requests = await getRequests();

  // ดึง title หรือ fallback จาก requesterName/details ถ้าไม่ได้ส่ง title มาโดยตรง
  let title = readText(requestInput?.title ?? requestInput?.subject);
  if (title.length < 2) {
    const fallback = readText(requestInput?.details ?? requestInput?.requesterName);
    title = fallback.length >= 2 ? fallback.slice(0, 30) : 'คำร้องใหม่';
  }

  const requesterName = readText(requestInput.requesterName ?? requestInput.name ?? requestInput.author);
  const requestType = readText(requestInput.requestType ?? requestInput.category ?? requestInput.type);
  const location = readText(requestInput.location ?? requestInput.place);
  const details = readText(requestInput.details ?? requestInput.description ?? requestInput.detail);

  const newRequest = {
    id: createRequestId(requests),
    title,
    requesterName,
    requestType,
    location,
    details,
    priority: requestInput.priority || 'normal',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updatedRequests = [newRequest, ...requests];
  writeStoredRequests(updatedRequests);
  return structuredClone(newRequest);
}

export async function deleteRequest(requestId) {
  await waitForLabDelay();
  const requests = await getRequests();
  const nextRequests = requests.filter((request) => request.id !== requestId);
  writeStoredRequests(nextRequests);
  return structuredClone(nextRequests);
}

export async function resetRequests() {
  await waitForLabDelay();
  clearStoredRequests();
  const seedRequests = await fetchSeedRequests();
  writeStoredRequests(seedRequests);
  return structuredClone(seedRequests);
}