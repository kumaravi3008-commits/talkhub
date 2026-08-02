#!/usr/bin/env node
/**
 * PROBE THE EXACT RUNTIME VALUE OF THE MONGODB URI
 * -------------------------------------------------
 * This script prints EVERY character code in the URI that the server actually
 * reads, so hidden characters (newlines, tabs, BOM, unicode, zero-width
 * spaces, etc.) become impossible to miss.
 *
 * Usage:
 *   node debug/print_uri.js                 # non-destructive probe
 *
 * TRULY CRITICAL: Render service variable VALUES are the source of truth.
 * Paste the URI into the command line too and compare:
 *   node debug/print_uri.js "mongodb+srv://user:pass@host/db"
 */
const raw =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  '';

console.log('=== MONGODB URI RUNTIME PROBE (server-side) ===');
console.log('Process cwd :', process.cwd());
console.log('MONGO_URL env set   :', process.env.MONGO_URL !== undefined);
console.log('MONGO_URI env set   :', process.env.MONGO_URI !== undefined);
console.log('MONGODB_URI env set :', process.env.MONGODB_URI !== undefined);

const s = String(raw);
console.log('Serialized length   :', s.length);
console.log('String repr:', JSON.stringify(s));
console.log('Hex dump   :', Buffer.from(s, 'utf8').toString('hex'));

const codes = [];
for (let i = 0; i < s.length; i++) {
  const c = s.codePointAt(i);
  // Skip obvious alphanumerics but still print a summary
  codes.push(c);
}
console.log('All char codes      :', codes.join(','));

const interesting = s.split('').map((ch, i) => {
  const cp = s.codePointAt(i);
  if (cp > 127) return { i, ch, cp, note: 'non-ASCII' };
  if (ch === '\n') return { i, ch, cp, note: 'LF' };
  if (ch === '\r') return { i, ch, cp, note: 'CR' };
  if (ch === '\t') return { i, ch, cp, note: 'TAB' };
  if (ch === ' ') return { i, ch, cp, note: 'SPACE' };
  if (ch === '%') return { i, ch, cp, note: 'PERCENT' };
  if (ch === '@') return { i, ch, cp, note: 'AT' };
  return null;
}).filter(Boolean);

console.log('Interesting chars   :', JSON.stringify(interesting, null, 2));
console.log('First/last codePoint:', s.codePointAt(0), '/', s.codePointAt(s.length - 1 || 0));
console.log('================================================');

