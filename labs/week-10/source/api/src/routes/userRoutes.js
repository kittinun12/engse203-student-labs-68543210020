import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.resolve(HERE, '../../data/campus.db');

const router = Router();
const db = new DatabaseSync(DB_FILE); 

router.get('/', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, department, email FROM users ORDER BY id').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/requests', (req, res) => {
  try {
    const requests = db.prepare(`
      SELECT r.id, u.name AS requesterName, r.request_type AS requestType,
             r.location, r.details, r.priority, r.status
      FROM requests r
      JOIN users u ON u.id = r.requester_id
      WHERE r.requester_id = ?
      ORDER BY r.id
    `).all(req.params.id);
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;