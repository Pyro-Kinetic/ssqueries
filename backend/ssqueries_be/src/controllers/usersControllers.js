import {getDBConnection} from "../db/connect.js";

export async function getUsers(req, res) {

    try {

        const connection = await getDBConnection()

        const result = await connection.execute(`SELECT *
                                                 FROM users`);
        const users = result[0].map(row => row)
        res.json(users)

        console.log('Results: ', result[0])
        console.log('Fields: ', result[1])
        connection.end()

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch users',
            details: error.message
        })
    }
}


