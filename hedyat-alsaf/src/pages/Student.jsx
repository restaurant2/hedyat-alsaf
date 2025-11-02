import React, {useRef, useState, useEffect} from 'react'
import { storage, db } from '../firebase'
import { ref as sref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref, push, set } from 'firebase/database'

export default function Student({user, onLogout}){
  const [isRecording,setIsRecording]=useState(false)
  const [audioURL,setAudioURL]=useState(null)
  const mediaRef=useRef(null)
  const chunks=useRef([])
  useEffect(()=>{ return ()=>{ if(mediaRef.current && mediaRef.current.state!=='inactive') mediaRef.current.stop() } },[])

  const start = async ()=>{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true})
    const mr=new MediaRecorder(stream)
    mediaRef.current=mr; chunks.current=[]
    mr.ondataavailable = e=>{ if(e.data.size>0) chunks.current.push(e.data) }
    mr.onstop = ()=>{ const blob=new Blob(chunks.current,{type:'audio/webm'}); setAudioURL(URL.createObjectURL(blob)); stream.getTracks().forEach(t=>t.stop()) }
    mr.start(); setIsRecording(true)
  }
  const stop = ()=>{ if(mediaRef.current && mediaRef.current.state!=='inactive'){ mediaRef.current.stop(); setIsRecording(false) } }
  const upload = async ()=>{
    if(!audioURL) return alert('لا يوجد تسجيل'); 
    const res = await fetch(audioURL); const blob = await res.blob()
    const key = Date.now()
    const filename = f"voices/{key}_{user.name.replace(/\s+/g,'_')}.webm"
    const storageRef = sref(storage, filename)
    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)
    const r = ref(db,'voices'); const newRef = push(r)
    await set(newRef,{ name:user.name, url, createdAt: Date.now() })
    const a=new Audio('/ping.mp3'); a.play().catch(()=>{})
    alert('تم الحفظ بنجاح')
    setAudioURL(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gold/20 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-royal">مرحباً {user.name}</h2>
          <button onClick={onLogout} className="text-sm text-deepRed underline">تسجيل خروج</button>
        </div>
        <p className="text-gray-600">سجل رسالتك ثم احفظها لتصل إلى أستاذك.</p>
        <div className="mt-6 flex gap-3">
          {!isRecording? <button onClick={start} className="px-4 py-3 bg-deepRed text-white rounded">🎙️ ابدأ التسجيل</button> :
          <button onClick={stop} className="px-4 py-3 bg-gray-200 rounded">⏹️ إيقاف</button>}
          <button onClick={upload} className={`px-4 py-3 rounded ${audioURL? 'bg-royal text-white':'bg-gray-200 text-gray-400'}`} disabled={!audioURL}>⏫ حفظ ورفع</button>
        </div>
        <div className="mt-6">
          {audioURL? <div className="p-4 bg-gray-50 rounded"><p className="text-sm text-gray-700 mb-2">معاينة:</p><audio controls src={audioURL} className="w-full"/></div> : <p className="text-gray-400">لا يوجد تسجيل بعد.</p>}
        </div>
      </div>
      <p className="mt-6 text-center text-gray-600">تم تصميم الموقع من قبل محمود ابوقاعود 💎</p>
    </div>
  )
}
