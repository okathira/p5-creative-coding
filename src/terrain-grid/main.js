const GRID_NUM = 20;
const w = 1200;
const h = 1000;
const GRID_X = w / GRID_NUM;
const GRID_Y = h / GRID_NUM;

/** @type {number[][]} */
let z = Array.from({ length: GRID_Y + 1 }, () => Array(GRID_X + 1).fill(0));

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(640, 640, WEBGL);
  fill(0, 0, 64);
  stroke(255);

  const noiseScale = 0.15;
  for (let y = 0; y < GRID_NUM + 1; y++) {
    for (let x = 0; x < GRID_NUM; x++) {
      z[x][y] = map(noise(x * noiseScale, y * noiseScale), 0, 1, -100, 200);
    }
  }
}

const drawGrid = (/** @type {number} */ x, /** @type {number} */ y) => {
  const adjTop = y % 2 ? -0.25 : 0.25;
  const adjBtm = y % 2 ? 0.25 : -0.25;

  if (y % 2) {
    vertex((x + adjTop) * GRID_X, y * GRID_Y, z[x][y]);
    vertex((x + adjBtm) * GRID_X, (y + 1) * GRID_Y, z[x][y + 1]);
  } else {
    vertex((x + adjBtm) * GRID_X, (y + 1) * GRID_Y, z[x][y + 1]);
    vertex((x + adjTop) * GRID_X, y * GRID_Y, z[x][y]);
  }
};

function draw() {
  background(0);
  rotateX((PI / 180) * 60);
  translate(-w / 2, -h / 2);

  // terrain triangles
  for (let y = 0; y < GRID_NUM; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < GRID_NUM; x++) {
      drawGrid(x, y);
    }
    endShape();
  }
}
