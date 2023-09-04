/**
 * @typedef { import("p5").Font } Font
 *
 * @typedef {{
 *   chr: string
 *   x:number
 *   y:number
 * }} Letter
 *
 * @typedef {(text: string, t: number) => Letter[]} GetLetters
 *
 * @typedef {(t: number) => void} AnimLine
 *
 * @typedef {{
 *  chrs: string
 *  entryStep: number
 *  getLetters: GetLetters
 *  animLines: AnimLine[]
 * }} TextLine
 */

const TEMPO = 20;

/**
 * @type {GetLetters}
 */
const getLettersFunc = (chrs, t) => {
  const chrArray = [...chrs];
  const chrNum = chrArray.length;
  const spacingX = 50;
  const centeringX = (spacingX * (chrNum - 1)) / 2;
  return chrArray.map((chr, i) => ({
    chr,
    x: spacingX * i - centeringX,
    y: (() => {
      switch (i) {
        case 1:
          return 50 * t;
        case 2:
          return 15 * t;
        default:
          return 0;
      }
    })(), //t * i,
  }));
};

/**
 * @type {(t: number) => number}
 */
const easeOutCubic = (t) => 1 - (1 - t) * (1 - t) * (1 - t);

/**
 * @type {(t: number) => number}
 */
const limit = (t) => map(t, 0, 1, 0, 1, true);

/**
 * @type {AnimLine}
 */
const animLineFunc1 = (t) => {
  const x = -100;
  const y = 0;
  translate(x, y);
  rotateZ(10 * easeOutCubic(t));

  translate(-x, -y);
};

/**
 * @type {AnimLine}
 */
const animLineFunc2 = (t) => {
  const x = -100;
  const y = 50;
  translate(x, y);
  rotateZ(-30 * easeOutCubic(t));

  translate(-x, -y);
};

/**
 * @type {TextLine[]}
 */
const textLines = [
  {
    chrs: '<私は>',
    entryStep: 0,
    getLetters: getLettersFunc,
    animLines: [animLineFunc1, animLineFunc2],
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

let time = 0;
function draw() {
  if (mouseIsPressed) {
    time = 0;
  }

  background('#501010');

  textLines.map((line) => {
    const { chrs, entryStep, getLetters, animLines } = line;
    const t = time / TEMPO;

    const letters = getLetters(chrs, limit(t));

    push();

    animLines.map((animLine, i) => {
      const step = int(t - entryStep);

      if (i < step) {
        animLine(1);
      } else if (i === step) {
        animLine(t % 1);
      }
    });

    letters.map((letters) => {
      const { chr, x, y } = letters;

      text(chr, x, y);
    });

    pop();
  });

  time += 1;
}
