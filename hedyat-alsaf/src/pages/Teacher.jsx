import React, {useEffect, useState, useRef} from 'react'
import { db, storage } from '../firebase'
import { ref, onValue, remove } from 'firebase/database'
import { ref as sref, deleteObject } from 'firebase/storage'

export default function Teacher({user}){
  const [voices,setVoices]=useState([])
  const audioRef=useRef(null)
  useEffect(()=>{
    const r = ref(db,'voices')
    onValue(r,snap=>{
      const val = snap.val()||{}
      const arr = Object.keys(val).reverse().map(k=>({id:k,...val[k]}))
      setVoices(arr)
    })
  },[])

  const isAdmin = user && user.name==='محمود ابوقاعود'
  const handleDelete = async (item)=>{
    if(!confirm('هل تريد حذف هذا التسجيل؟')) return
    try{
      const parts = item.url.split('/o/')[1]
      const decoded = parts ? decodeURIComponent(parts.split('?')[0]) : null
      if(decoded){ const s = sref(storage, decoded); await deleteObject(s) }
    }catch(e){ console.warn('delete storage failed',e) }
    await remove(ref(db,'voices/'+item.id))
  }

  const downloadAll = async ()=>{
    alert('سيتم تنزيل كل الملفات كـ ZIP (قيد التنفيذ)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gold/20 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-royal mb-4">🎧 رسائل الطلاب</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {voices.length===0? <div className="text-gray-500">لا توجد تسجيلات بعد.</div> :
            voices.map(v=>(
              <div key={v.id} className="p-4 rounded-2xl border border-gold/40 bg-white shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-royal">{v.name}</div>
                  <div className="text-xs text-gray-500">{new Date(v.createdAt).toLocaleString()}</div>
                </div>
                <audio controls src={v.url} className="w-full" onPlay={()=>{ try{ audioRef.current.pause() }catch{} }} />
                {isAdmin && <div className="mt-3 flex gap-2"><button onClick={()=>handleDelete(v)} className="px-3 py-1 bg-red-100 rounded text-sm">حذف</button></div>}
              </div>
            ))
          }
        </div>
        {isAdmin && <div className="mt-6"><button onClick={downloadAll} className="px-4 py-2 bg-royal text-white rounded">تحميل جميع التسجيلات</button></div>}
        <p className="mt-10 text-sm text-center text-gray-600">تم تصميم الموقع من قبل محمود ابوقاعود 💎</p>
      </div>
    </div>
  )
}
