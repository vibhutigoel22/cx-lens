import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Embeddable build: React components (peer react) + a self-contained <coralogix-lens> web component.
export default defineConfig({ plugins: [react()], define: { 'process.env.NODE_ENV': '"production"' },
  build: { outDir: 'dist-lib', emptyOutDir: true, lib: { entry: { 'cx-lens-ui': 'src/lib.ts', 'cx-lens-element': 'src/element.tsx' }, formats: ['es'] }, rollupOptions: { external: [] } } });
