import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/users.js'
import messageRouter from './routes/message.js'


const app = express()
dotenv.config()
const port = process.env.PORT || 5050

app.use( cors())
app.use( express.json() )
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url},`, req.body)
	next()
})

//routes
app.use('/users', userRouter)
app.use('/message', messageRouter)


app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
