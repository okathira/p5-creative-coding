// inspired by: INTERNET OVERDOSE https://www.youtube.com/watch?v=Ti4K8uuiLZ0
// NEEDY GIRL OVERDOSE https://store.steampowered.com/app/1451940/NEEDY_GIRL_OVERDOSE
//
// set pic.png, room.psd -> room.png

const FPS = 30;

const ROOM_SRC = './img/room.png';
const PIC_SRC = './img/pic.jpg';
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

function preload() {
  room = loadImage(ROOM_SRC); // loadImage('https://pbs.twimg.com/media/FL9W_EQaQAIegtS?format=jpg'); // see https://twitter.com/infowssJP/status/1495276417390907395
  pic = loadImage(PIC_SRC);
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

const LINE_TEXT_1 = 'インターネット';
const LINE_TEXT_2 = 'やめろ';

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
  rainbowImg.mask(titleImg); // TODO: Imageにせず、canvasのglobalCompositeOperationに"source-atop"を使うと一つのcanvasで済むか確認する
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

// 動作時間 7.0%
/** タイトルを画像に書き込む
 * @param {import("p5").Image} titleImg
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} offsetX
 */
const drawTitleImg = (titleImg, x, y, w, h, offsetX) => {
  titleImg.copy(titleFillImg, x, y, w, h, offsetX, 0, w, h); // ここの内部で呼ばれている getImageData() が2番めに重め
};

// 動作時間 31.3% !!
/** 文字のドット画像を生成する
 * @param {import("p5").Image} titleImg
 * @returns {import("p5").Image}
 */
const createTitleDotImg = (titleImg) => {
  const titleDotImg = dotCanvas.get();
  // ↑ここの内部で呼ばれている getImageData() が一番重い
  // willReadFrequently はp5.jsでは対応していないっぽい https://stackoverflow.com/questions/75489567/how-to-set-canvas-attributes-from-p5-js
  // しかも、willReadFrequently は CPU で操作するようになるらしい https://github.com/processing/p5.js/issues/5840
  titleDotImg.mask(titleImg); // TODO: 重そうなのでいい方法を考える drawingContext.globalCompositeOperation = "source-atop"？

  return titleDotImg;
};

//  TODO:  画像のコピーに必要な座標とテキストの描画に必要な座標とで、２つの座標が存在してしまっているのをなおす？
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
  // タイトルの白枠線を描画する
  drawingContext.strokeText(titleText, textX, textY, TITLE_WIDTH);
};

/** picを円形に切り抜いて描画する
 */
const drawPic = () => {
  push();
  noStroke();
  ellipse(0, 0, pic.height);
  drawingContext.clip();
  image(pic, 0, 0);
  pop();
};

const dialCW = 1; // -1で文字の向きと回転を逆にする
const dialText = LINE_TEXT_1 + LINE_TEXT_2;
const dialTextRepeat = 6;
const dialFontSize = 16;
const dialBgWidth = dialFontSize * 1.7;
const dialTextAll = Array.from(dialText.repeat(dialTextRepeat));
const dialFontColor = '#ffffff';
const dialBgColor = 'rgb(20, 200, 240)';

/** 回転する文字盤を描画する
 * @param {number} frame
 */
const drawDial = (frame) => {
  const dialDiameter = height / 2 + dialBgWidth / 2;
  const dialDeltaRad = TWO_PI / dialTextAll.length;

  textAlign(CENTER, CENTER);
  textSize(dialFontSize);
  textFont('Zen Maru Gothic');

  // 文字盤の背景
  push();
  noFill();
  stroke(dialBgColor);
  strokeWeight(dialBgWidth);
  circle(0, 0, dialDiameter);
  pop();

  // 文字を描画
  push();
  fill(dialFontColor);
  noStroke();
  rotate(frame * 0.02 * dialCW);
  Array.from(dialText.repeat(dialTextRepeat)).forEach((char) => {
    rotate(-dialDeltaRad * dialCW);
    // 中心から半径分移動したところに一文字描く
    text(char, 0, (dialDiameter / 2) * dialCW);
  });
  pop();
};

/** テキストに影をつけて描画する
 * @param {string} textLine
 * @param {number} x
 * @param {number} y
 * @param {number} stringWidth
 */
const drawCenterTextLine = (textLine, x, y, stringWidth) => {
  const shadowOffsetX = 2;
  const shadowOffsetY = 5;

  push();
  // 影白ブラー
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 25;

  // 影白塗りつぶし
  fill(255, 255, 255, 192);
  drawingContext.fillText(
    textLine,
    x + shadowOffsetX,
    y + shadowOffsetY,
    stringWidth
  );

  // 影枠
  drawingContext.strokeText(
    textLine,
    x + shadowOffsetX,
    y + shadowOffsetY,
    stringWidth
  );

  pop();

  // 本体
  drawingContext.fillText(textLine, x, y, stringWidth);
};

/** 中央のコンテンツに乗せるテキストを描画する
 * @param {number} x
 * @param {number} y
 * @param {number} frame
 */
const drawCenterTexts = (x, y, frame) => {
  const fontSize = 48;
  const fontStrokeWeight = 2;
  const stringWidthRate = fontSize * 0.7;

  push();

  // picに対する文字列の座標
  translate(x, y);

  const colorRotate = frame * 4.75;
  const gradSize = (width / 2) * 0.75;

  // 文字色グラデーション
  const grad = drawingContext.createLinearGradient(-gradSize, 0, gradSize, 0);
  grad.addColorStop(0, `hsl(${colorRotate + 360}, 100%, 50%)`);
  grad.addColorStop(1 / 12, `hsl(${colorRotate + 300}, 100%, 50%)`);
  grad.addColorStop(2 / 12, `hsl(${colorRotate + 240}, 100%, 50%)`);
  grad.addColorStop(3 / 12, `hsl(${colorRotate + 180}, 100%, 50%)`);
  grad.addColorStop(4 / 12, `hsl(${colorRotate + 120}, 100%, 50%)`);
  grad.addColorStop(5 / 12, `hsl(${colorRotate + 60}, 100%, 50%)`);
  grad.addColorStop(6 / 12, `hsl(${colorRotate + 0}, 100%, 50%)`);

  grad.addColorStop(7 / 12, `hsl(${colorRotate + 300}, 100%, 50%)`);
  grad.addColorStop(8 / 12, `hsl(${colorRotate + 240}, 100%, 50%)`);
  grad.addColorStop(9 / 12, `hsl(${colorRotate + 180}, 100%, 50%)`);
  grad.addColorStop(10 / 12, `hsl(${colorRotate + 120}, 100%, 50%)`);
  grad.addColorStop(11 / 12, `hsl(${colorRotate + 60}, 100%, 50%)`);
  grad.addColorStop(1, `hsl(${colorRotate + 0}, 100%, 50%)`);
  drawingContext.fillStyle = grad;
  drawingContext.strokeStyle = grad;

  // 描画設定
  textSize(fontSize);
  textStyle(BOLDITALIC);
  textAlign(CENTER, TOP);
  strokeWeight(fontStrokeWeight);
  textFont("'M PLUS Rounded 1c'");

  // 描画
  drawCenterTextLine(LINE_TEXT_1, 0, 0, LINE_TEXT_1.length * stringWidthRate);
  drawCenterTextLine(
    LINE_TEXT_2,
    0,
    fontSize,
    LINE_TEXT_2.length * stringWidthRate
  );

  pop();
};

/** 中央のコンテンツを描画する
 * @param {number} x
 * @param {number} y
 * @param {number} frame
 */
const drawCenterContent = (x, y, frame) => {
  // 画像
  push();
  imageMode(CENTER);
  translate(x, y);

  drawPic();
  drawDial(frame);
  drawCenterTexts(0, 10, frame);

  pop();
};

// 動作時間 42.2%
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
  drawCenterContent(centerX, centerY - 20, frameCount * (60 / FPS));

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

  const picSize = height * 0.5;

  room.resize((room.width * height) / room.height, height); // width, (room.height * width) / room.width;
  pic.resize(picSize, picSize);

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
