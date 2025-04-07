import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Algorithms-and-Data-Structures---Visualization-Tool/', // ✅ this line is critical
  plugins: [react()],
})
