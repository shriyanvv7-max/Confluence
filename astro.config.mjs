import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://shriyan-confluence-2026.vercel.app',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
