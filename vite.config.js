import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/public": "http://localhost:5253/",
      "/api/private": "http://localhost:5253/"
    }
  }
})
