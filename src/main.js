// ref:
// https://itp-xstory.github.io/p5js-shaders
// https://github.com/aferriss/p5jsShaderExamples
// https://www.youtube.com/watch?v=f4s1h2YETNY // current

/**
 * @type {import("p5").Shader}
 */
let theShader;

let animFrame = 0;

function preload() {
  theShader = loadShader('./shader.vert', './shader.frag');
}

function setup() {
  pixelDensity(1);
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);

  // noStroke();
}

function draw() {
  theShader.setUniform('resolution', [width, height]);
  theShader.setUniform('mousePos', [mouseX, mouseY]);
  theShader.setUniform('frame', [animFrame]);

  shader(theShader);

  // rect(0, 0, width, height);
  quad(-1, -1, -1, 1, 1, 1, 1, -1);

  resetShader();

  if (!mouseIsPressed) {
    animFrame += 1;
  } else {
    animFrame += -2;
  }
}
