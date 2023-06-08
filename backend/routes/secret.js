import express from 'express';
import dotenv from 'dotenv'
import { getDb } from '../data/database.js';
import jwt from 'jsonwebtoken'
dotenv.config()
const router = express.Router();
const secret = "mySecret"
const db = getDb();


	//secret 
	router.get('/', (req, res) => {
		let authHeader = req.headers.authorization;
		console.log('Secret 1', authHeader)
		if (!authHeader) {
			res.status(401).send({
				message: 'Du måste vara inloggad!'})
			return
		}
		let token = authHeader.replace('Bearer ', '')
		console.log('Token,' ,token)
		try {
			let decoded = jwt.verify(token, secret)
			let userId = decoded.userId
			let user = db.data.users.find(user => user.id === userId)
			console.log(`User "${user.username} has access to secret data`)
			res.send({
				message: 'This is secret data. Because you are authenticated'
			})
		} catch(error) {
			console.log('GET / secret error: ' + error.message) 
			res.sendStatus(401)
		}
		
	})


export default router