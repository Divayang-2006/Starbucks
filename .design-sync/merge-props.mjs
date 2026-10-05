/**
 * Merges the generated prop contracts into `.design-sync/config.json`.
 *
 * Run after `gen-props.mjs`. Kept separate so regenerating contracts never
 * risks clobbering hand-made config fields — this script only ever writes the
 * `dtsPropsFor` key and leaves everything else byte-identical.
 *
 *   node .design-sync/gen-props.mjs > .design-sync/.cache/dts-props.json
 *   node .design-sync/merge-props.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';

const CONFIG = '.design-sync/config.json';
const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
const generated = JSON.parse(readFileSync('.design-sync/.cache/dts-props.json', 'utf8'));

/**
 * Components whose props type could not be resolved because they genuinely
 * take none. Saying so beats the converter's `[key: string]: unknown` stub,
 * which reads as "unknown API" rather than "no API".
 */
const NO_PROPS = ['SessionStrip', 'MenuBackdrop', 'PocketBack', 'PocketFront', 'BusyTimes', 'PlacesAttribution'];

const out = { ...generated };
for (const name of NO_PROPS) {
  if (!out[name]) out[name] = '/** This component takes no props. */';
}

// Preserve any hand-written override already in the config — a human edit
// always wins over a regenerated body.
for (const [name, body] of Object.entries(cfg.dtsPropsFor ?? {})) {
  if (!Object.prototype.hasOwnProperty.call(generated, name)) out[name] = body;
}

cfg.dtsPropsFor = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');

const missing = Object.keys(cfg.componentSrcMap).filter((n) => !cfg.dtsPropsFor[n]);
console.log(`dtsPropsFor: ${Object.keys(cfg.dtsPropsFor).length} components`);
if (missing.length) console.log(`still unmapped (${missing.length}): ${missing.join(', ')}`);
