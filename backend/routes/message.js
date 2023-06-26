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

export default router
