const test = require('node:test');
const assert = require('node:assert');
const { mkdtempSync, mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const os = require('os');
const { stableNodePath, hookNodeExists } = require('../utils');

test('stableNodePath maps a Homebrew Cellar node to the opt symlink', () => {
  const prefix = mkdtempSync(join(os.tmpdir(), 'brew-')).replace(/\\/g, '/');
  const cellar = `${prefix}/Cellar/node/26.10.0_1/bin/node`;
  assert.strictEqual(stableNodePath(cellar), cellar); // no opt link: unchanged
  mkdirSync(`${prefix}/opt/node/bin`, { recursive: true });
  writeFileSync(`${prefix}/opt/node/bin/node`, '');
  assert.strictEqual(stableNodePath(cellar), `${prefix}/opt/node/bin/node`);
  assert.strictEqual(stableNodePath('/usr/bin/node'), '/usr/bin/node');
});

test('hookNodeExists flags a hook whose quoted node binary is gone', () => {
  assert.strictEqual(hookNodeExists(`"${process.execPath}" "/x/claude-hook.js" 4000 stop`), true);
  assert.strictEqual(hookNodeExists('"/nonexistent/Cellar/node/25.7.0/bin/node" "/x/claude-hook.js" 4000 stop'), false);
  assert.strictEqual(hookNodeExists('node /x/claude-hook.js 4000 stop'), true);
});
