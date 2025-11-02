// src/pages/Login.jsx
import React, { useState } from 'react'

const allowedNames = [
  'محمود ابوقاعود',
  'محمد محيسن',
  'ثار قسوم',
  'محمد شنير',
  'براهيم دنف',
  'زهيه',
  'وفاء',
  'فاطمه',
  'سناء',
  'شيماء',
  'نبيله',
  'روئيه',
  'نفين',
  'دنه',
  'ياره',
  'خالد',
]

export default function Login({ setUser }) {
  const [name, setName] = useState('')

  const handleLogin = () => {
    if (allowedNames.includes(name.trim())) {
      setUser(name.trim())
    } else {
      alert('الاسم غير مسموح، يرجى اختيار اسمك الصحيح من القائمة.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-white to-gold flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-deepRed mb-6 text-center">🎁 هدية صفكم لمربيكم</h1>
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 w-full max-w-md border border-gold/40">
        <label className="block mb-2 text-royal font-medium text-center">اختر اسمك</label>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 text-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">— اختر اسمك —</option>
          {allowedNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <button
          onClick={handleLogin}
          className="mt-6 bg-deepRed text-white px-8 py-3 rounded-lg text-lg w-full hover:opacity-95 transition shadow"
        >
          دخول
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-600">
        تم تصميم الموقع من قبل <span className="font-semibold text-gold">محمود ابوقاعود 💎</span>
      </p>
    </div>
  )
}
