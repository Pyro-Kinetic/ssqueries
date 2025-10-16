import 'dotenv/config'
import express from 'express'
import { usersRouter } from "./routes/users.js";
import { questionsRouter } from "./routes/questions.js";
import { answersRouter } from "./routes/answers.js";

const app = express()
const PORT = process.env.PORT
const secret = process.env.SECRET_KEY

app.use(express.json())

//ssqueries/users
app.use('/api/users', usersRouter)

//ssqueries/questions
app.use('/api/questions', questionsRouter)

// /ssqueries/answers
app.use('/api/answers', answersRouter)

// test
app.get('/', (req, res) => {
    res.json({
        test: 'working'
    })
})

function runServer(server) {
    server.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`)
    }).on('error', (err) => {
        console.error('Failed to start server:', err)
    })
}

runServer(app)

