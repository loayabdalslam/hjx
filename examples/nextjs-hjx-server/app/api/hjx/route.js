import { runHjx } from 'hjx-intent-coding'; // This would be the local package or npm package
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request) {
  try {
    const logicPath = join(process.cwd(), 'logic', 'discount-rules.hjx');
    const source = readFileSync(logicPath, 'utf8');

    // Extract dynamic inputs from the system (e.g., from request params)
    const { searchParams } = new URL(request.url);
    const inputs = {
      tier: searchParams.get('tier') || 'gold',
      orderValue: parseFloat(searchParams.get('value')) || 1500
    };

    // Force re-generation to apply new prompt rules for standalone integration
    const result = await runHjx(source, {
      provider: 'ollama',
      model: 'gemma4:e4b',
      cache: false,
      inputs: inputs // Passing real system data
    });

    console.log('HJX Result:', JSON.stringify(result, null, 2));

    if (result.success) {
      let outputData = result.output;
      
      // If output is a string, try to parse it as JSON
      if (typeof outputData === 'string') {
        try {
          outputData = JSON.parse(outputData);
        } catch (e) {
          // Keep as string if not JSON
        }
      }

      return new Response(JSON.stringify(outputData), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Logic execution failed', details: result.output }), {
        status: 500,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
