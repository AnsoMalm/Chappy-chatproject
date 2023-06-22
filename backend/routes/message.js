import express from 'express';
import { getDb } from '../data/database.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router();

const db = getDb();
const secret = process.env.SECRET || 5050

console.log('Databasen är: ', db.data)

// Hämta alla meddelande 
router.get('/', async (req, res) => {
	console.log('GET all messages: ');
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

	  
	
	router.delete('/:id', async (req, res) => {

		let authHeader = req.headers.authorization
		if(!authHeader) {
			res.status(401).send({
				message: "You must have authenticated to delete this message."
			})
			return
		}
		let token = authHeader.replace('Bearer ', '')
		try {
			console.log('Token:', token);
			console.log('Secret:', secret);
			let users = db.data.users
			console.log('Users:', users);
			let decoded = jwt.verify(token, secret)
			console.log('Decoded:', decoded);
			let id = decoded.userId
			let user;
			if(id) {
				user = users.find(u => u.id === id)
			}else {
				let author = decoded.username
				user = users.find(u => u.username === author)
			}
			if(!user) {
				res.status(401).send({
					message: "jwt - User not found."
				})
				return
			}
			// Nu har vi den autentiserade användaren i 'user'
			// Vi kan fortsätta med resten av koden
	
			const messageIndex = db.data.messages.findIndex(m => m.id === parseInt(req.params.id))
			if(messageIndex === -1 ) {
				res.status(404).send({
					message: "Message not found."
				})
				return
			}
			const message = db.data.messages[messageIndex];
			if (message.userId !== user.id) {
			  res.status(403).send({
				message: "Forbidden. You are not allowed to delete this message."
			  });
			  return;
			}

			db.data.messages.splice(messageIndex, 1)
			await db.write()
			res.status(200).send({
				message: "Now you have deleted the message!"
			})
		} catch(error) {
			console.log('Authentication error' + error.message)
			res.status(401).send({
				message: "Unauthorized - please try again later. "
			})
		}
	})
	// //Ta bort ett meddelande 
	// router.delete('/:id', async (req, res ) => {
	// 	let authHeader = req.headers.authorization
	// 	if(!authHeader) {
	// 		res.status(401).send({
	// 			message: "You must have authenticated to delete this message."
	// 		})
	// 		return
	// 	}
	// 	let token = authHeader.replace('Bearer ', '')
	// 	let decoded;
	// 	try {
	// 		decoded = jwt.verify(token, secret)
	// 	} catch(error) {
	// 		console.log('Authentication error' + error.message)
	// 		res.status(401).send({
	// 			message: "Unauthorized - please try again later. "
	// 		})
	// 		return
	// 	}
	// 	let userId = decoded.userId
	// 	let users = db.data.users;
	// 	let user = users.find(u => u.id === userId)
	// 	if(!user) {
	// 		res.status(401).send({
	// 			message: "jwt - User not found."
	// 		})
	// 		return
	// 	}
	// 	const id = Number(req.params.id) 
	// 	if(isNaN(id) || id < 0) {
	// 		res.status(400).send({
	// 			message: "Wrong value - Bad request."
	// 		})
	// 		console.log('Delete message - Bad Request')
	// 		return
	// 	}
	// 	await db.read()
	// 	const index = db.data.messages.findIndex(message => message.id === id)
	// 	if(index === -1) {
	// 		res.status(404).send({
	// 			message: "The message Not found."
	// 		})
	// 		console.log('Delete a message - Not found')
	// 		return
	// 	}
	// 	const message = db.data.messages[index]
	// 	if(message.userId !== req.user.id ) {
	// 		res.status(403).send({
	// 			message: "Forbidden. You are not allowed to delete this message."
	// 		})
	// 		console.log('Delete a message - forbidden. ')
	// 		return
	// 	}
	// 	db.data.messages.splice(index, 1)
	// 	await db.write()
	// 	res.status(200).send({
	// 		message: "Now you have deleted the message!"
	// 	})
	// 	console.log('Now the message is deleted!')
		
		
	// })
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
