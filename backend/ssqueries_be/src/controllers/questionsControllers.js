import {getDBConnection} from "../db/connect.js";

export async function getQuestions(req, res) {

    try {

        const connection = await getDBConnection()
        const result = await connection.execute(`SELECT users.user_id,
                                                        users.username,
                                                        questions.question_id,
                                                        questions.content,
                                                        questions.created_at,
                                                        questions.planet
                                                 FROM users
                                                          JOIN questions ON users.user_id = questions.user_id`)
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