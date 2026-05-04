import { runHjx } from 'hjx';
import { readFileSync } from 'fs';

async function run() {
  const source = readFileSync('./logic/validation.hjx', 'utf8');
  console.log("🚀 Running Smart Form Validator...");
  
  const result = await runHjx(source, { cache: true });
  
  if (result.success) {
    console.log("✅ Validation Logic Executed!");
    console.log("Result:", result.output.isValid ? "Valid Form" : "Invalid Form");
    console.log("Errors:", result.output.errors);
  } else {
    console.error("❌ Validation Failed");
  }
}

run().catch(console.error);
