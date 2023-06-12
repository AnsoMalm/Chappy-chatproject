import express from 'express';
import dotenv from 'dotenv'
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

const db = getDb();
dotenv.config()
const secret = process.env.SECRET

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
	  res.status(401).send({
			message: "felaktigt användarnamn eller lösenord, Vänligen fyll igen."
	  });
	  return
	}
	if (foundUser.password !== req.body.password) {
	  console.log('- felaktigt lösenord');
	  res.status(401).send({
			message: "felaktigt användarnamn eller lösenord, Vänligen fyll igen."
	  });
	  return
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