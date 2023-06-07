import express from 'express'
import {getDb} from '../data/database.js'

const router = express.Router()

const db = getDb()

router.get('/', async (req, res) => {
	console.log('GET all users: ')
	await db.read()
	res.send(db.data.users)
})
