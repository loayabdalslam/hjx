import { runHjx } from 'hjx'; // This would be the local package or npm package
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request) {
  try {
    // 1. Load the business logic defined in .hjx
    const logicPath = join(process.cwd(), 'logic', 'discount-rules.hjx');
    const source = readFileSync(logicPath, 'utf8');

    // 2. Run the logic through HJX
    // In a real app, you might pass dynamic variables into the source string
    // or use a provider like OpenAI/Claude
    const result = await runHjx(source, {
      provider: 'ollama', // or 'gpt'
      model: 'llama3',    // or 'gpt-4'
    });

    if (result.success) {
      return new Response(JSON.stringify(result.output), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Logic execution failed' }), {
        status: 500,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
