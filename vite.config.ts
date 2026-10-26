import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxyTo=(service:string,port:number)=>({target:`http://127.0.0.1:${port}`,changeOrigin:true,rewrite:(path:string)=>path.replace(`/api/${service}`,'')});
const proxy={
  '/api/identity':proxyTo('identity',3001),
  '/api/learning':proxyTo('learning',3002),
  '/api/community':proxyTo('community',3003),
  '/api/evidence':proxyTo('evidence',3004),
};

export default defineConfig({
  plugins: [react()],
  base: '/hci-lab-ia/',
  server: {proxy},
  preview: {proxy},
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
