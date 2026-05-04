import { runHjx } from 'hjx';
import { readFileSync } from 'fs';

async function run() {
  const source = readFileSync('./logic/optimize-article.hjx', 'utf8');
  console.log("🚀 Running AI Knowledge Base Optimizer...");
  
  const result = await runHjx(source, { cache: true });
  
  if (result.success) {
    console.log("✅ Optimization Success!");
    console.log("SEO Metadata:", JSON.stringify(result.output, null, 2));
  } else {
    console.error("❌ Optimization Failed");
  }
}

run().catch(console.error);
