import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import styleX from 'vite-plugin-stylex'

// https://vite.dev/config/
export default defineConfig(() => {
  // GitHub Actions でビルドされた場合は、リポジトリ名を取得
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  return {
    plugins: [react(), styleX()],
    // build options
    build: {
      // dist フォルダに出力
      outDir: 'dist',
      // dist フォルダが存在しない場合は作成
      emptyOutDir: true,
    },
    // base パスを指定
    base: isGitHubActions ? `/${repoName}/` : '/',
  }
})
