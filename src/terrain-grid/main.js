const GRID_NUM = 20;
const w = 1200;
const h = 1000;
const GRID_X = w / GRID_NUM;
const GRID_Y = h / GRID_NUM;

const NOISE_SCALE = 0.15;

/** @type {number[][]} */
let terrain = Array.from({ length: GRID_Y + 1 }, () => Array(GRID_X).fill(0));
let wave = 0;

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(640, 640, WEBGL);
  fill(0, 0, 64);
  stroke(220, 60, 200);
}

const refreshTerrain = () => {
  wave += 0.1;
  for (let y = 0; y < GRID_NUM + 1; y++) {
    for (let x = 0; x < GRID_NUM; x++) {
      terrain[y][x] = map(
        noise(x * NOISE_SCALE, (y - wave) * NOISE_SCALE),
        0,
        1,
        -100,
        200
      );
    }
  }
};

// 三角を六角形に見えるように並べる（四角形ではなく）
const drawGrid = (/** @type {number} */ x, /** @type {number} */ y) => {
  const adjTop = y % 2 ? -0.25 : 0.25;
  const adjBtm = y % 2 ? 0.25 : -0.25;

  if (y % 2) {
    vertex((x + adjTop) * GRID_X, y * GRID_Y, terrain[y][x]);
    vertex((x + adjBtm) * GRID_X, (y + 1) * GRID_Y, terrain[y + 1][x]);
  } else {
    vertex((x + adjBtm) * GRID_X, (y + 1) * GRID_Y, terrain[y + 1][x]);
    vertex((x + adjTop) * GRID_X, y * GRID_Y, terrain[y][x]);
  }
};

const drawTerrain = () => {
  for (let y = 0; y < GRID_NUM; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < GRID_NUM; x++) {
      drawGrid(x, y);
    }
    endShape();
  }
};

function draw() {
  background(0);
  rotateX((PI / 180) * 60);
  translate(-w / 2, -h / 2);

  refreshTerrain();
  drawTerrain();
}
