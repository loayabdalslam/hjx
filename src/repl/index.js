/**
 * Hjx REPL
 * Interactive mode: type intent, get code, run it, repeat.
 */

import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { parseIntent } from '../parser/index.js';
import { generate, explain, executeCode } from '../generator/index.js';
import { addEntry } from '../history/index.js';
import { printCode, printResult, printError, printHeader } from '../cli/ui.js';

const COMMANDS = {
  ':help':    'Show available commands',
  ':target':  'Change target language  e.g. :target javascript',
  ':history': 'Show recent history',
  ':clear':   'Clear screen',
  ':exit':    'Exit the REPL',
  ':quit':    'Exit the REPL',
};

export async function startRepl(provider, options = {}) {
  let target = options.target || 'python';
  let autoRun = options.run !== false;

  printHeader();
  console.log(chalk.dim(`  Provider : ${chalk.white(provider.name)}`));
  console.log(chalk.dim(`  Target   : ${chalk.white(target)}`));
  console.log(chalk.dim(`  Auto-run : ${chalk.white(autoRun ? 'yes' : 'no')}`));
  console.log(chalk.dim(`  Type ${chalk.white(':help')} for commands\n`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('hjx › '),
    terminal: true,
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }

    // ── Built-in commands ──────────────────────────────────────────────────
    if (input.startsWith(':')) {
      const [cmd, ...rest] = input.split(/\s+/);

      switch (cmd) {
        case ':help':
          console.log('');
          Object.entries(COMMANDS).forEach(([c, d]) =>
            console.log(`  ${chalk.cyan(c.padEnd(12))} ${chalk.dim(d)}`)
          );
          console.log('');
          break;

        case ':target':
          if (rest[0]) {
            target = rest[0].toLowerCase();
            console.log(chalk.green(`  Target changed to: ${target}\n`));
          } else {
            console.log(chalk.yellow(`  Current target: ${target}\n`));
          }
          break;

        case ':history': {
          const { getHistory } = await import('../history/index.js');
          const hist = getHistory(10);
          if (!hist.length) {
            console.log(chalk.dim('  No history yet.\n'));
          } else {
            hist.forEach((e, i) => {
              const ts = new Date(e.timestamp).toLocaleTimeString();
              console.log(
                `  ${chalk.dim(String(i + 1).padStart(2))}. ` +
                chalk.dim(`[${ts}]`) + ` [${chalk.yellow(e.target)}] ` +
                chalk.white(e.intent.slice(0, 60))
              );
            });
            console.log('');
          }
          break;
        }

        case ':clear':
          process.stdout.write('\x1Bc');
          break;

        case ':exit':
        case ':quit':
          console.log(chalk.dim('\n  Bye! 👋\n'));
          rl.close();
          process.exit(0);
          break;

        default:
          console.log(chalk.red(`  Unknown command: ${cmd}. Type :help\n`));
      }

      rl.prompt();
      return;
    }

    // ── Intent processing ──────────────────────────────────────────────────
    const program = parseIntent(input, target);
    const spinner = ora({ text: 'Generating...', color: 'cyan' }).start();

    try {
      const { code } = await generate(program, provider, options);
      spinner.succeed(chalk.green('Code generated'));

      printCode(code, target);

      // Explain
      if (options.explain) {
        const spinner2 = ora({ text: 'Explaining...', color: 'cyan' }).start();
        try {
          const expl = await explain(code, target, input, provider);
          spinner2.stop();
          console.log(chalk.dim('\n  ' + expl.split('\n').join('\n  ') + '\n'));
        } catch { spinner2.fail('Explain failed'); }
      }

      // Execute
      if (autoRun) {
        const execSpinner = ora({ text: 'Running...', color: 'yellow' }).start();
        const result = executeCode(code, target, options);
        execSpinner.stop();
        printResult(result);

        addEntry({
          intent: input,
          target,
          code,
          provider: provider.name,
          execution: { success: result.success, output: result.output },
        });
      } else {
        addEntry({ intent: input, target, code, provider: provider.name });
      }

    } catch (err) {
      spinner.fail(chalk.red('Failed'));
      printError(err.message);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.dim('\nGoodbye.\n'));
    process.exit(0);
  });
}
