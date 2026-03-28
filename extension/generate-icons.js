// Run with: node generate-icons.js
// Generates simple PNG icons for the extension using canvas (Node.js + canvas package)
// OR just creates SVG placeholders that Chrome will accept for dev loading.

import { writeFileSync } from 'fs';

// Minimal SVG icon for each size
function makeSVG(size) {
  const s = size;
  const c = s / 2;
  const r = s * 0.42;
  const ir = s * 0.22;
  const cr = s * 0.12;
  // Hexagon points
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
  }).join(' ');
  const iHex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${c + ir * Math.cos(a)},${c + ir * Math.sin(a)}`;
  }).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="hsl(230,25%,7%)"/>
  <polygon points="${hex}" fill="none" stroke="hsl(250,85%,67%)" stroke-width="${s * 0.06}"/>
  <polygon points="${iHex}" fill="hsl(250,85%,67%)" opacity="0.3"/>
  <circle cx="${c}" cy="${c}" r="${cr}" fill="hsl(250,85%,67%)"/>
</svg>`;
}

for (const size of [16, 48, 128]) {
  writeFileSync(`icons/icon${size}.svg`, makeSVG(size));
  console.log(`✓ icons/icon${size}.svg`);
}

console.log('\nFor Chrome, rename .svg → .png or use a converter.');
console.log('For dev, Chrome accepts SVG icons when loading unpacked.');
