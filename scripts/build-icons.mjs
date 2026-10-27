// Renders brand/icon.svg to every macOS/Tauri icon size and writes a .icns (PNG-based chunks).
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const svg = readFileSync('brand/icon.svg'); const out = 'apps/desktop/src-tauri/icons'; mkdirSync(out, { recursive: true });
const sizes = { '32x32.png': 32, '64x64.png': 64, '128x128.png': 128, '128x128@2x.png': 256, 'icon.png': 1024, 'Square310x310Logo.png': 310 };
for (const [n, s] of Object.entries(sizes)) await sharp(svg, { density: 384 }).resize(s, s).png().toFile(`${out}/${n}`);
const chunk = async (type, s) => { const png = await sharp(svg, { density: 384 }).resize(s, s).png().toBuffer(); const h = Buffer.alloc(8); h.write(type, 0, 'ascii'); h.writeUInt32BE(png.length + 8, 4); return Buffer.concat([h, png]); };
const parts = await Promise.all([['icp4', 16], ['icp5', 32], ['icp6', 64], ['ic07', 128], ['ic08', 256], ['ic09', 512], ['ic10', 1024], ['ic11', 32], ['ic12', 64], ['ic13', 256], ['ic14', 512]].map(([t, s]) => chunk(t, s)));
const body = Buffer.concat(parts); const head = Buffer.alloc(8); head.write('icns', 0, 'ascii'); head.writeUInt32BE(body.length + 8, 4);
writeFileSync(`${out}/icon.icns`, Buffer.concat([head, body]));
await sharp(svg, { density: 384 }).resize(256, 256).png().toFile('brand/icon-256.png');
await sharp(readFileSync('brand/mark.svg'), { density: 600 }).resize(64, 64).png().toFile('brand/mark-64.png');
// ICO (single 256 PNG entry) for completeness
const ico256 = await sharp(svg, { density: 384 }).resize(256, 256).png().toBuffer(); const ih = Buffer.alloc(22); ih.writeUInt16LE(0, 0); ih.writeUInt16LE(1, 2); ih.writeUInt16LE(1, 4); ih.writeUInt8(0, 6); ih.writeUInt8(0, 7); ih.writeUInt16LE(1, 10); ih.writeUInt16LE(32, 12); ih.writeUInt32LE(ico256.length, 14); ih.writeUInt32LE(22, 18);
writeFileSync(`${out}/icon.ico`, Buffer.concat([ih, ico256]));
// preview sheet
const sheet = await Promise.all([512, 128, 64, 32, 16].map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer()));
let x = 10; const comps = sheet.map((b, i) => { const s = [512, 128, 64, 32, 16][i]; const c = { input: b, left: x, top: 10 + (512 - s) / 2 }; x += s + 24; return c; });
await sharp({ create: { width: x, height: 532, channels: 4, background: '#f2f4f6' } }).composite(comps).png().toFile('brand/preview.png');
console.log('icons written');
