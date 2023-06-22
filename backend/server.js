import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'
import userRouter from './routes/users.js'
import messageRouter from './routes/message.js'
import loginRouter from './routes/login.js'
import channelsRouter from './routes/channels.js'

const app = express()
dotenv.config()
const port = process.env.PORT || 5050
console.log('Secret file', process.env.SECRET)

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url},`, req.body)
	next()
})

app.use( cors())
const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '../dist')
app.use(express.static(dist))
app.use('/api', express.json() )


//routes
app.use('/api/users', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/login', loginRouter)
app.use('/api/channels', channelsRouter)

app.get('*', (req, res) => {
	res.sendFile(join(dist, 'index.html'))
})

//starta
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
