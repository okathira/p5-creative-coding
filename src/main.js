// inspired by: INTERNET OVERDOSE https://www.youtube.com/watch?v=Ti4K8uuiLZ0

// heart bubble
// reference: p5.js　バブルアップ - techtyの日記 https://techty.hatenablog.com/entry/2019/05/07/164956

class HeartBubble {
  static SIZE_MAX = 90;
  static SIZE_MIN = 20;
  static SIZE_NUM = 40;
  static TRANSPERENT = 192;
  static COLOR = [
    [255, 255, 127, HeartBubble.TRANSPERENT],
    [127, 255, 255, HeartBubble.TRANSPERENT],
    [255, 127, 255, HeartBubble.TRANSPERENT],
    [255, 255, 255, HeartBubble.TRANSPERENT],
  ];

  constructor() {
    this.size = map(
      randomGaussian(),
      -1.5,
      3,
      HeartBubble.SIZE_MIN,
      HeartBubble.SIZE_MAX,
      true
    );
    this.color = int(random(0, HeartBubble.COLOR.length));
    this.x = random(0, width);
    this.y = random(0, height + this.size);
    this.speedX = random(-2, 2);
    this.speedY = random(-5, -10);
  }

  update() {
    this.speedX += random(-0.5, 0.5);
    this.speedX = constrain(this.speedX, -2, 2);
    this.x += this.speedX;
    this.y += this.speedY;

    // 色変化
    if (frameCount % 2) {
      this.color += int(random(1, HeartBubble.COLOR.length));
      this.color %= HeartBubble.COLOR.length;
    }

    if (this.y < 0 - this.size) {
      // 上がりきったら
      this.size = map(
        randomGaussian(),
        -1.5,
        3,
        HeartBubble.SIZE_MIN,
        HeartBubble.SIZE_MAX,
        true
      );
      this.color = int(random(0, HeartBubble.COLOR.length));
      this.x = random(0, width);
      this.y = height + this.size;
      this.speedX = random(-2, 2);
      this.speedY = random(-5, -10);
    }
  }

  draw() {
    fill(HeartBubble.COLOR[this.color]);
    textSize(this.size);
    text('♥', this.x, this.y);
  }
}

/** @type {HeartBubble[]} */
const hearts = [];

const initHearts = () => {
  for (let i = 0; i < HeartBubble.SIZE_NUM; i++) {
    hearts.push(new HeartBubble());
  }
};

const drawHearts = () => {
  push();

  drawingContext.shadowInset = true;
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = '#fff8';
  textAlign(CENTER, CENTER);
  strokeWeight(0);

  blendMode(HARD_LIGHT);
  hearts.forEach((heart) => {
    heart.update();
    heart.draw();
  });

  pop();
};

// rainbow title
// font: Kanit https://github.com/cadsondemak/kanit/blob/master/OFL.txt

/** @type {{ addColorStop: (arg0: number, arg1: string) => void; }} */
let rainbow;
/**  @type {import("p5").Graphics} */
let rainbowCanvas;
/**  @type {import("p5").Graphics} */
let titleCanvas;
const TITLE1 = 'INTERNET';
const TITLE2 = 'OVERDOSE';
const TITLE_FONT = 'Kanit';
const TITLE_SIZE = 240;
const TITLE_WIDTH = 660;
const STROKE_WEIGHT = 8;

const initTitle = () => {
  // 虹色模様
  rainbowCanvas = createGraphics(width, height);
  rainbow = rainbowCanvas.drawingContext.createConicGradient(
    0,
    width / 2,
    height / 2
  );
  rainbow.addColorStop(0, '#f00c');
  rainbow.addColorStop(1 / 6, '#ff0c');
  rainbow.addColorStop(2 / 6, '#0f0c');
  rainbow.addColorStop(3 / 6, '#0ffc');
  rainbow.addColorStop(4 / 6, '#00fc');
  rainbow.addColorStop(5 / 6, '#f0fc');
  rainbow.addColorStop(1, '#f00c');
  rainbowCanvas.drawingContext.fillStyle = rainbow;
  rainbowCanvas.noStroke();
  rainbowCanvas.rect(0, 0, width, height);

  // 白ドット
  rainbowCanvas.fill('#fffc');
  rainbowCanvas.noStroke();
  for (let x = 0; x < width; x += 8) {
    for (let y = 0; y < height; y += 4) {
      if (y % 8) {
        rainbowCanvas.ellipse(x, y, 3);
      } else {
        rainbowCanvas.ellipse(x + 4, y, 3);
      }
    }
  }

  // 文字マスク
  titleCanvas = createGraphics(width, height);
  titleCanvas.textAlign(CENTER, CENTER);
  titleCanvas.textFont(TITLE_FONT);
  titleCanvas.textSize(TITLE_SIZE);
  titleCanvas.strokeWeight(STROKE_WEIGHT + 1);
};

const drawTitle = () => {
  // 文字を描く
  titleCanvas.clear(0, 0, 0, 0);
  titleCanvas.drawingContext.fillText(TITLE1, mouseX, 110, TITLE_WIDTH);
  titleCanvas.drawingContext.fillText(
    TITLE2,
    width - mouseX,
    height - 70,
    TITLE_WIDTH
  );

  // 文字を削る
  titleCanvas.erase();
  titleCanvas.drawingContext.strokeText(
    TITLE1,
    mouseX + STROKE_WEIGHT / 3 - 1,
    110 + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.drawingContext.strokeText(
    TITLE2,
    width - mouseX + STROKE_WEIGHT / 3 - 1,
    height - 70 + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.noErase();

  // 文字で虹をマスク
  const titleImg = titleCanvas.get();
  const rainbowImg = rainbowCanvas.get();
  rainbowImg.mask(titleImg);
  push();
  blendMode(HARD_LIGHT);
  image(rainbowImg, 0, 0);
  pop();

  // 輪郭
  push();

  stroke('#fff');
  strokeWeight(STROKE_WEIGHT);
  textAlign(CENTER, CENTER);
  textFont(TITLE_FONT);
  textSize(TITLE_SIZE);
  drawingContext.strokeText(TITLE1, mouseX, 110, TITLE_WIDTH);
  drawingContext.strokeText(TITLE2, width - mouseX, height - 70, TITLE_WIDTH);

  pop();
};

// /**  @type {import("p5").Image} */
// let img;
// function preload() {
//   img = loadImage('bg.jpg');
// }

function setup() {
  frameRate(60);
  createCanvas(720, 540);
  // img.resize(width, (img.height * width) / img.width);

  initHearts();
  initTitle();
}

function draw() {
  background(60, 120, 180);
  // image(img, 0, -200);

  drawHearts();
  drawTitle();
}
