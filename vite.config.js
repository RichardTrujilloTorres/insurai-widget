import { defineConfig } from 'vite';

export default defineConfig({
    base: '/insurai-widget/', // GitHub Pages subdirectory
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    }
});
