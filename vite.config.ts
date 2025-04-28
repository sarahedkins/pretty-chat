import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [react(),
    dts({
        rollupTypes: true, // Enable bundling of types
        insertTypesEntry: true, // Generate an index.d.ts entry file
    })],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.ts'), // Path to your main entry file
            name: 'PrettyChat', // The name of your library
            fileName: (format) => `pretty-chat.${format}.js`, // Output file name
            formats: ['es', 'umd'], // Output formats
        },
        rollupOptions: {
            external: ['react', 'react-dom'], // Prevent bundling react
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        sourcemap: false,
        minify: false,
        cssCodeSplit: false,
    },
});