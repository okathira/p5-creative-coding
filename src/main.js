/**
 * @typedef { import("p5").Font } Font
 * @typedef { import("p5").Element } P5Element
 *
 * @typedef {Object} Entry
 * @property {number} step
 * @property {number} x
 * @property {number} y
 * @property {number} rot
 * @property {Letter[]=} chrs
 *
 * @typedef {Object} Letter
 * @property {number=} x
 * @property {number=} y
 * @property {number=} rot
 * @property {number=} size
 *
 * @typedef {{
 *  chrs: string
 *  entry: Entry
 *  letterAnimParamsList: AnimParam[][]
 *  lineAnimParams: AnimParam[]
 * }} TextLine
 *
 * @typedef {{
 *  x?: number
 *  y?: number
 *  rot?: number
 *  rotX?: number
 *  rotY?: number
 *  easing: EasingFuncName
 * } | {
 *  easing: EasingNoneName
 * }} AnimParam
 */

const BEAT_TIME = 350;
const DEFAULT_FONT_SIZE = 18;

/**
 * @typedef {(t: number) => number} EasingFunc
 * @typedef {'easeOutCubic' | 'easeLinear'} EasingFuncName
 * @typedef {'none'} EasingNoneName
 */

/**
 * @type {EasingFunc}
 */
const easeOutCubic = (t) => 1 - (1 - t) * (1 - t) * (1 - t);

/**
 * @type {EasingFunc}
 */
const easeLinear = (t) => t;

/**
 * @type {Record<EasingFuncName, EasingFunc> & Record<EasingNoneName, undefined> }
 */
const easingFuncList = {
  none: undefined,
  easeLinear,
  easeOutCubic,
};

// animLineFunc をパラメータで機能するように
/**
 * @type {(t: number, param: AnimParam) => void}
 */
const animLineFunc = (t, param) => {
  if (param.easing === 'none') return;

  const { x = 0, y = 0, rot = 0, rotX = 0, rotY = 0, easing } = param;

  const easedTime = easingFuncList[easing](t);

  translate(x * easedTime, y * easedTime);

  // 理論上は回転(rot)と平行移動(x, y)だけで表現できるが、利便性のために回転軸座標(rotX, rotY)ももたせる
  // translate(), rotate()が重そうなら、回転と平行移動のみに変換してぞれぞれ合計していくことで最後にまとめて処理できるはず
  translate(rotX, rotY);
  rotateZ(rot * easedTime);
  translate(-rotX, -rotY);
};

/**
 * @type {Font}
 */
let font;

function preload() {
  font = loadFont('./font/NotoSerifJP-Bold.otf');
}

/**
 * @type {P5Element}
 */
let pElement;

function setup() {
  createCanvas(750, 500, WEBGL);
  frameRate(60);
  pixelDensity(1);
  background(127);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(DEFAULT_FONT_SIZE);

  pElement = createP('info text');
  pElement.position(0, 0);

  angleMode(DEGREES);
}

let elapsedTime = 0;

const interact = () => {
  let additionalTime = 1;
  let factor = 1;

  if (keyIsPressed) {
    // Enter で最初から
    if (keyIsDown(ENTER)) {
      elapsedTime = 0;
      return;
    }

    // Space が押されている間時間をとめる
    if (keyIsDown(32)) {
      return;
    }

    if (keyIsDown(SHIFT)) {
      factor = 4;
    }
    if (keyIsDown(CONTROL)) {
      factor = 0.25;
    }

    if (keyIsDown(LEFT_ARROW)) {
      additionalTime -= 1 + 1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      additionalTime += 1;
    }
    if (keyIsDown(UP_ARROW)) {
      additionalTime -= 10 + 1;
    }
    if (keyIsDown(DOWN_ARROW)) {
      additionalTime += 10;
    }
  }

  elapsedTime += additionalTime * deltaTime * factor;
  if (elapsedTime < 0) elapsedTime = 0;
};

function draw() {
  background('#5a1212');

  interact();

  pElement.html(`elapsedTime: ${elapsedTime}`);

  textLines.map((line) => {
    const { chrs, entry, letterAnimParamsList, lineAnimParams } = line;
    const t = elapsedTime / BEAT_TIME;

    const step = Math.floor(t - entry.step);
    if (step < 0) return;

    push();

    // 初期値
    translate(entry.x, entry.y);
    rotateZ(entry.rot);

    // 文字の行にかかるアニメーション
    lineAnimParams.map((lineAnimParam, i) => {
      if (i < step) {
        animLineFunc(1, lineAnimParam);
      } else if (i === step) {
        animLineFunc(t % 1, lineAnimParam);
      }
    });

    // const letters = getLetters(chrs, limit(t));

    // TODO: 関数にする 中央から広がるパターンと左からスライドするパターンなども
    // それぞれの文字の座標を計算
    const chrArray = [...chrs];
    const chrNum = chrArray.length;
    const spacingX = 60;
    const centeringX = (spacingX * (chrNum - 1)) / 2;

    if (chrNum !== letterAnimParamsList.length)
      throw new Error('chrNum !== letterAnimParamsList.length');

    chrArray.map((chr, i) => {
      push();

      // 行の文字それぞれにかかるアニメーション
      translate(spacingX * i - centeringX, 0);

      // それぞれの文字が個別に持つアニメーション

      // 初期値
      if (entry.chrs) {
        if (chrNum !== entry.chrs.length)
          throw new Error('chrNum !== entry.chrs.length');

        const {
          x = 0,
          y = 0,
          rot = 0,
          size = DEFAULT_FONT_SIZE,
        } = entry.chrs[i];

        textSize(size);
        translate(x, y);
        rotateZ(rot);
      }

      // アニメーション
      const letterAnimParams = letterAnimParamsList[i];
      letterAnimParams.map((letterAnimParam, i) => {
        if (i < step) {
          animLineFunc(1, letterAnimParam);
        } else if (i === step) {
          animLineFunc(t % 1, letterAnimParam);
        }
      });

      text(chr, 0, 0);

      pop();
    });

    pop();
  });
}
