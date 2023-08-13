/** @type {import('p5').Image} */
let pic;
/** @type {number[]} */
let picPixels;

function preload() {
  pic = loadImage('./img/bg.jpg');
}

function setup() {
  createCanvas(800, 600);
  background(127);

  pic.resize(width, height);

  // loadPixelsは一度だけ呼ぶ
  pic.loadPixels();
  picPixels = pic.pixels;
}

function draw() {
  // sort image
  for (let y = 0; y < height; y++) {
    /** @type {{ r: number; g: number; b: number; a: number; }[]} */
    let sorted = [];

    for (let x = 0; x < width; x++) {
      sorted.push({
        r: picPixels[(y * width + x) * 4],
        g: picPixels[(y * width + x) * 4 + 1],
        b: picPixels[(y * width + x) * 4 + 2],
        a: picPixels[(y * width + x) * 4 + 3],
      });
    }

    for (let i = 0; i < width - 1; i++) {
      // const x = int(random(0, sorted.length - 1));
      const x = i;

      const a = sorted[x].r + sorted[x].g + sorted[x].b;
      const b = sorted[x + 1].r + sorted[x + 1].g + sorted[x + 1].b;

      if (mouseIsPressed) {
        if (a < b) {
          let t = sorted[x];
          sorted[x] = sorted[x + 1];
          sorted[x + 1] = t;
        }
      } else {
        if (a > b) {
          let t = sorted[x];
          sorted[x] = sorted[x + 1];
          sorted[x + 1] = t;
        }
      }
    }

    sorted.forEach((p, x) => {
      pic.pixels[(y * width + x) * 4] = p.r;
      pic.pixels[(y * width + x) * 4 + 1] = p.g;
      pic.pixels[(y * width + x) * 4 + 2] = p.b;
      pic.pixels[(y * width + x) * 4 + 3] = p.a;
    });
  }

  pic.updatePixels();

  image(pic, 0, 0);
}
