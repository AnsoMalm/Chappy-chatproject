import express from 'express';
import { getDb } from '../data/database.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router();

const db = getDb();
const secret = process.env.SECRET || 5050


// Hämta alla meddelande 
router.get('/', async (req, res) => {
	console.log('GET all messages: ');
	await db.read();
	let allMessages = db.data.messages;
	res.send(allMessages);
  });

 
	//ändra ett meddelande 
	router.put('/:id', async (req, res) => {
		
		const id = Number(req.params.id)
		const updatedMessage = req.body
		
		await db.read()
		const index = db.data.messages.findIndex(message => message.id === id)
		
		if(index === -1) {
			res.status(404).send({
				message: "Message not found"
			})
			console.log('Message not found')
			return; 
	}
	db.data.messages[index] = {...db.data.messages[index], ...updatedMessage}
	
	await db.write()
	
	res.status(200).send(db.data.messages[index]);
	console.log('Message updated!')
	
})
export default router
