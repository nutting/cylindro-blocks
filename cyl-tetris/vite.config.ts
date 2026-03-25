import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cylindro-blocks/',
  preview: {
    host: '127.0.0.1',
    port: 4173,
    allowedHosts: ['ca.ccszxc.xin'],
  },
});
