import express from 'express'
import { getDb } from '../data/database.js'
import jwt from 'jsonwebtoken';
import { findMaxIdMessage } from '../utils/validator.js';


const router = express.Router(); 
const db = await getDb()
const secret = process.env.SECRET

//Hämta alla kanaler 
router.get('/', async (req, res) => {
	await db.read()
	res.send(db.data.channels)
})

const authenticateUser = async (req, res, next) => {    
    await db.read()
    let channelId = Number(req.params.channelId)
    const channel = db.data.channels.find(c => c.id === channelId);
 
    if (channel && channel.public) {
        return next();
    }
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
async function checkChannelAccess(req, res, next) {
    await db.read()
    const channelId = Number(req.params.channelId);
    const channel = db.data.channels.find(c => c.id === channelId);
        if (!channel) {
        return res.status(404).send({ 
            message: "Channel not found." 
        });
        }
    
        if (channel.public) {
        next();
        } else {
            authenticateUser(req, res, next)   
    }
}


//Kolla så att man har rätt tillstånd för att kunna komma in på en låst kanal. 
router.get('/:channelId', checkChannelAccess, async (req, res) => {
	await db.read()

		let channelId = Number(req.params.channelId)
		console.log('Channel ID', channelId)

		let messages = db.data.messages;
		let channelMessages = messages.filter(m => m.channelsid === channelId)
		
		res.status(200).send({
			message: "Now you have access to chat-channel, welcome, your are authenticated. ",
			messages: channelMessages
		})
})

router.post('/:channelId/messages', authenticateUser, async (req, res) => {
    try {
        await db.read(); 
        const user = req.user;
        const channelId = Number(req.params.channelId)
        const { content } = req.body;

        const channel = db.data.channels.find(c => c.id === channelId)
        if(!(channel.public && (channelId === 1 || channelId === 2 )) && (!user || (user && !user.channels.includes(channelId)))) {
            res.status(401).send({
                message: "You need to be logged in to post a message."
            })
            return; 
        }

        const messageId = findMaxIdMessage(db.data.messages) + 1
        const userId = user ? user.id : 'guest'; 
  
        // Skapa det nya meddelandet
        const newMessage = {
            id: messageId,
            channelsid: channelId,
            userId: userId,
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
        res.status(500).send({ 
            message: 'Server error' 
        });
    }
})

router.delete('/:channelId/messages/:messageId', authenticateUser, async (req, res) => {
    const messageId = parseInt(req.params.messageId);
    const user = req.user;

    const messageIndex = db.data.messages.findIndex(m => m.id === messageId && m.userId === user.id);

    if (messageIndex === -1) {
        res.status(404).send({ 
            message: "Message not found or you're not the author." 
        });
        return;
    }

    db.data.messages.splice(messageIndex, 1);
    await db.write();

    res.status(200).send({ 
        message: "Message deleted successfully!" 
    });
});


router.put('/:channelId/messages/:messageId', checkChannelAccess,async (req, res) => {
    try {
        // Läs in befintliga meddelanden från databasen
        const messageId = parseInt(req.params.messageId);
        const user = req.user;
        const { content } = req.body;

        const channelId = Number(req.params.channelId)
        const channel = db.data.channels.find(c => c.id === channelId)
        if (!(channel.public && (channelId === 1 || channelId === 2)) && (!user || !user.channels.includes(channelId))) {
            res.status(401).send({
                message: "You need to be inlogged in to edit a message."
            })
            return;
        }
        await db.read();
        const messages = db.data.messages;
        
        // Hitta det meddelande som ska uppdateras
        const message = messages.find((m) => m && m.id === messageId)
            if(!message) {
                res.status(404).send({
                    message: "Message not found."
                })
                return;
            }
            if(message.author && message.author !== user.username) {
                res.status(403).send({
                    message: "You're not the author of this message. "
                })
                return
            }
            if(message.userId && message.userId !== user.id) {
                res.status(403).send({
                    message: "You're not the author of this message."
                })
                return; 
            }
            //uppdatera meddelandet 
            message.content = content; 
            await db.write()

            res.status(200).send({
                message: "Message updated successfully!"
            })
        } catch (error) {
            console.log('Error', error)
            res.status(500).send({
                message: "Server error.."
            })
        }
      });

export default router