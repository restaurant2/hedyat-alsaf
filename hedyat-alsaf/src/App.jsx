import React, { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import Student from './pages/Student.jsx'
import Teacher from './pages/Teacher.jsx'
import Loader from './components/Loader.jsx'

export default function App(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ const t=setTimeout(()=>setLoading(false),2000); return ()=>clearTimeout(t)},[])
  if(loading) return <Loader/>
  if(!user) return <Login setUser={setUser}/>
  if(user.name === 'خالد') return <Teacher user={user}/>
  return <Student user={user} onLogout={()=>setUser(null)}/>
}
