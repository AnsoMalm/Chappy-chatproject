import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';

const router = express.Router();

const db = getDb();

// Hämta alla användare
router.get('/', async (req, res) => {
  console.log('GET all users: ');
  await db.read();
  let users = db.data.users;
  res.send(users);
});

// hämta användare från sitt id
router.get('/:id', async (req, res) => {
  console.log('GET /users/:id');
  if (!isValidId(req.params.id)) {
    res.sendStatus(400);
    console.log('Incorrent value, must be a number for Id..');
    return;
  }
  let id = Number(req.params.id);

  await db.read();
  let mayBeUsers = db.data.users.find(user => user.id === id);
  if (!mayBeUsers) {
    res.sendStatus(404);
    console.log('Could not found the correct id in the list.. ');
    return;
  }
  res.status(200).send(mayBeUsers);
  console.log('Found the correct user..');
});

// För användare att logga in
router.post('/login', async (req, res) => {
  // body: {username, password}
  await db.read();
  if (!req.body || !req.body.username || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  const users = db.data.users;

  const foundUser = users.find(user => user.username === req.body.username);

  if (!foundUser) {
    console.log('- felaktigt användarnamn');
    res.sendStatus(401);
	return
  }
  if (foundUser.password !== req.body.password) {
    console.log('- felaktigt lösenord');
    res.sendStatus(401);
  }
  await db.write();
});

export default router;