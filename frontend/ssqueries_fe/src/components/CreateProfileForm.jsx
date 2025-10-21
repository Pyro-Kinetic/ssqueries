import axios from 'axios'
import React, {useState} from 'react'
import styles from './CreateProfileForm.module.css'
import astronaut from '../assets/astronaut.svg'

/**
 * CreateProfileForm
 * - Username (text) and Password + Confirm Password inputs
 * - Client-side validation:
 *   - Username required and /^[a-zA-Z0-9_-]{1,20}$/
 *   - Password required, min 8, at least one special character
 *   - Confirm matches password
 * - On submit: calls handleCreateProfile(username, password)
 * - Styling via CSS Module, centered layout
 * - Optional: loading indicator and backend integration
 *
 * Props:
 * - onCreate?: (username: string, password: string) => Promise<any> | any
 * - apiUrl?: string (default: 'http://localhost:8000/api/auth/register/user')
 */
export default function CreateProfileForm({
                                              onCreate,
                                              apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register/user`,
                                              onSuccess,
                                              onShowLogin
                                          }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState({username: '', password: '', confirm: '', form: ''})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const next = {username: '', password: '', confirm: '', form: ''}

        const trimmed = username.trim()
        if (!trimmed) next.username = 'Username is required.'
        else if (!/^[a-zA-Z0-9_-]{1,20}$/.test(trimmed)) next.username = 'Use 1-20 letters, numbers, _ or -.'

        if (!password) next.password = 'Password is required.'
        else if (password.length < 8) next.password = 'Password must be at least 8 characters.'
        else if (!/[!@#$%^&*(),.?":{}|<>\[\];'`~\\/+=_-]/.test(password)) next.password = 'Include at least one special character.'

        if (!confirm) next.confirm = 'Please confirm your password.'
        else if (password && confirm !== password) next.confirm = 'Passwords do not match.'

        setErrors(next)
        return !next.username && !next.password && !next.confirm
    }

    const handleCreateProfile = async (u, p) => {
        if (onCreate) return onCreate(u, p)

        // Backend expects { userName, password }
        const res = await axios.post(apiUrl, {userName: u, password: p})
        console.log(res?.data)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrors((prev) => ({...prev, form: ''}))

        if (!validate()) return

        try {
            setLoading(true)
            await handleCreateProfile(username.trim(), password)
            if (onSuccess) onSuccess()
        } catch (err) {
            const message = err?.response?.data?.error || err?.message || 'Profile creation failed.'
            setErrors((prev) => ({...prev, form: message}))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.brand}>
                <img src={astronaut} alt="Astronaut" className={styles.brandLogo}/>
                <h1 className={styles.brandTitle}>Solar System Queries</h1>
            </header>

            <form className={styles.card} onSubmit={onSubmit} noValidate>
                <h2 className={styles.title}>Create New Profile</h2>

                <label htmlFor="username" className={styles.label}>Username</label>
                <input
                    id="username"
                    type="text"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    autoComplete="username"
                />
                <div className={styles.hint}>1-20 characters: letters, numbers, _ or -</div>
                {errors.username && <div className={styles.error}>{errors.username}</div>}

                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    id="password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                />
                <div className={styles.hint}>At least 8 characters including one special character</div>
                {errors.password && <div className={styles.error}>{errors.password}</div>}

                <label htmlFor="confirm" className={styles.label}>Confirm Password</label>
                <input
                    id="confirm"
                    type="password"
                    className={styles.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                />
                {errors.confirm && <div className={styles.error}>{errors.confirm}</div>}

                {errors.form && <div className={styles.formError}>{errors.form}</div>}

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Creating…' : 'Create Profile'}
                </button>
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => onShowLogin && onShowLogin()}
                >
                    Back to Login
                </button>
            </form>
        </div>
    )
}
