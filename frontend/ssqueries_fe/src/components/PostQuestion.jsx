import React, {useState} from 'react'
import 'dotenv/config'
import axios from 'axios'
import styles from './Dashboard.module.css'

export default function PostQuestion({username, planet, apiBase = process.env.REACT_APP_BACKEND_URL, onSubmitted}) {
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setError('')

        const value = content.trim()

        if (!value) {
            setError('Please enter a question.')
            return
        }

        try {
            setSubmitting(true)
            const res = await axios.post(`${apiBase}/api/questions/add`, {
                content: value,
                planet,
                username
            }, {withCredentials: true})

            setContent('')

            if (onSubmitted) onSubmitted(res.data)

        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to submit question')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.placeholder} style={{marginBottom: 16}}>
            <label htmlFor="ask" className={styles.sectionTitle} style={{marginBottom: 8}}>Ask a question</label>
            <input
                id="ask"
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Ask about ${planet}...`}
                required
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text)'
                }}
            />
            <div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 8}}>
                <button type="submit" disabled={submitting} className={styles.answerBtn}>
                    {submitting ? 'Posting…' : 'Post Question'}
                </button>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        </form>
    )
}
