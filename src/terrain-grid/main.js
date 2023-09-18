const GRID_NUM = 20;
const w = 1200;
const h = 1000;
const GRID_X = w / GRID_NUM;
const GRID_Y = h / GRID_NUM;

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(640, 640, WEBGL);
  fill(0, 0, 64);
  stroke(255);
}

const drawGrid = (
  /** @type {number} */ x,
  /** @type {number} */ y,
  /** @type {number} */ adjTop = 0,
  /** @type {number} */ adjBtm = 0
) => {
  vertex((x + adjTop) * GRID_X, y * GRID_Y);
  vertex((x + adjBtm) * GRID_X, (y + 1) * GRID_Y);
  // vertex((x + 1 + adjTop) * GRID_X, y * GRID_Y);
};

function draw() {
  background(0);
  rotateX((PI / 180) * 60);
  translate(-w / 2, -h / 2);

  // terrain triangles
  for (let y = 0; y < GRID_NUM; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < GRID_NUM; x++) {
      if (y % 2) {
        drawGrid(x, y, -0.25, 0.25);
      } else {
        drawGrid(x, y, 0.25, 0.75);
      }
    }
    endShape();
  }
}
