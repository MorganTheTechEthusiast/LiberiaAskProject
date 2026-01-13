

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// Explicitly import process to ensure Node types are correctly identified for cwd()
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // This ensures that process.env.API_KEY is replaced with the actual string during build
      // so that the browser does not throw "process is not defined" errors.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})
