import React, {useState} from 'react'
import axios from 'axios'
import styles from './LoginForm.module.css'
import astronaut from '../assets/astronaut.svg'

/**
 * LoginForm
 * - Username (text) and Password (password) inputs
 * - Basic client-side validation (password min length 6)
 * - Displays per-field error messages
 * - On submit: calls handleLogin(username, password)
 * - State handled with useState
 * - Styling via CSS Module, centered on the page
 * - Optional: loading indicator and backend API integration
 *
 * Props:
 * - onLogin?: (username: string, password: string) => Promise<any> | any
 * - onShowCreateProfile?: () => void
 * - onShowDashboard?: () => void
 * - apiUrl?: string (default: 'http://localhost:8000/api/auth/login/user')
 */
export default function LoginForm({onLogin, onShowCreateProfile, onShowDashboard, apiUrl = 'http://localhost:8000/api/auth/login/user', successMessage = '', onClearMessage}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({username: '', password: '', form: ''})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const newErrors = {username: '', password: '', form: ''}

        if (!username.trim()) newErrors.username = 'Username is required.'
        if (!password) newErrors.password = 'Password is required.'
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.'

        setErrors(newErrors)
        return !newErrors.username && !newErrors.password
    }

    const handleLogin = async (u, p) => {
        if (onLogin) return onLogin(u, p)

        // Post request to backend
        const res = await axios.post(apiUrl, {username: u, password: p})
        console.log(res?.data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors((prev) => ({...prev, form: ''}))
        if (onClearMessage) onClearMessage()

        if (!validate()) return

        try {
            setLoading(true)
            await handleLogin(username.trim(), password)
        } catch (err) {
            const message = err?.response?.data?.error || err?.message || 'Login failed.'
            setErrors((prev) => ({...prev, form: message}))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.brand}>
                <img src={astronaut} alt="Astronaut" className={styles.brandLogo}/>
                <h1 className={styles.brandTitle}>Solar System Query</h1>
            </header>

            <form className={styles.card} onSubmit={handleSubmit} noValidate>
                {successMessage && <div className={styles.formSuccess}>{successMessage}</div>}
                <h2 className={styles.title}>Sign in</h2>

                <label className={styles.label} htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    className={styles.input}
                    value={username}
                    onChange={(e) => { if (onClearMessage) onClearMessage(); setUsername(e.target.value) }}
                    placeholder="Enter your username"
                    autoComplete="username"
                />
                {errors.username && <div className={styles.error}>{errors.username}</div>}

                <label className={styles.label} htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => { if (onClearMessage) onClearMessage(); setPassword(e.target.value) }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />
                {errors.password && <div className={styles.error}>{errors.password}</div>}

                {errors.form && <div className={styles.formError}>{errors.form}</div>}

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Logging in…' : 'Login'}
                </button>
                <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => onShowCreateProfile && onShowCreateProfile()}
                >
                    Create Profile
                </button>
                <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => onShowDashboard && onShowDashboard()}
                >
                    View Dashboard
                </button>
            </form>
        </div>
    )
}
