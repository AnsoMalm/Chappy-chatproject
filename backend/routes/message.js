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
	let mayBeMessage = db.data.messages.find(message => message.id === id);
	if (!mayBeMessage) {
	  res.sendStatus(404);
	  console.log('Could not found the correct id to that text-message.. ');
	  return;
	}
	await db.write()
	res.status(200).send(mayBeMessage);
	console.log('Here is the result - your message..');
  });


//Post meddelande - lägga till ett meddelande 
  router.post('/', async (req, res) => {
	console.log('/message/POST - skicka meddelande')
	let addNewMessage = req.body
	
	await db.read()
	addNewMessage.id = Math.floor(Math.random() * 10000)
	db.data.messages.push(addNewMessage)
	await db.write()
	res.send({ id: addNewMessage.id})
  })

  //Ta bort ett meddelande 
  router.delete('/:id', async (req, res ) => {

		const id = Number(req.params.id) 
		if(isNaN(id) || id < 0) {
			res.sendStatus(400)
			console.log('Delete user - Bad Request')
			return
		}
		await db.read()
		const index = db.data.messages.findIndex(message => message.id === id)
		if(index === -1) {
			res.sendStatus(404)
			console.log('Delete a message - Not found')
			return
		}
		db.data.messages.splice(index, 1)
		await db.write()
		res.sendStatus(200)
		console.log('Now the message is deleted!')


  })

  router.put('/:id', async (req, res) => {

	const id = Number(req.params.id)
	const updatedMessage = req.body

	await db.read()
	const index = db.data.messages.findIndex(message => message.id === id)

	if(index === -1) {
		res.sendStatus(404)
		console.log('Message not found')
		return; 
	}
	db.data.messages[index] = {...db.data.messages[index], ...updatedMessage}

	await db.write()
	
	res.status(200).send(db.data.messages[index]);
	console.log('Message updated!')

  })
export default router