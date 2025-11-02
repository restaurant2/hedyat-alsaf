// src/App.jsx
import React, { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import Student from './pages/Student.jsx'
import Teacher from './pages/Teacher.jsx'
import Loader from './components/Loader.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  if (!user) return <Login setUser={setUser} />

  if (user === 'خالد') return <Teacher />

  return <Student name={user} onLogout={() => setUser(null)} />
}
