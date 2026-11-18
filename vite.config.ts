import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 默认 base '/'，兼容 Vercel 默认构建
export default defineConfig({
  plugins: [react()],
})
