import React, {useState} from 'react'
import axios from 'axios'
import styles from './Dashboard.module.css'

export default function AnswerQuestion({username, questionId, apiBase = 'http://localhost:8000', onSubmitted}) {
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setError('')
        const value = content.trim()

        if (!value) {
            setError('Please enter an answer.')
            return
        }

        try {
            setSubmitting(true)

            const res = await axios.post(`${apiBase}/api/answers/add`, {
                question_id: questionId,
                content: value,
                username
            }, {withCredentials: true})

            setContent('')

            if (onSubmitted) onSubmitted(res.data)

        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to submit answer')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{marginTop: 8}}>
            <label htmlFor={`ans-${questionId}`} className={styles.sectionTitle}
                   style={{fontSize: 14, marginBottom: 6}}>Answer</label>
            <input
                id={`ans-${questionId}`}
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your answer..."
                required
                style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text)'
                }}
            />
            <div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 6}}>
                <button type="submit" disabled={submitting} className={styles.answerBtn}>
                    {submitting ? 'Posting…' : 'Post Answer'}
                </button>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        </form>
    )
}
