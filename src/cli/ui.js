/**
 * Hjx UI Helpers
 * Consistent chalk-based terminal output
 */

import chalk from 'chalk';

export function printHeader() {
  console.log('');
  console.log(chalk.bold.cyan('  ██╗  ██╗     ██╗██╗  ██╗'));
  console.log(chalk.bold.cyan('  ██║  ██║     ██║╚██╗██╔╝'));
  console.log(chalk.bold.cyan('  ███████║     ██║ ╚███╔╝ '));
  console.log(chalk.bold.cyan('  ██╔══██║██   ██║ ██╔██╗ '));
  console.log(chalk.bold.cyan('  ██║  ██║╚█████╔╝██╔╝ ██╗'));
  console.log(chalk.bold.cyan('  ╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝'));
  console.log(chalk.dim('  Unified AI-Powered Programming Language\n'));
}

export function printCode(code, target) {
  const border = chalk.dim('─'.repeat(60));
  console.log('');
  console.log(`  ${chalk.bold.yellow(`[${target}]`)} ${chalk.dim('Generated code:')}`);
  console.log(`  ${border}`);
  const lines = code.split('\n');
  lines.forEach((line, i) => {
    const lineNum = chalk.dim(String(i + 1).padStart(3) + ' │ ');
    console.log(`  ${lineNum}${chalk.white(line)}`);
  });
  console.log(`  ${border}`);
  console.log('');
}

export function printResult(result) {
  if (!result.output && result.success) {
    console.log(chalk.dim('  (no output)\n'));
    return;
  }

  const icon = result.success ? chalk.green('✓') : chalk.red('✗');
  const label = result.success
    ? chalk.green('Execution output:')
    : chalk.red('Execution failed:');

  console.log(`  ${icon} ${label}`);
  if (result.output) {
    const lines = result.output.trim().split('\n');
    lines.forEach(l => console.log(`  ${chalk.dim('│')} ${l}`));
  }
  console.log('');
}

export function printError(message) {
  console.log('');
  console.log(`  ${chalk.red('✗')} ${chalk.red(message)}`);
  console.log('');
}

export function printInfo(message) {
  console.log(`  ${chalk.cyan('ℹ')} ${message}`);
}

export function printSuccess(message) {
  console.log(`  ${chalk.green('✓')} ${message}`);
}

export function printHistoryTable(entries) {
  if (!entries.length) {
    console.log(chalk.dim('\n  No history found.\n'));
    return;
  }

  console.log('');
  console.log(
    chalk.dim('  #'.padEnd(5)) +
    chalk.dim('Time'.padEnd(12)) +
    chalk.dim('Target'.padEnd(14)) +
    chalk.dim('Intent')
  );
  console.log(chalk.dim('  ' + '─'.repeat(70)));

  entries.forEach((entry, i) => {
    const ts = new Date(entry.timestamp).toLocaleTimeString();
    const num = chalk.dim(String(i + 1).padEnd(4));
    const time = chalk.dim(ts.padEnd(11));
    const tgt = chalk.yellow(entry.target.padEnd(13));
    const intent = chalk.white(entry.intent.slice(0, 44));
    console.log(`  ${num} ${time} ${tgt} ${intent}`);
  });
  console.log('');
}
