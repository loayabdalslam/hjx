#!/usr/bin/env node
/**
 * Hjx CLI Entry Point
 *
 * Commands:
 *   hjx run <file.hjx>       Convert + execute a .hjx file
 *   hjx compile <file.hjx>   Convert only (show code, don't run)
 *   hjx repl                 Start interactive REPL
 *   hjx history              Show translation history
 *   hjx history clear        Clear history
 *   hjx explain <file.hjx>   Generate + explain code
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

import { parse } from '../parser/index.js';
import { createProvider } from '../providers/index.js';
import { generate, explain, executeCode } from '../generator/index.js';
import { addEntry, getHistory, clearHistory, getHistoryPath } from '../history/index.js';
import { startRepl } from '../repl/index.js';
import { loadConfig } from './config.js';
import {
  printHeader,
  printCode,
  printResult,
  printError,
  printInfo,
  printSuccess,
  printHistoryTable,
} from './ui.js';

const program = new Command();

program
  .name('hjx')
  .description('Hjx — Unified AI-Powered Programming Language Runtime')
  .version('1.0.0');

// ─── Global options ───────────────────────────────────────────────────────────

program
  .option('-p, --provider <name>', 'AI provider: ollama | claude | gpt | gemini', )
  .option('-t, --target <lang>',   'Target language: python | javascript | rust | go | ...')
  .option('-m, --model <name>',    'Model name override')
  .option('-k, --key <apikey>',    'API key for the selected provider')
  .option('--no-run',              'Do not execute generated code')
  .option('--explain',             'Show AI explanation after code generation')
  .option('--timeout <ms>',        'Execution timeout in milliseconds', '30000');

// ─── run ─────────────────────────────────────────────────────────────────────

program
  .command('run <file>')
  .description('Translate and execute a .hjx file')
  .action(async (file, _, cmd) => {
    const opts = resolveOptions(program.opts());
    const config = loadConfig(opts);
    const provider = createProvider(config);

    const filePath = resolve(file);
    if (!existsSync(filePath)) {
      printError(`File not found: ${filePath}`);
      process.exit(1);
    }

    const source = readFileSync(filePath, 'utf8');
    let parsed;

    try {
      parsed = parse(source);
    } catch (err) {
      printError(`Parse error: ${err.message}`);
      process.exit(1);
    }

    // Override target from file if CLI flag given
    if (opts.target) parsed.target = opts.target;

    console.log('');
    printInfo(`File   : ${chalk.white(filePath)}`);
    printInfo(`Target : ${chalk.yellow(parsed.target)}`);
    printInfo(`Provider : ${chalk.white(provider.name)}`);
    console.log('');

    const spinner = ora('Generating code...').start();
    let code;

    try {
      const result = await generate(parsed, provider, config);
      code = result.code;
      spinner.succeed(chalk.green('Code generated'));
    } catch (err) {
      spinner.fail('Generation failed');
      printError(err.message);
      process.exit(1);
    }

    printCode(code, parsed.target);

    // Optional explanation
    if (config.explain) {
      const s2 = ora('Generating explanation...').start();
      try {
        const intent = parsed.blocks.map(b => b.raw).join('; ');
        const expl = await explain(code, parsed.target, intent, provider);
        s2.stop();
        console.log(chalk.dim('  Explanation:\n'));
        console.log('  ' + expl.split('\n').join('\n  '));
        console.log('');
      } catch { s2.fail('Explain failed'); }
    }

    // Execution
    if (config.run !== false) {
      const runSpinner = ora('Running...').start();
      const execResult = executeCode(code, parsed.target, config);
      runSpinner.stop();
      printResult(execResult);

      addEntry({
        intent: parsed.blocks.map(b => b.raw).join(' | '),
        target: parsed.target,
        code,
        provider: provider.name,
        source: filePath,
        execution: { success: execResult.success, output: execResult.output },
      });
    } else {
      addEntry({
        intent: parsed.blocks.map(b => b.raw).join(' | '),
        target: parsed.target,
        code,
        provider: provider.name,
        source: filePath,
      });
    }
  });

// ─── compile ──────────────────────────────────────────────────────────────────

program
  .command('compile <file>')
  .description('Translate a .hjx file to code (no execution)')
  .action(async (file) => {
    const opts = resolveOptions(program.opts());
    const config = loadConfig({ ...opts, run: false });
    const provider = createProvider(config);

    const filePath = resolve(file);
    if (!existsSync(filePath)) {
      printError(`File not found: ${filePath}`);
      process.exit(1);
    }

    const source = readFileSync(filePath, 'utf8');
    let parsed;
    try {
      parsed = parse(source);
    } catch (err) {
      printError(`Parse error: ${err.message}`);
      process.exit(1);
    }

    if (opts.target) parsed.target = opts.target;

    const spinner = ora('Generating code...').start();

    try {
      const { code } = await generate(parsed, provider, config);
      spinner.succeed('Done');
      printCode(code, parsed.target);

      if (config.explain) {
        const intent = parsed.blocks.map(b => b.raw).join('; ');
        const s2 = ora('Explaining...').start();
        const expl = await explain(code, parsed.target, intent, provider);
        s2.stop();
        console.log(chalk.dim('  Explanation:\n  ' + expl.split('\n').join('\n  ') + '\n'));
      }

      addEntry({
        intent: parsed.blocks.map(b => b.raw).join(' | '),
        target: parsed.target,
        code,
        provider: provider.name,
        source: filePath,
      });
    } catch (err) {
      spinner.fail('Failed');
      printError(err.message);
      process.exit(1);
    }
  });

// ─── repl ─────────────────────────────────────────────────────────────────────

program
  .command('repl')
  .description('Start interactive REPL mode')
  .action(async () => {
    const opts = resolveOptions(program.opts());
    const config = loadConfig(opts);
    const provider = createProvider(config);
    await startRepl(provider, config);
  });

// ─── history ─────────────────────────────────────────────────────────────────

program
  .command('history [action]')
  .description('Show or clear translation history (action: clear)')
  .option('-n, --limit <n>', 'Number of entries to show', '20')
  .action((action, opts) => {
    if (action === 'clear') {
      clearHistory();
      printSuccess('History cleared.');
      return;
    }

    const entries = getHistory(parseInt(opts.limit, 10));
    printHistoryTable(entries);
    printInfo(`History file: ${chalk.dim(getHistoryPath())}`);
    console.log('');
  });

// ─── explain ─────────────────────────────────────────────────────────────────

program
  .command('explain <file>')
  .description('Generate code from a .hjx file and explain it')
  .action(async (file) => {
    const opts = resolveOptions(program.opts());
    const config = loadConfig({ ...opts, run: false, explain: true });
    const provider = createProvider(config);

    const filePath = resolve(file);
    if (!existsSync(filePath)) {
      printError(`File not found: ${filePath}`);
      process.exit(1);
    }

    const source = readFileSync(filePath, 'utf8');
    let parsed;
    try { parsed = parse(source); }
    catch (err) { printError(`Parse error: ${err.message}`); process.exit(1); }

    if (opts.target) parsed.target = opts.target;

    const s1 = ora('Generating...').start();
    try {
      const { code } = await generate(parsed, provider, config);
      s1.succeed('Code generated');
      printCode(code, parsed.target);

      const intent = parsed.blocks.map(b => b.raw).join('; ');
      const s2 = ora('Explaining...').start();
      const expl = await explain(code, parsed.target, intent, provider);
      s2.stop();
      console.log(chalk.bold('\n  Explanation:\n'));
      console.log('  ' + expl.split('\n').join('\n  '));
      console.log('');
    } catch (err) {
      s1.fail('Failed');
      printError(err.message);
      process.exit(1);
    }
  });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveOptions(opts) {
  const out = {};
  if (opts.provider) out.provider   = opts.provider;
  if (opts.target)   out.target     = opts.target;
  if (opts.model)    out.model      = opts.model;
  if (opts.key)      out.apiKey     = opts.key;
  if (opts.run === false) out.run   = false;
  if (opts.explain)  out.explain    = true;
  if (opts.timeout)  out.timeout    = parseInt(opts.timeout, 10);
  return out;
}

// ─── Default: show help ───────────────────────────────────────────────────────

program.addHelpText('beforeAll', () => {
  printHeader();
  return '';
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
