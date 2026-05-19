import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/ViaPadelClub-Kim-DCA1-Frontend/',
    plugins: [plugin()],
    server: {
        port: 61510,
    }
})
