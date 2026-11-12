const assert = require('node:assert/strict');
const pkg = require('../../package.json');
const expectedRepository = 'Saudiaddresspro1/Saudi-address-pro-js';
assert.equal(process.env.GITHUB_REPOSITORY, expectedRepository, 'Wrong publishing repository');
assert.equal(pkg.name, 'saudi-address-pro', 'Wrong npm package');
assert.equal(pkg.repository.url, 'git+https://github.com/' + expectedRepository + '.git', 'Repository metadata must match the trusted publisher');
assert.match(pkg.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, 'Invalid release version');
if (process.env.GITHUB_REF_TYPE === 'tag') {
  assert.equal(process.env.GITHUB_REF_NAME, 'v' + pkg.version, 'Tag must match package.json version');
} else {
  assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch', 'Unsupported release trigger');
  assert.equal(process.env.GITHUB_REF, 'refs/heads/main', 'Manual publishes must use main');
}
const [major, minor, patch] = process.versions.node.split('.').map(Number);
assert(major > 22 || (major === 22 && (minor > 14 || (minor === 14 && patch >= 0))), 'Node 22.14+ is required');
const { execFileSync } = require('node:child_process');
const [npmMajor, npmMinor, npmPatch] = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim().split('.').map(Number);
assert(npmMajor > 11 || (npmMajor === 11 && (npmMinor > 5 || (npmMinor === 5 && npmPatch >= 1))), 'npm 11.5.1+ is required');
console.log('Release identity, tag and runtime checks passed for ' + pkg.name + '@' + pkg.version);
