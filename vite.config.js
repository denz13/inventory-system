import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/main-[hash].js',
                chunkFileNames: 'assets/chunk-[hash].js',
                assetFileNames: 'assets/style-[hash].[ext]'
            }
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "resources/images",
                    dest: "assets",
                },
                {
                    src: "resources/json",
                    dest: "assets",
                },
            ],
        }),
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.js",
                "resources/js/ckeditor-classic.js",
                "resources/js/ckeditor-inline.js",
                "resources/js/ckeditor-balloon.js",
                "resources/js/ckeditor-balloon-block.js",
                "resources/js/ckeditor-document.js",
            ],
            refresh: true,
        }),
        
    ],
    server: {
        host: '127.0.0.1',
        port: 3000,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
            port: 3000,
        },
    },
});
