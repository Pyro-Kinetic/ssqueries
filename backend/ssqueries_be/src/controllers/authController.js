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
        const connection = await getDBConnection()

        // SQL query checks if the user is already in the database
        const selectIDQuery = 'SELECT user_id FROM users WHERE username = ?'

        // SQL query execution
        const existingUser = await connection.query(selectIDQuery, [userName])

        if (existingUser[0].length > 0) {
            console.log('User exists: ', existingUser[0], req.body)
            res.status(400).json({error: 'Username already in use'})
            connection.end()
            return
        }

        // Bcrypt hash
        const hashed = await bcrypt.hash(password, 10)

        // SQL query inserts the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)'
        const insertUserQueryValues = [userName, hashed]

        // SQL query execution
        const result = await connection.query(insertUserQuery, insertUserQueryValues)

        // Create express-session for new user
        req.session.userID = result[0].insertId

        res.status(201).json({message: 'User registered'})
        console.log('User added: ', result[0].insertId, req.body)
        connection.end()

    } catch (error) {
        console.error('Registration error: ', error.message)
        res.status(500).json({error: 'Registration failed. Please try again.'})
    }

}