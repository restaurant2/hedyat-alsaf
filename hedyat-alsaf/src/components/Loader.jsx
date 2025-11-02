import React from 'react'
import { motion } from 'framer-motion'
export default function Loader(){ return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-royal to-gold text-white">
    <motion.div className="w-20 h-20 rounded-full border-4 border-white border-t-deepRed mb-6" animate={{rotate:360}} transition={{repeat:Infinity,duration:1.6,ease:'linear'}}/>
    <motion.h1 initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}} className="text-2xl font-semibold">جاري تحميل هدية الصف 🎁</motion.h1>
  </div>
) }
