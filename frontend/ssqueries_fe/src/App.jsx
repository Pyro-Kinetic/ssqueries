import React, { useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import CreateProfileForm from './components/CreateProfileForm.jsx'

function App() {
  const [view, setView] = useState('login')
  const [flash, setFlash] = useState('')

  const showLogin = () => setView('login')
  const showCreate = () => setView('create')

  const handleCreated = () => {
    setFlash('Profile created successfully. You can now log in.')
    setView('login')
  }

  return (
    <>
      {view === 'login' && (
        <LoginForm
          onShowCreateProfile={showCreate}
          successMessage={flash}
          onClearMessage={() => setFlash('')}
        />
      )}
      {view === 'create' && (
        <CreateProfileForm onSuccess={handleCreated} onShowLogin={showLogin} />
      )}
    </>
  )
}

export default App
