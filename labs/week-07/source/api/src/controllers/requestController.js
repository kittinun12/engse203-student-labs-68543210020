import * as service from '../services/requestService.js';

export async function listRequests(req, res) {
  const { status } = req.query;
  const data = await service.findAll({ status });
  res.status(200).json(data);
}

export async function getRequest(req, res) {
  const found = await service.findById(req.params.id);
  if (!found) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(200).json(found);
}

export async function createRequest(req, res) {
  const created = await service.create(req.body);
  res.status(201).json(created);
}

export async function updateRequestStatus(req, res) {
  const ALLOWED = ['pending', 'in-progress', 'completed'];
  const { status } = req.body ?? {};

  if (!ALLOWED.includes(status)) {
    return res.status(400).json({ error: 'สถานะต้องเป็น pending, in-progress หรือ completed' });
  }

  const updated = await service.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(200).json(updated);
}

export async function deleteRequest(req, res) {
  const removed = await service.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(204).end();
}