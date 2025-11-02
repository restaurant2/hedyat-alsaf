// src/components/Loader.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-royal via-white to-gold text-royal">
      <motion.div
        className="w-16 h-16 border-4 border-royal border-t-deepRed rounded-full mb-6"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
      />
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
        className="text-xl font-semibold text-center"
      >
        جاري تحميل هدية الصف 🎁 ...
      </motion.h1>
    </div>
  )
}
