/**
 * @typedef { import("p5").Font } Font
 *
 * @typedef {Object} Entry
 * @property {number} step
 * @property {number} x
 * @property {number} y
 * @property {number} rot
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

const TEMPO = 17.5;

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

  // 理論上は回転(rot)と平行移動(x, y)だけで表現できるが、利便性のために回転軸座標(rotX, rotY)ももたせる
  // translate(), rotate()が重そうなら、回転と平行移動のみに変換してぞれぞれ合計していくことで最後にまとめて処理できるはず
  translate(rotX, rotY);
  rotateZ(rot * easedTime);
  translate(-rotX, -rotY);

  translate(x * easedTime, y * easedTime);
};

/**
 * @type {TextLine[]}
 */
const textLines = [
  {
    chrs: '<私は>',
    entry: { step: 0, x: 0, y: 0, rot: 0 },
    letterAnimParamsList: [
      [{ easing: 'none' }],
      [{ easing: 'easeLinear', y: 40 }],
      [{ easing: 'easeLinear', y: 10 }],
      [{ easing: 'none' }],
    ],
    lineAnimParams: [
      { rot: 10, rotX: -100, easing: 'easeOutCubic' },
      { rot: -30, rotX: -100, rotY: 50, easing: 'easeOutCubic' },
    ],
  },
  {
    chrs: '集積の',
    entry: { step: 1, x: 60, y: 60, rot: 0 },
    letterAnimParamsList: [
      [{ easing: 'easeLinear', y: 40 }],
      [{ easing: 'none' }],
      [{ easing: 'none' }],
    ],
    lineAnimParams: [{ rot: 10, rotX: 200, easing: 'easeOutCubic' }],
  },
];

/**
 * @type {Font}
 */
let font;

function preload() {
  font = loadFont('./font/NotoSerifJP-Bold.otf');
}

function setup() {
  createCanvas(750, 500, WEBGL);
  frameRate(60);
  pixelDensity(1);
  background(127);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(20);

  angleMode(DEGREES);
}

let frame = 0;
function draw() {
  if (mouseIsPressed) {
    frame = 0;
  }

  background('#5a1212');

  textLines.map((line) => {
    const { chrs, entry, letterAnimParamsList, lineAnimParams } = line;
    const t = frame / TEMPO;

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

  frame += 1;
}
