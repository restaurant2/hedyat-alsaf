// src/pages/Student.jsx
import React, { useEffect, useRef, useState } from 'react'
import { db, storage } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Student({ name, onLogout }) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [status, setStatus] = useState('')
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        // stop tracks
        stream.getTracks().forEach((t) => t.stop())
      }

      mr.start()
      setIsRecording(true)
      setStatus('جاري التسجيل... تحدث الآن 🎙️')
    } catch (e) {
      alert('تعذر الوصول إلى الميكروفون: ' + e.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setStatus('تم إيقاف التسجيل. يمكنك الاستماع ثم رفعه.')
    }
  }

  const uploadRecording = async () => {
    if (!audioURL) return alert('لا يوجد تسجيل لرفعه.')
    setStatus('جاري الرفع إلى السحابة... ⏫')

    // fetch blob back from object URL
    const res = await fetch(audioURL)
    const blob = await res.blob()

    const timestamp = Date.now()
    const safeName = name.replace(/\s+/g, '_')
    const storageRef = ref(storage, `voices/${timestamp}_${safeName}.webm`)

    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)

    await addDoc(collection(db, 'voices'), {
      name,
      url,
      createdAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    })

    setStatus('تم الرفع بنجاح 🎉 شكراً لك!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gold/30 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow border border-gold/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-royal">مرحباً {name} 👋</h2>
          <button onClick={onLogout} className="text-sm text-deepRed underline">تسجيل خروج</button>
        </div>

        <p className="text-gray-600 mt-2">سجل رسالتك الصوتية ثم ارفعها لتصل إلى أستاذك.</p>

        <div className="mt-6 flex gap-3">
          {!isRecording ? (
            <button onClick={startRecording} className="px-4 py-3 bg-deepRed text-white rounded-lg shadow hover:opacity-95">
              🎙️ ابدأ التسجيل
            </button>
          ) : (
            <button onClick={stopRecording} className="px-4 py-3 bg-gray-200 text-gray-900 rounded-lg">
              ⏹️ أوقف التسجيل
            </button>
          )}

          <button
            onClick={uploadRecording}
            disabled={!audioURL}
            className={`px-4 py-3 rounded-lg shadow ${audioURL ? 'bg-royal text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            ⏫ رفع التسجيل
          </button>
        </div>

        {status && <div className="mt-4 text-sm text-royal">{status}</div>}

        <div className="mt-6">
          {audioURL ? (
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="text-sm text-gray-700 mb-2">معاينة تسجيلك:</p>
              <audio controls src={audioURL} className="w-full" />
            </div>
          ) : (
            <p className="text-gray-400">لا يوجد تسجيل بعد.</p>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-600">تم تصميم الموقع من قبل <span className="text-gold font-semibold">محمود ابوقاعود 💎</span></p>
    </div>
  )
}
