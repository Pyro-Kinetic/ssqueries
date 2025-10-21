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

// CORS configuration - allow only specified origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://pyro-kinetic.github.io'
]

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl/Postman)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}

app.use(cors(corsOptions))

// Handle preflight requests (Express 5 requires a valid path pattern)
app.options('/:path(*)', cors(corsOptions))

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

//api/users/data
app.use('/api/users', usersRouter)

//api/questions/...
app.use('/api/questions', questionsRouter)

//api/answers/...
app.use('/api/answers', answersRouter)

//api/auth/...
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

