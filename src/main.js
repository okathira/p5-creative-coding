// inspired by: INTERNET OVERDOSE https://www.youtube.com/watch?v=Ti4K8uuiLZ0
// NEEDY GIRL OVERDOSE https://store.steampowered.com/app/1451940/NEEDY_GIRL_OVERDOSE
//
// set pic.png, room.psd -> room.png

// heart bubble
// reference: p5.js　バブルアップ - techtyの日記 https://techty.hatenablog.com/entry/2019/05/07/164956

class HeartBubble {
  static SIZE_MAX = 90;
  static SIZE_MIN = 20;
  static SIZE_NUM = 50;
  static TRANSPERENT = 224;
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

/**  @type {import("p5").Graphics} */
let dotCanvas;
/** @type {import("p5").Image} */
let titleFillImg;
const TITLE1 = 'INTERNET';
const TITLE2 = "DON'DOSE";
const TITLE_FONT = 'Kanit';
const TITLE_SIZE = 240;
const TITLE_WIDTH = 660;
const STROKE_WEIGHT = 8;
/** @type {number} */
let MID_X;
/** @type {number} */
let MID_Y;

const initMain = () => {
  MID_X = width / 2;
  MID_Y = height / 2;

  // 虹色模様
  const rainbowCanvas = createGraphics(width, height);
  const rainbow = rainbowCanvas.drawingContext.createConicGradient(
    0,
    MID_X,
    MID_Y
  );
  rainbow.addColorStop(0, '#f00d');
  rainbow.addColorStop(1 / 6, '#ff0d');
  rainbow.addColorStop(2 / 6, '#0f0d');
  rainbow.addColorStop(3 / 6, '#0ffd');
  rainbow.addColorStop(4 / 6, '#00fd');
  rainbow.addColorStop(5 / 6, '#f0fd');
  rainbow.addColorStop(1, '#f00d');
  rainbowCanvas.drawingContext.fillStyle = rainbow;
  rainbowCanvas.noStroke();
  rainbowCanvas.rect(0, 0, width, height);

  // 文字を作る
  const titleCanvas = createGraphics(width, height);
  titleCanvas.textAlign(CENTER, CENTER);
  titleCanvas.textFont(TITLE_FONT);
  titleCanvas.textSize(TITLE_SIZE);
  titleCanvas.strokeWeight(STROKE_WEIGHT + 1);
  // titleCanvas.clear(0, 0, 0, 0);
  titleCanvas.drawingContext.fillText(TITLE1, MID_X, 110, TITLE_WIDTH);
  titleCanvas.drawingContext.fillText(TITLE2, MID_X, height - 70, TITLE_WIDTH);

  // 文字を削る
  titleCanvas.erase();
  titleCanvas.drawingContext.strokeText(
    TITLE1,
    MID_X + STROKE_WEIGHT / 3 - 1,
    110 + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.drawingContext.strokeText(
    TITLE2,
    MID_X + STROKE_WEIGHT / 3 - 1,
    height - 70 + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.noErase();

  // 文字で虹をマスク
  const titleImg = titleCanvas.get();
  const rainbowImg = rainbowCanvas.get();
  rainbowImg.mask(titleImg);
  titleFillImg = rainbowImg;

  // 白ドット
  dotCanvas = createGraphics(width, height);
  dotCanvas.fill('#fff');
  dotCanvas.noStroke();
  for (let x = 0; x < width; x += 8) {
    for (let y = 0; y < height; y += 4) {
      if (y % 8) {
        dotCanvas.ellipse(x, y, 3.25);
      } else {
        dotCanvas.ellipse(x + 4, y, 3.25);
      }
    }
  }

  // 不要なキャンバスを削除
  titleCanvas.remove();
  rainbowCanvas.remove();
};

const drawMain = () => {
  // タイトルと画像を描画
  push();

  // stroke設定
  stroke('#fff');
  strokeWeight(STROKE_WEIGHT);
  textAlign(CENTER, CENTER);
  textFont(TITLE_FONT);
  textSize(TITLE_SIZE);

  // タイトルを描画位置に用意する
  const displayedTitleImg = createImage(width, height);
  displayedTitleImg.copy(
    titleFillImg,
    0,
    0,
    width,
    MID_Y,
    -MID_X + mouseX,
    0,
    width,
    MID_Y
  );
  displayedTitleImg.copy(
    titleFillImg,
    0,
    MID_Y,
    width,
    height,
    MID_X - mouseX,
    MID_Y,
    width,
    height
  );

  // ドットを描画位置に用意する
  const dotImg = dotCanvas.get();
  dotImg.mask(displayedTitleImg);

  // タイトル上
  push();
  blendMode(HARD_LIGHT);
  image(displayedTitleImg, 0, 0, width, MID_Y, 0, 0, width, MID_Y);
  image(dotImg, 0, 0, width, MID_Y, 0, 0, width, MID_Y);
  pop();
  drawingContext.strokeText(TITLE1, mouseX, 110, TITLE_WIDTH);

  // 画像
  push();
  imageMode(CENTER);
  image(pic, MID_X, MID_Y - 20);
  pop();

  // タイトル下
  push();
  blendMode(HARD_LIGHT);
  image(displayedTitleImg, 0, MID_Y, width, height, 0, MID_Y, width, height);
  image(dotImg, 0, MID_Y, width, height, 0, MID_Y, width, height);
  pop();
  drawingContext.strokeText(TITLE2, width - mouseX, height - 70, TITLE_WIDTH);

  pop();
};

// 画像
/**  @type {import("p5").Image} */
let room;
/**  @type {import("p5").Image} */
let pic;

function preload() {
  room = loadImage('room.png'); // loadImage('https://pbs.twimg.com/media/FL9W_EQaQAIegtS?format=jpg'); // see https://twitter.com/infowssJP/status/1495276417390907395
  pic = loadImage('pic.png');
}

// クリック判定
let isMousePressed = false;

function mousePressed() {
  isMousePressed = true;
}

function mouseReleased() {
  isMousePressed = false;
}

// キー判定
let anyKeyPressed = false;

function keyPressed() {
  anyKeyPressed = true;
}

function keyReleased() {
  anyKeyPressed = false;
}

function setup() {
  frameRate(60);
  createCanvas(720, 540);

  room.resize((room.width * height) / room.height, height);
  pic.resize(pic.width * 0.625, pic.height * 0.625);

  initHearts();
  initMain();
}

function draw() {
  image(room, 0, 0);

  if (isMousePressed || anyKeyPressed) {
    // なにか押すと表示
    drawHearts();
    drawMain();
  }
}
