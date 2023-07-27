// inspired by: INTERNET OVERDOSE https://www.youtube.com/watch?v=Ti4K8uuiLZ0
// NEEDY GIRL OVERDOSE https://store.steampowered.com/app/1451940/NEEDY_GIRL_OVERDOSE
//
// set pic.png, ring.png, room.psd -> room.png

const FPS = 30;

// heart bubble
// reference: p5.js　バブルアップ - techtyの日記 https://techty.hatenablog.com/entry/2019/05/07/164956

class HeartBubble {
  static SIZE_MAX = 90;
  static SIZE_MIN = 20;
  static SIZE_NUM = 50;
  static TRANSPARENT = 224;
  static COLOR = [
    [255, 255, 127, HeartBubble.TRANSPARENT],
    [127, 255, 255, HeartBubble.TRANSPARENT],
    [255, 127, 255, HeartBubble.TRANSPARENT],
    [255, 255, 255, HeartBubble.TRANSPARENT],
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
    this.speedX = this.speedX + random(-0.5, 0.5);
    this.speedX = constrain(this.speedX, -2, 2);
    this.x += (this.speedX * 60) / FPS;
    this.y += (this.speedY * 60) / FPS;

    // 色変化
    if (!(frameCount % 2)) {
      this.color += int(random(0, HeartBubble.COLOR.length));
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

// 画像
/**  @type {import("p5").Image} */
let room;
/**  @type {import("p5").Image} */
let pic;
/**  @type {import("p5").Image} */
let ring;

function preload() {
  room = loadImage('room.png'); // loadImage('https://pbs.twimg.com/media/FL9W_EQaQAIegtS?format=jpg'); // see https://twitter.com/infowssJP/status/1495276417390907395
  pic = loadImage('pic.png'); // インターネットやめろジェネレーター @inonote https://inonote.jp/generator/yamero/ 使用書體 M+ Rounded 1c
  ring = loadImage('ring.png'); // 文字盤
}

// rainbow title
// font: Kanit https://github.com/cadsondemak/kanit/blob/master/OFL.txt

/**  @type {import("p5").Graphics} */
let dotCanvas;
/** @type {import("p5").Image} */
let titleFillImg;
const TITLE1 = 'INTERNET';
const TITLE2 = "DON'DOSE";
const UPPER_OFFSET_Y = 110;
const LOWER_OFFSET_Y = 70;
const TITLE_FONT = 'Kanit';
const TITLE_SIZE = 240;
const TITLE_WIDTH = 660;
const STROKE_WEIGHT = 8;

const initMain = () => {
  const centerX = width / 2;
  const centerY = height / 2;

  // 虹色模様
  const rainbowCanvas = createGraphics(width, height);
  const rainbow = rainbowCanvas.drawingContext.createConicGradient(
    0,
    centerX,
    centerY
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
  titleCanvas.drawingContext.fillText(
    TITLE1,
    centerX,
    UPPER_OFFSET_Y,
    TITLE_WIDTH
  );
  titleCanvas.drawingContext.fillText(
    TITLE2,
    centerX,
    height - LOWER_OFFSET_Y,
    TITLE_WIDTH
  );

  // 文字を削る
  titleCanvas.erase();
  titleCanvas.drawingContext.strokeText(
    TITLE1,
    centerX + STROKE_WEIGHT / 3 - 1,
    UPPER_OFFSET_Y + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.drawingContext.strokeText(
    TITLE2,
    centerX + STROKE_WEIGHT / 3 - 1,
    height - LOWER_OFFSET_Y + STROKE_WEIGHT - 1,
    TITLE_WIDTH
  );
  titleCanvas.noErase();

  // 文字で虹をマスク
  const titleImg = titleCanvas.get();
  const rainbowImg = rainbowCanvas.get();
  rainbowImg.mask(titleImg);
  titleFillImg = rainbowImg;

  // 白ドット
  dotCanvas = createGraphics(width, centerY);
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

/** タイトルを画像に書き込む
 * @param {import("p5").Image} titleImg
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} offsetX
 */
const drawTitleImg = (titleImg, x, y, w, h, offsetX) => {
  titleImg.copy(titleFillImg, x, y, w, h, offsetX, 0, w, h);
};

/** 文字のドット画像を生成する
 * @param {import("p5").Image} titleImg
 * @returns {import("p5").Image}
 */
const createTitleDotImg = (titleImg) => {
  const titleDotImg = dotCanvas.get();
  titleDotImg.mask(titleImg); // TODO: 重そうなのでいい方法を考える

  return titleDotImg;
};

//  TODO:  画像のコピーに必要な座標とテキストの描画に必要な座標とで、２つの座標が存在してしまっているのをなおす。
/** タイトルを描画する
 * @param {string} titleText
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} textX
 * @param {number} textY
 */
const drawTitle = (titleText, x, y, w, h, textX, textY) => {
  const centerX = w / 2;

  // タイトルを書くための画像データを作成する
  const titleImg = createImage(w, h);
  // 画像にタイトルを書き込む
  drawTitleImg(titleImg, x, y, w, h, textX - centerX);
  // タイトルのドット画像を生成する
  const titleDotImg = createTitleDotImg(titleImg);
  // TODO: ここまでの処理を効率化できないか考える

  push();
  blendMode(HARD_LIGHT);
  image(titleImg, x, y, w, h, 0, 0, w, h);
  image(titleDotImg, x, y, w, h, 0, 0, w, h);
  pop();
  drawingContext.strokeText(titleText, textX, textY, TITLE_WIDTH);
};

/** 中央のコンテンツを描画する
 * @param {number} x
 * @param {number} y
 * @param {number} rad
 */
const drawCenterContent = (x, y, rad) => {
  // 画像
  push();
  imageMode(CENTER);
  translate(x, y);
  image(pic, 0, 0);
  rotate(rad);
  image(ring, 0, 0);
  pop();
};

const drawMain = () => {
  const centerX = width / 2;
  const centerY = height / 2;

  // タイトルと画像を描画
  push();

  // stroke設定
  stroke('#fff');
  strokeWeight(STROKE_WEIGHT);
  textAlign(CENTER, CENTER);
  textFont(TITLE_FONT);
  textSize(TITLE_SIZE);

  // タイトル上部
  drawTitle(TITLE1, 0, 0, width, centerY, mouseX, UPPER_OFFSET_Y);

  // 中央のコンテンツ
  drawCenterContent(centerX, centerY - 10, (-frameCount * 0.01 * 60) / FPS);

  // タイトル下部
  drawTitle(
    TITLE2,
    0,
    centerY,
    width,
    centerY,
    width - mouseX,
    height - LOWER_OFFSET_Y
  );

  pop();
};

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
  frameRate(FPS);
  const mainCanvas = createCanvas(720, 540);
  mainCanvas.parent('main');

  room.resize((room.width * height) / room.height, height); // width, (room.height * width) / room.width;
  const picRatio = 0.625;
  pic.resize(pic.width * picRatio, pic.height * picRatio);
  ring.resize(ring.width * picRatio, ring.height * picRatio);

  initHearts();
  initMain();
}

let hasInitialized = false;

function draw() {
  image(room, 0, 0);

  if (isMousePressed || anyKeyPressed) {
    if (!hasInitialized) {
      initMain(); // 再度フォントを読み込みなおすため
      hasInitialized = true;
    }

    // なにか押すと表示
    drawHearts();
    drawMain();
  }
}
