#!/usr/bin/env node
const { execSync } = require('child_process');

for (const cmd of [
  'claude plugin marketplace add joezhuo2/ship-release-skill',
  'claude plugin install ship-release@ship-release',
]) {
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.error(`Failed: ${cmd}. Is the Claude Code CLI installed and on PATH?`);
    process.exit(1);
  }
}
console.log('ship-release is installed. Restart Claude Code, then ask Claude to "ship a release".');
