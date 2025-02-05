import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import styleX from 'vite-plugin-stylex'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), styleX()],
  // build options
  build: {
    // dist フォルダに出力
    outDir: 'dist',
    // dist フォルダが存在しない場合は作成
    emptyOutDir: true,
  }
})
