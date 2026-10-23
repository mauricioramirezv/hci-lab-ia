import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/hci-lab-ia/',
  build: { rollupOptions: { output: { manualChunks(id) {
    const file=id.replace(/\\/g,'/');
    if(file.indexOf('/node_modules/')>=0){
      if(/\/(?:react|react-dom|react-router|react-router-dom)\//.test(file))return 'react';
      if(/\/(?:i18next|react-i18next)\//.test(file))return 'i18n';
    }
    const locale=file.match(/\/features\/([^/]+)\/(?:locales|translations)\.ts$/);
    if(locale)return `translations-${locale[1]}`;
    if(file.indexOf('/app/locales/')>=0)return 'translations-shared';
  } } } },
});
