import React, {useEffect, useMemo, useState} from 'react'
import 'dotenv/config'
import axios from 'axios'
import styles from './Dashboard.module.css'
import sunPng from '../assets/sun.png'
import mercuryPng from '../assets/mecury.png'
import venusPng from '../assets/venus.png'
import earthPng from '../assets/earth.png'
import marsPng from '../assets/mars.png'
import jupiterPng from '../assets/jupiter.png'
import saturnPng from '../assets/saturn.png'
import uranusPng from '../assets/uranus.png'
import neptunePng from '../assets/neptune.png'
import plutoPng from '../assets/pluto.png'
import PostQuestion from './PostQuestion.jsx'
import AnswerQuestion from './AnswerQuestion.jsx'

/**
 * Dashboard
 * - Shows app title, username, and Logout link
 * - Left sidebar with scrollable categories
 * - Main area shows placeholder text until a category is selected
 * - On category select, fetches questions and answers from backend
 * - Displays questions in chronological order with a toggle to reveal answers
 *
 * Props:
 * - username: string
 * - onLogout?: () => void
 * - apiBase?: string (default 'http://localhost:8000')
 */
export default function Dashboard({username = '', onLogout, apiBase = process.env.REACT_APP_BACKEND_URL}) {
    const CATEGORIES = useMemo(
        () => [
            'Sun', 'Mercury', 'Venus', 'Earth', 'Mars',
            'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
        ],
        []
    )

    const [activeCategory, setActiveCategory] = useState('')
    const [questions, setQuestions] = useState([])
    const [answersByQ, setAnswersByQ] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Category -> icon mapping
    const CATEGORY_ICONS = useMemo(() => ({
        Sun: sunPng,
        Mercury: mercuryPng,
        Venus: venusPng,
        Earth: earthPng,
        Mars: marsPng,
        Jupiter: jupiterPng,
        Saturn: saturnPng,
        Uranus: uranusPng,
        Neptune: neptunePng,
        Pluto: plutoPng,
    }), [])

    // Fetch questions and answers; filtering is done client-side by planet/category
    useEffect(() => {
        let isMounted = true

        async function load() {
            try {
                setLoading(true)
                setError('')

                const [qRes, aRes] = await Promise.all([
                    axios.get(`${apiBase}/api/questions/data`),
                    axios.get(`${apiBase}/api/answers/data`)
                ])

                if (!isMounted) return

                const qs = Array.isArray(qRes.data) ? qRes.data : []

                // Build answers map keyed by question_id
                const ans = Array.isArray(aRes.data) ? aRes.data : []
                const byQ = ans.reduce((acc, row) => {
                    const qid = row.question_id ?? row?.questionId
                    if (!qid) return acc
                    if (!acc[qid]) acc[qid] = []
                    acc[qid].push(row)
                    return acc
                }, {})

                // Normalize/parse created_at into Date for sorting
                const normalizedQs = qs.map(q => ({
                    ...q,
                    created_at: q.created_at ? new Date(q.created_at) : null,
                }))

                setQuestions(normalizedQs)
                setAnswersByQ(byQ)
            } catch (e) {
                if (!isMounted) return
                setError(e?.response?.data?.error || e?.message || 'Failed to load data')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        load()
        return () => {
            isMounted = false
        }
    }, [apiBase])

    const filteredQuestions = useMemo(() => {
        const planet = activeCategory?.toLowerCase()
        const list = questions.filter(q => {
            // q.planet likely matches planet name in lowercase or capitalized
            if (!planet) return false
            if (!q.planet) return false
            return String(q.planet).toLowerCase() === planet
        })

        return list.sort((a, b) => {
            const da = a.created_at ? new Date(a.created_at).getTime() : 0
            const db = b.created_at ? new Date(b.created_at).getTime() : 0
            return da - db
        })
    }, [questions, activeCategory])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <img src={sunPng} alt="Sun" className={styles.brandLogo}/>
                    <h1 className={styles.title}>Solar System Query</h1>
                </div>
                <div className={styles.userArea}>
                    {username && <span className={styles.username}>welcome '{username}'</span>}
                    <button className={styles.logout} onClick={() => onLogout && onLogout()} aria-label="Logout">
                        Logout
                    </button>
                </div>
            </header>

            <div className={styles.body}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}><img src={saturnPng} alt="Saturn"
                                                               className={styles.sidebarIcon}/>Categories
                    </div>
                    <nav className={styles.categoryList}>
                        {CATEGORIES.map(cat => {
                            const icon = CATEGORY_ICONS[cat] || saturnPng
                            return (
                                <button
                                    key={cat}
                                    className={cat === activeCategory ? `${styles.categoryItem} ${styles.active}` : styles.categoryItem}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    <img src={icon} alt="" aria-hidden="true" className={styles.catIcon}/>
                                    <span className={styles.catLabel}>{cat}</span>
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                <main className={styles.content}>
                    {loading && <div className={styles.info}>Loading…</div>}
                    {error && <div className={styles.error}>{error}</div>}

                    {!activeCategory && !loading && !error && (
                        <div className={styles.placeholder}>
                            <h2>Select a Category to view</h2>
                            <p>Choose a celestial body from the left to see questions.</p>
                        </div>
                    )}

                    {activeCategory && !loading && !error && (
                        <section>
                            <h2 className={styles.sectionTitle}>{activeCategory} Questions</h2>

                            <PostQuestion
                                username={username}
                                planet={activeCategory}
                                apiBase={apiBase}
                                onSubmitted={(newQ) => {
                                    const created = {
                                        ...newQ,
                                        created_at: newQ.created_at ? new Date(newQ.created_at) : new Date()
                                    }
                                    setQuestions(prev => [...prev, created])
                                }}
                            />

                            {filteredQuestions.length === 0 ? (
                                <div className={styles.info}>No questions found for this category.</div>
                            ) : (
                                <ul className={styles.questionList}>
                                    {filteredQuestions.map(q => (
                                        <QuestionCard
                                            key={q.question_id || q.id}
                                            question={q}
                                            answers={answersByQ[q.question_id] || []}
                                            username={username}
                                            apiBase={apiBase}
                                            onAnswer={(qid, ans) => {
                                                setAnswersByQ(prev => ({...prev, [qid]: [...(prev[qid] || []), ans]}))
                                            }}
                                        />
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

function QuestionCard({question, answers, username, apiBase, onAnswer}) {
    const [open, setOpen] = useState(false)
    const created = question.created_at ? new Date(question.created_at) : null
    return (
        <li className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <div className={styles.questionText}>{question.content}</div>
                <div className={styles.meta}>
                    {question?.username && <span>by {question.username} • </span>}
                    {created && <time title={created.toISOString()}>{created.toLocaleString()}</time>}
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.answerBtn} onClick={() => setOpen(v => !v)} aria-expanded={open}>
                    {open ? 'Hide Answers' : 'Show Answers'}
                </button>
            </div>
            {open && (
                <div className={styles.answers}>
                    {Array.isArray(answers) && answers.length > 0 ? (
                        answers
                            .slice()
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map(a => (
                                <div key={a.answer_id || `${question.question_id}-a-${Math.random()}`}
                                     className={styles.answerItem}>
                                    <div className={styles.answerText}>{a.answer_content || a.content}</div>
                                    <div className={styles.meta}>
                                        {a?.username && <span>by {a.username} • </span>}
                                        <time>{new Date(a.created_at || Date.now()).toLocaleString()}</time>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className={styles.info}>No answers yet.</div>
                    )}
                    <AnswerQuestion
                        username={username}
                        questionId={question.question_id}
                        apiBase={apiBase}
                        onSubmitted={(ans) => onAnswer && onAnswer(question.question_id, ans)}
                    />
                </div>
            )}
        </li>
    )
}
