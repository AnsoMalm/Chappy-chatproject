import express from 'express';
import { getDb } from '../data/database.js';

const router = express.Router();

const db = getDb();

// Hämta alla meddelande 
router.get('/', async (req, res) => {
	console.log('GET all users: ');
	await db.read();
	let allMessages = db.data.messages;
	res.send(allMessages);
  });

  //Hämta meddelande från en kanal
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
	
	
	//Post meddelande - lägga till ett meddelande i en kanal 
	router.post('/channels/:channelId', async (req, res) => {
		console.log('/message/POST - skicka meddelande')
		const channelId = Number(req.params.channelId)
		const usersId = req.body.userId
		const content = req.body.content 
	
		if(isNaN(channelId) || channelId < 0) {
			res.status(400).send({
				message: "Wrong value, for channelId."
			})
			console.log('Incorrect value for channelId')
			return; 
		}
		await db.read()

		const channel = db.data.channels.find((channel) => channel.id === channelId)
		if(!channel) {
			res.status(400).send({
				message: "Channel not found"
			})
			console.log("channel not found")
			return
		}
		const user = db.data.users.find((user) => user.id === usersId)
		if(!user) {
			res.status(400).send({
				message: "User not found", 
			})
			console.log("User not found")
			return
		}
		const messagesForChannel = db.data.messages.filter((message) => message.channelsid === channelId)

		const generateUniqueId = () => {
			const maxId = messagesForChannel.reduce((max, message) => Math.max(max, message.id), 0)
			return maxId + 1
		}
		let newMessage = {
			id: generateUniqueId(), 
			channelsid: channelId, 
			author: user.username, 
			content: content,
			timestamp: new Date().toLocaleString() 
		}

		db.data.messages.push(newMessage)
		await db.write()

		res.send({ id: newMessage.id})

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
