const { Responsive } = P5Template;

let video;
const boxSize = 10;
let oldPixels = null;
let boxes = [];
const maxLineDist = 140;

function setup() {
  new Responsive().createResponsiveCanvas(1440, 1090, 'contain', true);

  video = createCapture(VIDEO);
  video.size(floor(width / boxSize), floor(height / boxSize));
}

function draw() {
  background(0, 20);

  video.loadPixels();
  boxes = [];

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      const i = (x + y * video.width) * 4;

      const r = video.pixels[i];
      const g = video.pixels[i + 1];
      const b = video.pixels[i + 2];
      const bright = (r + g + b) / 3;

      if (oldPixels) {
        const pr = oldPixels[i];
        const pg = oldPixels[i + 1];
        const pb = oldPixels[i + 2];
        const oldBright = (pr + pg + pb) / 3;

        const diff = abs(bright - oldBright);

        if (diff > 20) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;

              if (
                nx >= 0 &&
                nx < video.width &&
                ny >= 0 &&
                ny < video.height &&
                nx * boxSize + boxSize <= width &&
                ny * boxSize + boxSize <= height
              ) {
                const colorArray = [random(255), random(255), random(255)];
                boxes.push({
                  x: nx * boxSize,
                  y: ny * boxSize,
                  color: colorArray,
                });
              }
            }
          }
        }
      }
    }
  }

  oldPixels = video.pixels.slice();

  // 네모 그리기
  strokeWeight(10);
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    noFill();
    stroke(b.color[0], b.color[1], b.color[2], 150);
    rect(b.x, b.y, boxSize, boxSize);
  }

  // 선 연결
  const maxConnections = 100;
  for (let n = 0; n < maxConnections; n++) {
    const i = floor(random(boxes.length));
    const j = floor(random(boxes.length));
    if (i !== j) {
      const dx = boxes[i].x - boxes[j].x;
      const dy = boxes[i].y - boxes[j].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxLineDist * maxLineDist) {
        stroke(random(255), random(255), random(255), 100);
        strokeWeight(8);
        line(
          boxes[i].x + boxSize / 2,
          boxes[i].y + boxSize / 2,
          boxes[j].x + boxSize / 2,
          boxes[j].y + boxSize / 2
        );
      }
    }
  }

  Responsive.drawReferenceGrid('#ffffff');
}
