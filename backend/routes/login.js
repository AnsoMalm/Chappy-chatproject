import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';

const router = express.Router();

const db = getDb();

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