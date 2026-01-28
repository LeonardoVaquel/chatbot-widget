import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Chatbot',
      fileName: (format) => `chatbot.${format}.js`,
      formats: ['es', 'umd'] // 'es' para apps modernas, 'umd' para cargarlo con <script src="">
    },
    rollupOptions: {
      // No necesitamos dependencias externas ya que es nativo
      external: [],
      output: {
        globals: {
          Chatbot: 'Chatbot'
        }
      }
    },
    minify: 'terser', // Minificación máxima
    terserOptions: {
      compress: {
        drop_console: true, // Quita los console.log en producción
        drop_debugger: true
      }
    }
  }
});
