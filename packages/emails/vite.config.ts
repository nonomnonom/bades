import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/emails',

  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src') + '/',
      'src/': path.resolve(__dirname, 'src') + '/',
    },
  },

  plugins: [
    react(),
    tsconfigPaths({
      root: __dirname,
    }),
  ],

  build: {
    outDir: './dist',
    reportCompressedSize: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      name: 'emails',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
