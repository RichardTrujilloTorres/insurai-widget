import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/insurai-analyzer.js',
            name: 'InsurAIAnalyzer',
            fileName: 'insurai-analyzer',
            formats: ['es']
        },
        rollupOptions: {
            external: [],
            output: {
                inlineDynamicImports: true
            }
        }
    }
});
