import {getDBConnection} from "../db/connect.js";

export async function getQuestions(req, res) {

    try {

        const connection = await getDBConnection()
        const result = await connection.execute(`SELECT *
                                                 FROM questions`)
        const questions = result[0].map(row => row)
        res.json(questions)

        console.log('Results: ', result[0])
        console.log('Fields: ', result[1])
        connection.end()

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch questions',
            details: error.message
        })
    }
}