// inspired by: INTERNET OVERDOSE https://www.youtube.com/watch?v=Ti4K8uuiLZ0

// heart bubble
// reference: p5.js　バブルアップ - techtyの日記 https://techty.hatenablog.com/entry/2019/05/07/164956
class HeartBubble {
  static SIZE_MAX = 85;
  static SIZE_MIN = 20;
  static SIZE_NUM = 30;
  static TRANSPERENT = 192;
  static COLOR = [
    [255, 255, 127, HeartBubble.TRANSPERENT],
    [127, 255, 255, HeartBubble.TRANSPERENT],
    [255, 127, 255, HeartBubble.TRANSPERENT],
    [255, 255, 255, HeartBubble.TRANSPERENT],
  ];

  constructor() {
    this.size = random(HeartBubble.SIZE_MIN, HeartBubble.SIZE_MAX);
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
      this.size = random(HeartBubble.SIZE_MIN, HeartBubble.SIZE_MAX);
      this.color = int(random(0, HeartBubble.COLOR.length));
      this.x = random(0, width);
      this.y = height + this.size;
      this.speedX = random(-2, 2);
      this.speedY = random(-5, -10);
    }
  }

  draw() {
    strokeWeight(0);
    fill(HeartBubble.COLOR[this.color]);
    textSize(this.size);
    text('♥', this.x, this.y);
  }
}

/** @type {HeartBubble[]} */
const hearts = [];

function setup() {
  frameRate(60);
  createCanvas(720, 540);

  for (let i = 0; i < HeartBubble.SIZE_NUM; i++) {
    hearts.push(new HeartBubble());
  }

  drawingContext.shadowInset = true;
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = '#fff8';
}

function draw() {
  background(60, 120, 180);

  hearts.forEach((heart) => {
    heart.update();
    heart.draw();
  });
}
