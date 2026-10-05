/**
 * Generates `cfg.dtsPropsFor` for every component, by resolving each one's
 * props type from SOURCE with ts-morph.
 *
 * Why this exists: the converter extracts prop contracts from a package's
 * shipped `.d.ts` tree. This repo is an Expo app — no build, no `dist/`, no
 * `types` field — so `findTypesRoot()` falls back to the repo root, finds only
 * `expo-env.d.ts`, and every component degrades to the stub
 * `interface XProps { [key: string]: unknown }`. That stub is what the design
 * agent codes against, so it has to be fixed or the agent is guessing at props.
 *
 * Resolving from source works where the converter cannot, because we open the
 * project with the repo's own tsconfig — so `@/theme` and friends resolve, and
 * so do the local `type Props = {…}` aliases these components use (they are not
 * exported, which is exactly why a `.d.ts`-shaped extractor would miss them).
 *
 * Type text is deliberately SIMPLIFIED, not copied verbatim. The emitted body
 * lands in a standalone `.d.ts` that imports nothing but React, so a literal
 * `StyleProp<ViewStyle>` would be an unresolved name and trip `[DTS_PARSE]`.
 * String-literal unions ARE preserved verbatim — `'primary' | 'secondary' | …`
 * is the single most useful thing the design agent can be told about a prop.
 *
 *   node .design-sync/gen-props.mjs > .design-sync/.cache/dts-props.json
 */

import { readFileSync } from 'node:fs';
import { Node, Project } from '../.ds-sync/node_modules/ts-morph/dist/ts-morph.js';

const cfg = JSON.parse(readFileSync('.design-sync/config.json', 'utf8'));
const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

/**
 * Renders a prop's type for the emitted `.d.ts`.
 *
 * Works from the resolved Type object rather than its printed text, because the
 * text of a named alias is just the alias name — `ButtonVariant`, `ChipTone` —
 * which would be an unresolved identifier in a standalone declaration file and
 * would lose the very thing worth publishing. Expanding the union recovers
 * `'primary' | 'secondary' | …`, which is the single most useful fact the
 * design agent can be given about a prop.
 */
function render(type, node) {
  // `boolean` is internally the union true|false — test before union handling.
  if (type.isBoolean() || type.isBooleanLiteral()) return 'boolean';

  // Two whole-type guards that MUST run before the union branch, because both
  // of these are unions whose expansion is worse than useless:
  //   · StyleProp<ViewStyle> expands to `false | '' | RegisteredStyle | …`,
  //     which renders as noise like `false | '' | unknown`.
  //   · ReactNode expands to string|number|boolean|null|Iterable|…, which
  //     collapses to `unknown` and loses the one fact worth stating.
  const whole = type.getText(node).replace(/\s+/g, ' ');
  if (/StyleProp|ViewStyle|TextStyle|ImageStyle/.test(whole)) return 'unknown';
  if (/ReactNode|ReactElement|JSX\.Element/.test(whole)) return 'React.ReactNode';

  if (type.isUnion()) {
    const parts = type
      .getUnionTypes()
      .filter((u) => !u.isUndefined() && !u.isNull())
      .map((u) => renderLeaf(u, node));
    if (parts.includes(null)) return 'unknown';
    const uniq = [...new Set(parts)];
    // A true boolean shows up as the pair 'true'|'false' after expansion.
    if (uniq.length === 2 && uniq.includes('true') && uniq.includes('false')) return 'boolean';
    return uniq.length === 1 ? uniq[0] : uniq.join(' | ');
  }

  return renderLeaf(type, node) ?? 'unknown';
}

/** One non-union type. Returns null when it cannot be rendered safely. */
function renderLeaf(type, node) {
  if (type.isStringLiteral()) return `'${type.getLiteralValue()}'`;
  if (type.isNumberLiteral()) return String(type.getLiteralValue());
  if (type.isBooleanLiteral()) return type.getText();
  if (type.isString()) return 'string';
  if (type.isNumber()) return 'number';
  if (type.isBoolean()) return 'boolean';

  const t = type.getText(node).replace(/\s+/g, ' ').trim();

  if (/ReactNode|ReactElement|JSX\.Element/.test(t)) return 'React.ReactNode';
  if (type.getCallSignatures().length) {
    // Keep the arity signal, drop parameter types that would not resolve here.
    const params = type.getCallSignatures()[0].getParameters().length;
    return params ? '(...args: never[]) => void' : '() => void';
  }
  if (/StyleProp|ViewStyle|TextStyle|ImageStyle/.test(t)) return 'unknown';
  if (type.isArray() || type.isTuple() || /^readonly /.test(t)) return 'readonly unknown[]';
  return null;
}

/** The component's props object type, from whichever declaration form is used. */
function propsTypeOf(sf, name) {
  const fn = sf.getFunction(name);
  if (fn) return fn.getParameters()[0]?.getType();
  const v = sf.getVariableDeclaration(name);
  if (!v) return undefined;
  const init = v.getInitializer();
  if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) return init.getParameters()[0]?.getType();
  const sigs = v.getType().getCallSignatures();
  return sigs[0]?.getParameters()[0]?.getTypeAtLocation(v);
}

/** First line of a prop's JSDoc, if it has one and it is short enough to help. */
function docFor(prop) {
  const d = prop.getDeclarations()[0];
  if (!d || !Node.isPropertySignature(d)) return '';
  const line = d
    .getJsDocs?.()
    .map((j) => j.getInnerText().replace(/\s+/g, ' ').trim())
    .find(Boolean);
  return line && line.length <= 160 ? line : '';
}

const out = {};
const misses = [];

for (const [name, srcPath] of Object.entries(cfg.componentSrcMap)) {
  const sf = project.getSourceFile(srcPath);
  if (!sf) { misses.push(`${name}: source not in project (${srcPath})`); continue; }

  const type = propsTypeOf(sf, name);
  if (!type) { misses.push(`${name}: no callable declaration found`); continue; }

  const props = type.getProperties();
  if (!props.length) { misses.push(`${name}: props type has no members (takes none?)`); continue; }

  const lines = [];
  for (const p of props) {
    const decl = p.getDeclarations()[0];
    if (!decl) continue;
    const optional = p.isOptional?.() ?? (Node.isPropertySignature(decl) ? decl.hasQuestionToken() : false);
    const simplified = render(p.getTypeAtLocation(decl), decl);
    const doc = docFor(p);
    if (doc) lines.push(`/** ${doc} */`);
    lines.push(`${p.getName()}${optional ? '?' : ''}: ${simplified};`);
  }
  if (lines.length) out[name] = lines.join('\n');
  else misses.push(`${name}: every member filtered out`);
}

process.stderr.write(`resolved ${Object.keys(out).length}/${Object.keys(cfg.componentSrcMap).length} components\n`);
for (const m of misses) process.stderr.write(`  miss  ${m}\n`);
console.log(JSON.stringify(out, null, 2));
