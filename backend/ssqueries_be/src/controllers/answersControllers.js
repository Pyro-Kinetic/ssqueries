import {getDBConnection} from "../db/connect.js";

export async function getAnswers(req, res) {
    try {
        const pool = getDBConnection()
        const result = await pool.query(`SELECT q.question_id as question_id,
                                                q.content     as question_content,
                                                a.user_id     as user_id,
                                                a.answer_id   as answer_id,
                                                a.content     as answer_content,
                                                a.created_at  as created_at,
                                                u.username    as username
                                         FROM questions q
                                                  JOIN answers a ON q.question_id = a.question_id
                                                  JOIN users u ON u.user_id = a.user_id`)
        const answers = result.rows
        res.json(answers)

        // console.log('Result: ', result.rows)

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch answers',
            details: error.message
        })
    }
}

export async function addAnswer(req, res) {
    try {
        let {question_id, content, username} = req.body || {}

        // content check
        if (!question_id || !content) {
            return res.status(400).json({error: 'question_id and content are required'})
        }

        content = String(content).trim()

        // check after trim
        if (!content) return res.status(400).json({error: 'Content field required'})

        // session check
        const sessionUser = req.session?.username
        const effectiveUsername = sessionUser || (username ? String(username).trim() : '')

        if (!effectiveUsername) {
            return res.status(401).json({error: 'Unauthorized: username not found in session'})
        }

        // get user id and name
        const pool = getDBConnection()
        const rows = await pool.query(`SELECT user_id, username
                                               FROM users
                                               WHERE username = $1
                                               LIMIT 1`, [effectiveUsername])
        const user = rows.rows[0]

        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        // insert answer
        const result = await pool.query(`INSERT INTO answers (question_id, user_id, content, created_at)
                                                 VALUES ($1, $2, $3, NOW()) RETURNING answer_id`, [question_id, user.user_id, content])

        // get inserted answer
        const insertedId = result.rows[0].answer_id
        const aRows = await pool.query(`SELECT a.answer_id,
                                                       a.question_id,
                                                       a.content as answer_content,
                                                       a.created_at,
                                                       u.username
                                                FROM answers a
                                                         JOIN users u ON u.user_id = a.user_id
                                                WHERE a.answer_id = $1`, [insertedId])
        return res.status(201).json(aRows.rows[0] || {
            answer_id: insertedId,
            question_id,
            answer_content: content,
            username: user.username
        })

    } catch (error) {
        // console.log('Post Answer Error: ', error)
        res.status(500).json({error: 'Failed to post answer. Please try again.', details: error.message})
    }
}