import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ إعداد جاهز للنشر على Vercel بدون تحذيرات
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // مجلد الخرج
    chunkSizeWarningLimit: 1600, // يمنع تحذيرات الحجم
  },
  server: {
    port: 5173, // المنفذ المحلي
    open: true, // يفتح المتصفح تلقائياً أثناء التطوير
  },
})
