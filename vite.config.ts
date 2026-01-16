import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Check if we're in dev mode
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [
    react(),
    !isDev && dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ].filter(Boolean),
  
  // Dev server configuration
  ...(isDev && {
    root: '.',
    server: {
      port: 3000,
      open: true,
    },
  }),
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiiaChatWidget',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        assetFileNames: 'style.css',
      },
    },
    sourcemap: true,
    minify: 'terser',
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
