import {getDBConnection} from "../db/connect.js";

export async function getUsers(req, res) {

    try {

        const pool = getDBConnection()

        const result = await pool.query(`SELECT * FROM users`);
        const users = result.rows
        res.json(users)

        // console.log('Results: ', result[0])
        // console.log('Fields: ', result[1])

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch users',
            details: error.message
        })
    }
}


