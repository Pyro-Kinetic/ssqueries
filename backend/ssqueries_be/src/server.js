import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT
const secret = process.env.SECRET_KEY

app.use(express.json())

const isWorking = {
    type: 'test',
    isWorking: true
}

app.get('/', (req, res) => {
    res.json(isWorking)
})

function runServer(server) {
    server.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`)
    }).on('error', (err) => {
        console.error('Failed to start server:', err)
    })
}

runServer(app)

