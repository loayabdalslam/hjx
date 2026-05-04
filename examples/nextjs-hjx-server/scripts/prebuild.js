import { runHjx } from 'hjx';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

async function prebuild() {
  const logicDir = join(process.cwd(), 'logic');
  const files = readdirSync(logicDir).filter(f => f.endsWith('.hjx'));

  console.log(`🚀 Pre-building ${files.length} Intent logic files...`);

  for (const file of files) {
    const source = readFileSync(join(logicDir, file), 'utf8');
    const result = await runHjx(source, {
      cache: true, // This will generate the .intent-cache files
      provider: 'ollama',
      model: 'gemma4:31b-cloud'
    });
    
    if (result.success) {
      console.log(`✅ ${file} cached successfully ${result.cached ? '(already cached)' : '(new)'}`);
    } else {
      console.error(`❌ ${file} failed to build`);
    }
  }
}

prebuild().catch(console.error);
