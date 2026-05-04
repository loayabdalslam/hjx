import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { runHjx } from 'hjx';
import { readFileSync } from 'fs';

// Custom Intent Plugin for Vite
// It translates .hjx files to .js modules during the build
function intentPlugin() {
  return {
    name: 'vite-plugin-intent',
    async transform(code, id) {
      if (id.endsWith('.hjx')) {
        const result = await runHjx(code, { 
          cache: true,
          provider: 'ollama' 
        });
        
        // Wrap the generated code in a module export
        // If it's a JS target, we can export the function
        return {
          code: `export default ${JSON.stringify(result.output)};`,
          map: null
        };
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), intentPlugin()],
});
