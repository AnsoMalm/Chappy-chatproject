import express from 'express';
import dotenv from 'dotenv'
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

const db = getDb();
dotenv.config()
const secret = process.env.SECRET || "ros"

// För användare att logga in
router.post('/', async (req, res) => {
	// body: {username, password}
	await db.read();
	if (!req.body || !req.body.username || !req.body.password) {
	  res.sendStatus(400);
	  return;
	}
	const users = db.data.users;
  
	let foundUser = users.find(user => user.username === req.body.username);
	console.log('Users i databas ', db.data)
  
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

	//Lyckad inloggning 
	const hour = 60 * 60
	const payload = {userId: foundUser.id}
	const options = {expiresIn: 2 * hour}
	let token = jwt.sign(payload, secret, options )
	console.log('Signed JWT ', token)
	let tokenPackage = {token: token}
	res.send(tokenPackage)
  });

  export default router;