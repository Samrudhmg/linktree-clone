const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('public/images/phone-layout-4.png');
const png = PNG.sync.read(data);

function floodFill(startX, startY, targetCheck, newA) {
    const stack = [[startX, startY]];
    const visited = new Uint8Array(png.width * png.height);

    while (stack.length > 0) {
        const [x, y] = stack.pop();

        if (x < 0 || x >= png.width || y < 0 || y >= png.height) continue;

        const idx = y * png.width + x;
        if (visited[idx]) continue;
        visited[idx] = 1;

        const pxIdx = idx << 2;
        const r = png.data[pxIdx];
        const g = png.data[pxIdx + 1];
        const b = png.data[pxIdx + 2];
        const a = png.data[pxIdx + 3];

        if (targetCheck(r, g, b, a)) {
            png.data[pxIdx + 3] = newA; // Make transparent
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }
}

// Flood fill outside black (top-left corner)
floodFill(0, 0, (r, g, b, a) => r < 30 && g < 30 && b < 30 && a > 0, 0);

// Flood fill inside light gray screen (center pixel at 512, 768)
floodFill(512, 768, (r, g, b, a) => r > 200 && g > 200 && b > 200 && a > 0, 0);

fs.writeFileSync('public/images/phone-layout-clean.png', PNG.sync.write(png));
console.log('Cleaned image saved!');
