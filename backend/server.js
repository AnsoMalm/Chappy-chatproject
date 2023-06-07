import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import publicRouter from './routes/public.js'


const app = express()
dotenv.config()
const port = 5253

app.use( cors())
app.use( express.json() )
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url},`, req.body)
	next()
})

app.use('api/public', publicRouter)


app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
