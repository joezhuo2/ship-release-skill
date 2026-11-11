const assert = require('assert');
const fs = require('fs');
const path = require('path');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
const pkg = JSON.parse(read('package.json'));
const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
const market = JSON.parse(read('.claude-plugin/marketplace.json'));
const skill = read('skills/ship-release/SKILL.md');

assert.strictEqual(plugin.version, pkg.version, 'plugin.json version matches package.json');
assert.strictEqual(read('CHANGELOG.md').match(/^## \[(.+?)\]/m)[1], pkg.version, 'latest changelog entry matches package.json');
assert.strictEqual(market.plugins[0].name, plugin.name, 'marketplace entry matches plugin name');
assert.match(read('bin/install.js'), new RegExp(`${plugin.name}@${market.name}`), 'installer installs the marketplace plugin');

const front = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
assert.match(front, /^name: ship-release$/m, 'skill has a name');
assert.match(front, /^description: Use when .{40,}$/m, 'skill has a trigger description');

for (const f of [...pkg.files, pkg.bin[pkg.name]]) assert.ok(fs.existsSync(path.join(__dirname, f)), `${f} exists`);

console.log('ok');
