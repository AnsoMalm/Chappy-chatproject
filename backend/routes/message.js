import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';

const router = express.Router();

const db = getDb();

// Hämta alla meddelande 
router.get('/', async (req, res) => {
	console.log('GET all users: ');
	await db.read();
	let messages = db.data.message;
	res.send(messages);
  });

  //Hämta specifikt id från ett visst meddelande 
router.get('/:id', async (req, res) => {
	console.log('GET /users/:id');
	if (!isValidId(req.params.id)) {
	  res.sendStatus(400);
	  console.log('Incorrent value, must be a number for Id..');
	  return;
	}
	let id = Number(req.params.id);
  
	await db.read();
	let mayBeMessage = db.data.message.find(message => message.id === id);
	if (!mayBeMessage) {
	  res.sendStatus(404);
	  console.log('Could not found the correct id to that text-message.. ');
	  return;
	}
	res.status(200).send(mayBeMessage);
	console.log('Here is the result - your message..');
  });


export default router