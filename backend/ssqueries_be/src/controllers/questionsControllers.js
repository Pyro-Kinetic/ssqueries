import {getDBConnection} from "../db/connect.js";

//api/questions/data
export async function getQuestions(req, res) {

    try {

        const pool = getDBConnection()
        const result = await pool.query(`SELECT users.user_id,
                                                users.username,
                                                questions.question_id,
                                                questions.content,
                                                questions.created_at,
                                                questions.planet
                                         FROM users
                                                  JOIN questions ON users.user_id = questions.user_id
                                         ORDER BY questions.created_at DESC`)
        const questions = result.rows
        res.json(questions)

        // console.log('Results: ', result.rows)

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch questions',
            details: error.message
        })
    }
}

//api/questions/add
export async function addQuestion(req, res) {
    try {
        let {content, planet, username} = req.body || {}

        // content check
        if (!content || !planet) {
            return res.status(400).json({error: 'Content and planet are required'})
        }

        content = String(content).trim()
        planet = String(planet).trim()

        // check again after trim
        if (!content) {
            return res.status(400).json({error: 'Content is required'})
        }

        // session check
        const sessionUser = req.session?.username
        const effectiveUsername = sessionUser || (username ? String(username).trim() : '')

        if (!effectiveUsername) {
            return res.status(401).json({error: 'Unauthorized: username not found'})
        }

        const pool = getDBConnection()

        // get userid and username
        const rows = await pool.query(`SELECT user_id, username
                                               FROM users
                                               WHERE username = $1
                                               LIMIT 1`, [effectiveUsername])
        const user = rows.rows[0]

        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        // insert question
        const result = await pool.query(`INSERT INTO questions (user_id, content, planet, created_at)
                                                 VALUES ($1, $2, $3, NOW()) RETURNING question_id`, [user.user_id, content, planet])

        // get inserted question
        const insertedId = result.rows[0].question_id
        const qRows = await pool.query(`SELECT users.user_id,
                                                       users.username,
                                                       q.question_id,
                                                       q.content,
                                                       q.created_at,
                                                       q.planet
                                                FROM questions q
                                                         JOIN
                                                     users
                                                     ON
                                                         users.user_id = q.user_id
                                                WHERE q.question_id = $1 `, [insertedId])

        const created = qRows.rows[0] || {
            question_id: insertedId,
            content,
            planet,
            username: user.username,
        }

        return res.status(201).json(created)

    } catch (error) {
        // console.log('Post Question Error: ', error)
        res.status(500).json({
            error: 'Failed to post question. Please try again.',
            details: error.message
        })
    }
}

//api/questions/delete/:id
export async function deleteQuestion(req, res) {
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).json({error: 'Question ID is required'})
        }

        const pool = getDBConnection()

        // First, delete all answers associated with this question
        await pool.query(`DELETE FROM answers WHERE question_id = $1`, [id])

        // Then, delete the question
        const result = await pool.query(`DELETE FROM questions WHERE question_id = $1`, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Question not found'})
        }

        return res.json({message: 'Question and its answers deleted successfully'})

    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete question',
            details: error.message
        })
    }
}