import {getDBConnection} from "../db/connect.js";
import bcrypt from 'bcryptjs'

// import validator from 'validator'

export async function registerUser(req, res) {

    let {userName, password} = req.body

    // Check required fields
    if (!userName || !password) {
        return res.status(400).json({error: 'All fields are required'})
    }

    // Trim username
    userName = userName.trim()

    // Regex username
    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(userName)) {
        return res.status(400).json({error: 'Username must be 1-20 characters, using letters, numbers, _ or -'})
    }

    // Email validator
    // if (!validator.isEmail(email)) {
    //     return res.status(400).json({error: 'Invalid email format'})
    // }

    try {

        // DB Connection
        const pool = getDBConnection()

        // SQL query checks if the user is already in the database
        const selectIDQuery = 'SELECT user_id FROM users WHERE username = $1'

        // SQL query execution
        const existingUser = await pool.query(selectIDQuery, [userName])

        if (existingUser.rows.length > 0) {
            // console.log('User exists: ', existingUser.rows, req.body)
            res.status(400).json({error: 'Username already in use'})
            return
        }

        // Bcrypt hash
        const hashed = await bcrypt.hash(password, 10)

        // SQL query inserts the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id'
        const insertUserQueryValues = [userName, hashed]

        // SQL query execution
        const result = await pool.query(insertUserQuery, insertUserQueryValues)
        const newUserId = result.rows[0].user_id

        // Create session for the new user
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error: ', err)
                return res.status(500).json({error: 'Registration failed. Please try again.'})
            }
            req.session.userId = newUserId
            req.session.username = userName
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Session save error: ', saveErr)
                    return res.status(500).json({error: 'Registration failed. Please try again.'})
                }
                return res.status(201).json({message: 'User registered', registered: true})
            })
        })
        // console.log('User added: ', result[0].insertId, req.body, 'Session: ', req.session)

    } catch (error) {
        console.error('Registration error: ', error.message)
        res.status(500).json({error: 'Registration failed. Please try again.'})
    }

}

export async function loginUser(req, res) {
    let {username, password} = req.body

    // Checks login parameters
    if (!username || !password) {
        return res.status(400).json({error: 'All fields are required', isLoggedIn: false})
    }

    // Trims username
    username = username.trim()

    try {

        // DB connection and query select statement
        const pool = getDBConnection()
        const sqlQuery = 'SELECT * FROM users WHERE username = $1'

        const result = await pool.query(sqlQuery, [username])
        const user = result.rows[0]

        // Checks if user is valid
        if (!user) {
            res.status(401).json({error: 'Invalid credentials', isLoggedIn: false})
            return
        }

        // Checks if password is valid
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            res.status(401).json({error: 'Invalid credentials', isLoggedIn: false})
            return
        }

        // Regenerate session for logged in user
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error (login):', err)
                return res.status(500).json({error: 'Login failed. Please try again.', isLoggedIn: false})
            }
            req.session.userId = user.user_id
            req.session.username = user.username
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Session save error (login):', saveErr)
                    return res.status(500).json({error: 'Login failed. Please try again.', isLoggedIn: false})
                }
                return res.json({message: 'Logged in', isLoggedIn: true, username: user.username})
            })
        })
        // console.log(`Success: ${user.username} is logged in.`)

    } catch (err) {
        console.error('Login error:', err.message)
        res.status(500).json({error: 'Login failed. Please try again.', isLoggedIn: false})
    }
}

export async function logoutUser(req, res) {
    req.session.destroy(() => {
        res.json({message: 'Logged out', isLoggedIn: false})
    })
}

export async function sessionStatus(req, res) {
    try {
        const isLoggedIn = !!req.session?.userId
        const username = req.session?.username || null
        res.json({isLoggedIn, username})
    } catch (e) {
        res.status(500).json({isLoggedIn: false})
    }
}