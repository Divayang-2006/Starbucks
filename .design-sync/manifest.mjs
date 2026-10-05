/**
 * Builds an upload file list from the live ds-bundle/ tree.
 *
 * Regenerated immediately before every push (never reused from a previous run)
 * so the list can't describe a build that no longer exists on disk.
 *
 *   node .design-sync/manifest.mjs base                 → shared files only
 *   node .design-sync/manifest.mjs Button Field …       → shared files + those components
 *   node .design-sync/manifest.mjs --components-only A B → just those components
 *   node .design-sync/manifest.mjs --all                → everything uploadable
 *
 * Prints JSON to stdout. Dot-prefixed roots and _screenshots/ are never
 * included — those stay local by design.
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'ds-bundle';
const SHARED_DIRS = ['_vendor', 'tokens', 'fonts', 'guidelines'];
const SHARED_FILES = ['_ds_bundle.js', '_ds_bundle.css', 'styles.css', 'README.md'];

const args = process.argv.slice(2);
const componentsOnly = args.includes('--components-only');
const all = args.includes('--all');
const names = args.filter((a) => !a.startsWith('--') && a !== 'base');

const files = [];

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(relative(OUT, p).split('\\').join('/'));
  }
}

if (!componentsOnly) {
  for (const d of SHARED_DIRS) walk(join(OUT, d));
  for (const f of SHARED_FILES) if (existsSync(join(OUT, f))) files.push(f);
}

// components/<group>/<Name>/ — group is discovered, never assumed.
const compRoot = join(OUT, 'components');
if (existsSync(compRoot)) {
  for (const group of readdirSync(compRoot)) {
    const gDir = join(compRoot, group);
    if (!statSync(gDir).isDirectory()) continue;
    for (const name of readdirSync(gDir)) {
      if (!all && !names.includes(name)) continue;
      walk(join(gDir, name));
    }
  }
}

// _preview/<Name>.* — floor-card components have none, which is fine.
const prevRoot = join(OUT, '_preview');
if (existsSync(prevRoot)) {
  for (const e of readdirSync(prevRoot)) {
    const base = e.replace(/\.[^.]+$/, '');
    if (all || names.includes(base)) files.push(`_preview/${e}`);
  }
}

console.log(JSON.stringify([...new Set(files)].sort(), null, 1));
