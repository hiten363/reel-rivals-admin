import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // react({
    //   babel: {
    //     plugins: [['babel-plugin-react-compiler', {}]]
    //   }
    // })
    react()
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [{ find: '@', replacement: '/src' }]
  }
});
