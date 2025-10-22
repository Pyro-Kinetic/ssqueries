import {getDBConnection} from "../db/connect.js";

//api/questions/data
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

        // console.log('Results: ', result[0])
        // console.log('Fields: ', result[1])
        await connection.end()

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

        const connection = await getDBConnection()

        // get userid and username
        const [rows] = await connection.query(`SELECT user_id, username
                                               FROM users
                                               WHERE username = ?
                                               LIMIT 1`, [effectiveUsername])
        const user = rows?.[0]

        if (!user) {
            await connection.end()
            return res.status(404).json({error: 'User not found'})
        }

        // insert question
        const [result] = await connection.query(`INSERT INTO questions (user_id, content, planet, created_at)
                                                 VALUES (?, ?, ?, NOW())`, [user.user_id, content, planet])

        // get inserted question
        const insertedId = result.insertId
        const [qRows] = await connection.query(`SELECT users.user_id,
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
                                                WHERE q.question_id = ? `, [insertedId])
        await connection.end()

        const created = qRows?.[0] || {
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