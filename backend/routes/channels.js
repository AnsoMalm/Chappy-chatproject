import express from 'express'
import { getDb } from '../data/database.js'
import { isValidId } from '../utils/validator.js';

const router = express.Router(); 
const db = getDb()

//Hämta alla kanaler 
router.get('/', async (req, res) => {
	await db.read()
	res.send(db.data.channels)
})

//GET - Få ett meddelande i rätt kanal 
router.get('/:id', async (req, res) => {
	console.log('GET /channels: ID: ')
	if(!isValidId(req.params.id)) {
		res.status(400).send({
			message: "Incorrect value, is must be a number for channelid."
		})
		console.log('Incorrect value, is must be a number for id..')
		return
	}
	let id = Number(req.params.id)
	await db.read()
	let mayBeChannel = db.data.channels.find(channel => channel.id === id); 
	if(!mayBeChannel) {
		res.status(404).send({
			message: "Could not found the correct id to the channel."
		})
		console.log('Could not found the correct id to the channel..')
		return
	}
	await db.write()
	res.status(200).send({
		message: "The right channel - congrats!"
	})
	console.log('Correct channel id - great!')

})
export default router