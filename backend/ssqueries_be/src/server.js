import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import {authRouter} from "./routes/auth.js";
import {usersRouter} from "./routes/users.js";
import {answersRouter} from "./routes/answers.js";
import {questionsRouter} from "./routes/questions.js";

const app = express()
const PORT = process.env.PORT
const secret = process.env.SECRET_KEY

app.use(cors())

app.use(express.json())

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//ssqueries/users
app.use('/api/users', usersRouter)

//ssqueries/questions
app.use('/api/questions', questionsRouter)

// /ssqueries/answers
app.use('/api/answers', answersRouter)

//api/auth
app.use('/api/auth', authRouter)


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

