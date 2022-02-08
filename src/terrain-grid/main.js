const SIZE_X = 40;
const SIZE_Y = 30;
const w = 1000;
const h = 1200;
const cols = Math.floor(w / SIZE_X);
const rows = Math.floor(h / SIZE_Y);

const NOISE_SCALE = 0.125;

/** @type {number[][]} */
let terrain = Array.from({ length: rows + 1 }, () => Array(cols).fill(0));
let wave = 0;

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(640, 640, WEBGL);
  fill(0, 0, 64);
  stroke(220, 60, 200);
}

const refreshTerrain = () => {
  wave += 0.15;
  for (let y = 0; y < rows + 1; y++) {
    for (let x = 0; x < cols; x++) {
      terrain[y][x] = map(
        noise((x - wave) * NOISE_SCALE, y * NOISE_SCALE),
        0,
        1,
        -150,
        150
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
  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      drawGrid(x, y);
    }
    endShape();
  }
};

function draw() {
  background(180, 100, 160);

  rotateX((PI / 180) * 60);
  rotateZ(PI / 2);
  translate(-w / 2, -h / 2);
  refreshTerrain();
  drawTerrain();
}
