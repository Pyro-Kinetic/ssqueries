import './config/loadEnv.js'
import {redisStore} from './config/loadRedis.js'
import cors from 'cors'
import express from 'express'
import session from 'express-session'

// Routers
import {authRouter} from "./routes/auth.js";
import {usersRouter} from "./routes/users.js";
import {answersRouter} from "./routes/answers.js";
import {questionsRouter} from "./routes/questions.js";

const app = express()
const PORT = process.env.PORT
const sessionSecret = process.env.SESSION_SECRET

// Ensure correct secure cookies behind proxies (e.g., Railway)
const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const sessionStore = redisStore

// CORS configuration - allow only specified origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://pyro-kinetic.github.io',
].filter(Boolean)
const uniqueOrigins = [...new Set(allowedOrigins)]

console.log('Allowed Origins (initial):', uniqueOrigins);

if (isProduction) {
    app.set('trust proxy', 1)

}

if (!sessionSecret || sessionSecret.length < 64) {
    console.error('Missing or invalid SESSION_SECRET environment variable.')
    process.exit(1)
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Remove the trailing slash from the incoming origin (value)
        const normalizeOrigin = (val) => val.toLowerCase().trim().replace(/\/$/, '');

        const cleanOrigin = normalizeOrigin(origin);

        // Compare the cleaned origin with the unique origins
        const isAllowed = origin === 'null' || uniqueOrigins.some(o => {
            if (!o) return false;
            return normalizeOrigin(o) === cleanOrigin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            console.log('Allowed Origins (initial):', uniqueOrigins);
            console.log('Normalized unique origins:', uniqueOrigins.map(normalizeOrigin));
            console.log('Cleaned incoming origin:', cleanOrigin);
            callback(null, false);
        }
    }, credentials: true, optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(express.json())

app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
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

