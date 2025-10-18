import React, {useEffect, useState} from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm.jsx'
import CreateProfileForm from './components/CreateProfileForm.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {
    const [view, setView] = useState('login')
    const [flash, setFlash] = useState('')
    const [username, setUsername] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const apiBase = 'http://localhost:8000'

    // Check session on an initial load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.get(`${apiBase}/api/auth/session`, {withCredentials: true})
                const {isLoggedIn: logged, username: u} = res.data || {}
                setIsLoggedIn(!!logged)
                setUsername(u || '')
                setView(logged ? 'dashboard' : 'login')
            } catch (e) {
                setIsLoggedIn(false)
                setUsername('')
                setView('login')
            }
        }
        checkSession()
    }, [])

    const showLogin = () => setView('login')
    const showCreate = () => setView('create')
    const showDashboard = async () => {
        // Verify session before showing dashboard
        try {
            const res = await axios.get(`${apiBase}/api/auth/session`, {withCredentials: true})
            if (res?.data?.isLoggedIn) {
                setIsLoggedIn(true)
                setUsername(res.data.username || username)
                setView('dashboard')
            } else {
                setIsLoggedIn(false)
                setUsername('')
                setView('login')
            }
        } catch (e) {
            setIsLoggedIn(false)
            setUsername('')
            setView('login')
        }
    }

    const handleCreated = () => {
        setFlash('Profile created successfully. You can now log in.')
        setView('login')
    }

    const handleLoggedIn = (u) => {
        setIsLoggedIn(true)
        setUsername(u || '')
        setView('dashboard')
    }

    const handleLogout = async () => {
        try {
            await axios.get(`${apiBase}/api/auth/logout/user`, {withCredentials: true})
        } catch (e) {
        } finally {
            setIsLoggedIn(false)
            setUsername('')
            setView('login')
        }
    }

    return (
        <>
            {view === 'login' && (
                <LoginForm
                    onShowCreateProfile={showCreate}
                    onShowDashboard={showDashboard}
                    onLoggedIn={handleLoggedIn}
                    successMessage={flash}
                    onClearMessage={() => setFlash('')}
                />
            )}
            {view === 'create' && (
                <CreateProfileForm onSuccess={handleCreated} onShowLogin={showLogin}/>
            )}
            {view === 'dashboard' && isLoggedIn && (
                <Dashboard username={username} onLogout={handleLogout}/>
            )}
        </>
    )
}

export default App
