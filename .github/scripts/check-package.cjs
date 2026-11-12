const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const pkg = require('../../package.json');
async function main() {
  const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' }));
  const files = new Set(packed.files.map(file => file.path));
  for (const file of packed.files) {
    assert(/^(?:package\.json|README\.md|LICENSE|dist\/[A-Za-z0-9_.-]+\.(?:js|mjs|d\.ts|d\.mts))$/.test(file.path), 'Unexpected file in npm package: ' + file.path);
    assert(file.size > 0, 'Empty file: ' + file.path);
  }
  for (const entry of Object.values(pkg.exports)) {
    for (const target of Object.values(entry)) {
      assert(files.has(target.replace(/^\.\//, '')), 'Missing export: ' + target);
      assert(fs.existsSync(target), 'Missing built file: ' + target);
    }
    require(path.resolve(entry.require));
    await import(pathToFileURL(path.resolve(entry.import)).href);
  }
  assert.equal(typeof require(path.resolve(pkg.main)).init, 'function');
  assert.equal(typeof require(path.resolve(pkg.main)).searchAddresses, 'function');
  console.log('Package file allowlist and all JavaScript, React and Vue entry points passed.');
}
main().catch(error => { console.error(error); process.exit(1); });
