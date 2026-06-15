#!/usr/bin/env node
/* Embeds the synced tokens.json into the brand guide as an inline snapshot,
   so the color/type sections render without a server (file://). Run by `npm run sync:tokens`. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tokensPath = path.join(root, 'nam-space/brand/tokens.json');
const htmlPath = path.join(root, 'nam-space/brand/index.html');

const tokens = fs.readFileSync(tokensPath, 'utf8').trim();
const html = fs.readFileSync(htmlPath, 'utf8');

const marker = /(<script id="nam-token-data" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!marker.test(html)) {
  console.error('embed-tokens: marker <script id="nam-token-data"> not found in index.html');
  process.exit(1);
}

const next = html.replace(marker, '$1' + tokens + '$2');
fs.writeFileSync(htmlPath, next);
console.log('embed-tokens: inline token snapshot updated.');
