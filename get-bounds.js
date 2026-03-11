const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('public/images/phone-layout-4.png');
const png = PNG.sync.read(data);

let minX = png.width, minY = png.height, maxX = 0, maxY = 0;

for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        const r = png.data[idx];
        const g = png.data[idx + 1];
        const b = png.data[idx + 2];
        const a = png.data[idx + 3];

        // Check if pixel is light gray/white (the screen)
        const isScreen = r > 200 && g > 200 && b > 200;

        if (isScreen) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
    }
}

const w = maxX - minX + 1;
const h = maxY - minY + 1;

console.log(JSON.stringify({
    imageW: png.width,
    imageH: png.height,
    screenX: minX,
    screenY: minY,
    screenW: w,
    screenH: h,
    leftPct: ((minX / png.width) * 100).toFixed(2) + '%',
    topPct: ((minY / png.height) * 100).toFixed(2) + '%',
    widthPct: ((w / png.width) * 100).toFixed(2) + '%',
    heightPct: ((h / png.height) * 100).toFixed(2) + '%'
}, null, 2));
