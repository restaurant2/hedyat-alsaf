// src/pages/Teacher.jsx
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { motion } from 'framer-motion'

const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_5a8f1c0b3a.mp3?filename=peaceful-ambient-110624.mp3'

export default function Teacher() {
  const [voices, setVoices] = useState([])
  const [showSplash, setShowSplash] = useState(true)
  const audioRef = useRef(null)
  const [musicReady, setMusicReady] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'voices'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setVoices(data)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15
      const playAttempt = audioRef.current.play()
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {
          // Autoplay blocked; show a small button
          setMusicReady(false)
        }).then(() => setMusicReady(true))
      }
    }
  }, [audioRef])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gold/20 p-6">
      {/* Background music */}
      <audio ref={audioRef} src={MUSIC_URL} autoPlay loop />

      {showSplash ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-royal mb-3">منور يا استاز خالد ❤️</h1>
            <p className="text-gray-600">هذه هدية صفك — رسائل صوتية صادقة من الطلاب</p>
          </motion.div>
        </div>
      ) : null}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-royal mb-4">🎧 رسائل الطلاب</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {voices.length === 0 ? (
            <div className="text-gray-500">لا توجد تسجيلات بعد.</div>
          ) : (
            voices.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl border border-gold/40 bg-white shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-royal">{v.name}</div>
                  <div className="text-xs text-gray-500">
                    {v.createdAt?.toDate ? v.createdAt.toDate().toLocaleString() : ''}
                  </div>
                </div>
                <audio controls src={v.url} className="w-full" />
              </div>
            ))
          )}
        </div>

        {!musicReady && (
          <button
            onClick={() => { try { audioRef.current?.play() } catch(_){} }}
            className="fixed bottom-4 left-4 bg-royal text-white px-4 py-2 rounded-lg shadow"
          >
            تشغيل الموسيقى 🎵
          </button>
        )}

        <p className="mt-10 text-sm text-center text-gray-600">
          تم تصميم الموقع من قبل <span className="text-gold font-semibold">محمود ابوقاعود 💎</span>
        </p>
      </div>
    </div>
  )
}
