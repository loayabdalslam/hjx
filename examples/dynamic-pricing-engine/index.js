import { runHjx } from 'hjx';
import { readFileSync } from 'fs';

async function run() {
  const source = readFileSync('./logic/pricing.hjx', 'utf8');
  console.log("🚀 Running Dynamic Pricing Engine...");
  
  const result = await runHjx(source, { cache: true });
  
  if (result.success) {
    console.log("✅ Pricing Calculated!");
    console.log("Invoice Details:", JSON.stringify(result.output, null, 2));
  } else {
    console.error("❌ Pricing Failed");
  }
}

run().catch(console.error);
