import express from 'express'
import { getDb } from '../data/database.js'
import { isValidId } from '../utils/validator.js';

const router = express.Router(); 
const db = getDb()

//GET
router.get('/', async (req, res) => {
	await db.read()
	res.send(db.data.channels)
})

router.get('/:id', async (req, res) => {
	console.log('GET /channels: ID: ')
	if(!isValidId(req.params.id)) {
		res.sendStatus(400);
		console.log('Incorrect value, is must be a number for id..')
		return
	}
	let id = Number(req.params.id)
	await db.read()
	let mayBeChannel = db.data.channels.find(channel => channel.id === id); 
	if(!mayBeChannel) {
		res.sendStatus(404);
		console.log('Could not found the correct id to the channel..')
		return
	}
	await db.write()
	res.status(200).send(mayBeChannel)
	console.log('Correct channel id - great!')

})
export default router