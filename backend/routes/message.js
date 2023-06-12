import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId } from '../utils/validator.js';

const router = express.Router();

const db = getDb();

// Hämta alla meddelande 
router.get('/', async (req, res) => {
	console.log('GET all users: ');
	await db.read();
	let allMessages = db.data.messages;
	res.send(allMessages);
  });

  //Hämta specifikt id från ett visst meddelande 
router.get('/channels/:channelId', async (req, res) => {
	console.log('GET/Messages/channel/:channelId..');
	
	const channelId = Number(req.params.channelId)

	if(isNaN(channelId) || channelId < 0) {
		res.status(400).send({
			message: "Felaktigt värde för channelId."
		});
		console.log('Incorrect calue for channelId')
		return; 
	}
	await db.read();
	const messagesForChannel = db.data.messages.filter((message) => message.channelsid === channelId)

	res.status(200).send(messagesForChannel)
	console.log("Hämtade meddelande för kanal: ", channelId)

})
	
	
	//Post meddelande - lägga till ett meddelande 
	router.post('/channels/:channelId', async (req, res) => {
		console.log('/message/POST - skicka meddelande')
		let addNewMessage = {
			...req.body,
			channelId: req.params.id
		}
		if(!addNewMessage.channelId || isNaN(addNewMessage.channelId) || addNewMessage.channelId < 0 ) {
			res.status(400).send({
				message: "Felaktigt värde för channelId."
			})
			console.log('Incorrect value for channelId.')
			return
		}

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
			res.status(400).send({
				message: "Wrong value - Bad request."
			})
			console.log('Delete message - Bad Request')
			return
		}
		await db.read()
		const index = db.data.messages.findIndex(message => message.id === id)
		if(index === -1) {
			res.status(404).send({
				
				message: "The message Not found."
			})
			console.log('Delete a message - Not found')
			return
		}
		db.data.messages.splice(index, 1)
		await db.write()
		res.status(200).send({
			message: "Now you have deleted the message!"
		})
		console.log('Now the message is deleted!')
		
		
	})
	//ändra ett meddelande 
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

//router.get('/:id, async (req, res) => {
//	console.log('GET/ message id...');
// 	if (!isValidId(req.params.id)) {
// 	  res.sendStatus(400);
// 	  console.log('Incorrent value, must be a number for Id..');
// 	  return;
// 	}
// 	let id = Number(req.params.id);
  
// 	await db.read();
// 	let mayBeMessage = db.data.messages.find(message => message.id === id);
// 	if (!mayBeMessage) {
// 	  res.sendStatus(404);
// 	  console.log('Could not found the correct id to that text-message.. ');
// 	  return;
// 	}
// 	await db.write()
// 	res.status(200).send(mayBeMessage);
// 	console.log('Here is the result - your message..');
//   });