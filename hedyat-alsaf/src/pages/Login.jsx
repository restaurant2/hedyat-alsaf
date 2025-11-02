import React, {useState} from 'react'
import { get, ref } from 'firebase/database'
import { db as rdb } from '../firebase'
export default function Login({setUser}){
  const [name,setName]=useState('')
  const [pass,setPass]=useState('')
  const [loading,setLoading]=useState(false)
  const allowed = [
    'محمود ابوقاعود','محمد محيسن','ثار قسوم','محمد شنير','براهيم دنف','زهيه','وفاء','فاطمه','سناء','شيماء','نبيله','روئيه','نفين','دنه','ياره','نور','خالد'
  ]
  const handle = async ()=>{
    if(!allowed.includes(name.trim())) return alert('الاسم مش موجود')
    setLoading(true)
    try{
      const snapshot = await get(ref(rdb,'users/'+encodeURIComponent(name)))
      const data = snapshot.exists()?snapshot.val():null
      if(data && data.password===pass){
        setUser({name,role:data.role||'student'})
      } else {
        alert('كلمة السر خطأ')
      }
    }catch(e){ alert('خطأ في التحقق') }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-royal to-gold p-6">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-royal">
        <h2 className="text-2xl font-bold mb-4 text-center">🎁 هدية الصف للمربي</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسمك" className="w-full p-3 border rounded mb-3 text-center"/>
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="كلمة السر" type="password" className="w-full p-3 border rounded mb-3 text-center"/>
        <button onClick={handle} disabled={loading} className="w-full py-3 bg-deepRed text-white rounded">{loading? 'جاري...' : 'دخول'}</button>
        <p className="mt-4 text-sm text-gray-500 text-center">تم تصميم الموقع من قبل محمود ابوقاعود 💎</p>
      </div>
    </div>
  )
}
