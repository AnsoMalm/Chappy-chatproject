import express from 'express'
import { getDb } from '../data/database.js'
import { isValidId } from '../utils/validator.js';
import jwt from 'jsonwebtoken';
import { generateUniqueId } from '../utils/generateId.js';


const router = express.Router(); 
const db = getDb()
console.log('Datan från databasen', db.data)
const secret = process.env.SECRET

//Hämta alla kanaler 
router.get('/', async (req, res) => {
	await db.read()
	res.send(db.data.channels)
})

// //GET - Få ett meddelande i rätt kanal 
// router.get('/:id', async (req, res) => {
// 	console.log('GET /channels: ID: ')
// 	if(!isValidId(req.params.id)) {
// 		res.status(400).send({
// 			message: "Incorrect value, is must be a number for channelid."
// 		})
// 		console.log('Incorrect value, is must be a number for id..')
// 		return
// 	}
// 	let id = Number(req.params.id)
// 	await db.read()
// 	let mayBeChannel = db.data.channels.find(channel => channel.id === id); 
// 	if(!mayBeChannel) {
// 		res.status(404).send({
// 			message: "Could not found the correct id to the channel."
// 		})
// 		console.log('Could not found the correct id to the channel..')
// 		return
// 	}
// 	await db.write()
// 	res.status(200).send({
// 		message: "The right channel - congrats!"
// 	})
// 	console.log('Correct channel id - great!')

// })

const authenticateUser = async (req, res, next) => {
    let authHeader = req.headers.authorization
    if(!authHeader) {
        res.status(401).send({
            message: "You must have authenticated to view this chat-channel."
        })
        return
    }
    let token = authHeader.replace('Bearer: ', '')
    try {
        let decoded = jwt.verify(token, secret)
        console.log('Decoded JWT: ', decoded)
        let id = decoded.userId
        let users = db.data.users;
        let user = users.find(u => u.id === id)
        if(!user) {
            res.status(401).send({
                message: "jwt - User not found."
            })
            return
        }
        
        let channelId = Number(req.params.channelId)
        if(!user.channels.includes(channelId)) {
            res.status(403).send({
                message: "Forbidden, You dont have access to this channel."
            })
            return
        }

        req.user = user;
        next();
    } catch(error) {
        console.log('Authentication error' + error.message)
        res.status(401).send({
            message: "Unauthorized - please try again later. "
        })
    }
}
// router.get('/:channelId', authenticateUser, async (req, res) => {
//     // Användaren är nu tillgänglig som req.user tack vare middlewaren
//     const user = req.user;
//     const channelId = Number(req.params.channelId)

//     // Hämta alla meddelanden för den här kanalen
//     const messages = db.data.messages.filter(message => message.channelId === channelId);

//     // Skicka tillbaka meddelandena
//     res.status(200).send(messages);
// })







//Kolla så att man har rätt tillstånd för att kunna komma in på en låst kanal. 
router.get('/:channelId', async (req, res) => {
	await db.read()
	console.log('Starting GET request....')
	let authHeader = req.headers.authorization
	if(!authHeader) {
		res.status(401).send({
			message: "You must have authenticated to view this chat-channel."
		})
		return
	}
	let token = authHeader.replace('Bearer: ', '')
	try {
		let decoded = jwt.verify(token, secret)
		console.log('Decoded JWT: ', decoded)
		let id = decoded.userId
		let users = db.data.users; 
		console.log('Users från database', users)
		let user = users.find(u => u.id === id)
		console.log('Found users ', user)
		if(!user) {
			console.log('User can not be found..')
			res.status(401).send({
				message: "jwt - User not found."
			})
			return
		}
		
		let channelId = Number(req.params.channelId)
		console.log('Channel ID', channelId)
		if(!user.channels.includes(channelId)) {
			res.status(403).send({
				message: "Forbidden, You dont have access to this channel."
			})
			return
		}
		console.log(`User "${user.username}" has access to the chat-channel. `)
		
		let messages = db.data.messages;
		let channelMessages = messages.filter(m => m.channelsid === channelId)
		
		res.status(200).send({
			message: "Now you have access to chat-channel, welcome, your are authenticated. ",
			messages: channelMessages
		})
	} catch(error) {
		console.log('GET / channel-messages error' + error.message)
		res.status(401).send({
			message: "Unauthorized - please try again later. "
		})
	}
})

router.post('/:channelId/messages', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const channelId = Number(req.params.channelId)
        const { content } = req.body;

        // Skapa det nya meddelandet
        const newMessage = {
            id: generateUniqueId(),
            channelId: channelId,
            userId: user.id,
            content: content, 
            timestamp: new Date().toLocaleString()
        }

        // Lägg till det nya meddelandet i databasen
        db.data.messages.push(newMessage);
        await db.write();

        // Skicka tillbaka det nya meddelandet
        res.status(200).send(newMessage);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Server error' });
    }
})

export default router