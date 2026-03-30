import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import session from 'express-session'

// Routers
import {authRouter} from "./routes/auth.js";
import {usersRouter} from "./routes/users.js";
import {answersRouter} from "./routes/answers.js";
import {questionsRouter} from "./routes/questions.js";

// Session store
import { createClient } from 'redis'
import RedisStore from 'connect-redis'

const app = express()
const PORT = process.env.PORT
const secret = process.env.SECRET_KEY

// Ensure correct secure cookies behind proxies (e.g., Railway)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)

// Initialize the session store
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})
redisClient.connect().catch(console.error)

const sessionStore = new RedisStore({
    client: redisClient,
    prefix: "ssqueries:"
})

// CORS configuration - allow only specified origins
const allowedOrigins = [
    // 'http://localhost:3000',
    // 'http://localhost:5173',
    // 'http://127.0.0.1:3000',
    // 'http://127.0.0.1:5173',
    'https://pyro-kinetic.github.io'
]

const isDev = process.env.NODE_ENV !== 'production'
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (isDev) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)

        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
}

// Manuel preflight responder
app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') return next()

    const origin = req.headers.origin
    if (origin && (isDev || allowedOrigins.includes(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        const reqHeaders = req.headers['access-control-request-headers']
        res.setHeader('Access-Control-Allow-Headers', reqHeaders || 'Content-Type, Authorization')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        return res.sendStatus(204)
    }
    return next()
})

// Reflect origin if responses are normal
app.use((req, res, next) => {
    const origin = req.headers.origin

    if (origin && (isDev || allowedOrigins.includes(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
    next()
})

app.use(cors(corsOptions))

app.use(express.json())

app.use(session({
    secret: secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
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

//bad endpoint...
app.use((req, res) => {
    res.status(404).json({message: "Endpoint not found."})
})

function runServer(server) {
    server.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`)
    }).on('error', (err) => {
        console.error('Failed to start server:', err)
    })
}

runServer(app)

