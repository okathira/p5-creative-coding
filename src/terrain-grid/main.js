const SIZE_X = 40;
const SIZE_Y = 30;
const w = 1600;
const h = 1200;
const cols = Math.floor(w / SIZE_X);
const rows = Math.floor(h / SIZE_Y);

const NOISE_SCALE = 0.15;

/** @type {number[][]} */
let terrain = Array.from({ length: rows + 1 }, () => Array(cols).fill(0));
let wave = 0;
let waveSpeed = 0.5;
let isClicked = false;

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(640, 640, WEBGL);
  background(180, 100, 160);
}

const mid = rows / 2;
const adjHeight = 450;
const refreshTerrain = () => {
  wave += waveSpeed;
  for (let y = 0; y < rows + 1; y++) {
    const diff = abs(y - mid);
    const coef = map(diff, 0, mid / 2, 0, 1, true);
    const adjUpper = adjHeight * coef * coef;

    for (let x = 0; x < cols; x++) {
      terrain[y][x] = map(
        noise((x - wave) * NOISE_SCALE, y * NOISE_SCALE),
        0,
        1,
        -100,
        -50 + adjUpper
      );
    }
  }
};

// 三角を六角形に見えるように並べる（四角形ではなく）
const drawGrid = (/** @type {number} */ x, /** @type {number} */ y) => {
  if (y % 2) {
    const adjTop = -0.25;
    const adjBtm = 0.25;
    vertex((x + adjTop) * SIZE_X, y * SIZE_Y, terrain[y][x]);
    vertex((x + adjBtm) * SIZE_X, (y + 1) * SIZE_Y, terrain[y + 1][x]);
  } else {
    const adjTop = 0.25;
    const adjBtm = -0.25;
    vertex((x + adjBtm) * SIZE_X, (y + 1) * SIZE_Y, terrain[y + 1][x]);
    vertex((x + adjTop) * SIZE_X, y * SIZE_Y, terrain[y][x]);
  }
};

const drawTerrain = () => {
  fill(0, 0, 64);
  stroke(220, 60, 200);

  push();
  rotateX((PI / 180) * 80);
  rotateZ(PI / 2);
  translate(-w * 0.7, -h * 0.5, 0);

  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      drawGrid(x, y);
    }
    endShape();
  }

  pop();
};

const clearCanvas = () => {
  noStroke();
  fill(180, 100, 160, 50);
  push();
  translate(0, 0, -w * 0.7);
  plane(width * 3.1, height * 3.1);
  pop();
};

function mousePressed() {
  // isClicked = true;
  waveSpeed = -0.75;
}

function mouseReleased() {
  // isClicked = false;
  waveSpeed = 0.5;
}

const moveView = () => {
  if (!isClicked) {
    const x = map(mouseX, width / 2, width, 0, 1);
    const y = map(mouseY, height / 2, height, 0, 1);

    translate(x * 100, y * 100);
    rotateX(y / PI);
    rotateY(-x / PI);
  }
};

function draw() {
  clearCanvas();

  moveView();
  refreshTerrain();
  drawTerrain();
}
