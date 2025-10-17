import {getDBConnection} from "../db/connect.js";

export async function getAnswers(req, res) {
    try {
        const connection = await getDBConnection()
        const result = await connection.execute(`SELECT q.question_id as question_id,
                                                        q.content     as question_content,
                                                        a.user_id     as user_id,
                                                        a.answer_id   as answer_id,
                                                        a.content     as answer_content,
                                                        a.created_at  as created_at
                                                 FROM questions q
                                                          JOIN answers a ON q.question_id = a.question_id`)
        const answers = result[0].map(row => row)
        res.json(answers)

        console.log('Result: ', result[0])
        console.log('Fields: ', result[1])
        connection.end()

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch answers',
            details: error.message
        })
    }
}