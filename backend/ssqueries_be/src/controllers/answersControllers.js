import {getDBConnection} from "../db/connect.js";

export async function getAnswers(req, res){
    try {
        const connection = await getDBConnection()
        const result = await connection.execute(`SELECT * FROM answers`)
        const answers = result[0].map(row => row)
        res.json(answers)

        console.log('Result: ', result[0])
        console.log('Fields: ', result[1])
        connection.end()

    } catch(error){
        return res.status(500).json({
            error: 'Failed to fetch answers',
            details: error.message
        })
    }
}