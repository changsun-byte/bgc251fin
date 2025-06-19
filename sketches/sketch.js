const { Responsive } = P5Template;

let video;
const boxSize = 10;
let boxes = [];
const maxLineDist = 140;

let flashX = 0;
let flashY = 0;
let flashFrame = 0;

function setup() {
  new Responsive().createResponsiveCanvas(1440, 1090, 'contain', true);

  video = createCapture(VIDEO);
  video.size(floor(width / boxSize), floor(height / boxSize));
  video.hide();
}

function draw() {
  background(0, 20);
  video.loadPixels();
  boxes = [];

  let maxBright = 0;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let i = (x + y * video.width) * 4;
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];
      let bright = (r + g + b) / 3;

      if (bright > maxBright) {
        maxBright = bright;
        maxX = x;
        maxY = y;
      }
    }
  }

  if (maxBright > 80) {
    flashX = maxX * boxSize;
    flashY = maxY * boxSize;
    flashFrame = frameCount;
  }

  if (frameCount - flashFrame < 60) {
    fill(255, 100, 0, 180);
    noStroke();
    ellipse(flashX, flashY, boxSize * 12);
  }

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      if (random() < 0.005) {
        let boxX = x * boxSize;
        let boxY = y * boxSize;
        let c1 = random(255);
        let c2 = random(255);
        let c3 = random(255);
        boxes.push([boxX, boxY, c1, c2, c3]);
      }
    }
  }

  strokeWeight(10);
  for (let i = 0; i < boxes.length; i++) {
    let bx = boxes[i][0];
    let by = boxes[i][1];
    let cr = boxes[i][2];
    let cg = boxes[i][3];
    let cb = boxes[i][4];
    noFill();
    stroke(cr, cg, cb, 150);
    rect(bx, by, boxSize, boxSize);
  }

  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes.length; j++) {
      if (i !== j) {
        let dx = boxes[i][0] - boxes[j][0];
        let dy = boxes[i][1] - boxes[j][1];
        let d = sqrt(dx * dx + dy * dy);

        if (d < maxLineDist) {
          stroke(random(255), random(255), random(255), 100);
          strokeWeight(8);
          line(
            boxes[i][0] + boxSize / 2,
            boxes[i][1] + boxSize / 2,
            boxes[j][0] + boxSize / 2,
            boxes[j][1] + boxSize / 2
          );
        }
      }
    }
  }

  Responsive.drawReferenceGrid('#ffffff');
}
