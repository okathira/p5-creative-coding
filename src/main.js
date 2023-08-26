// ref:
// https://itp-xstory.github.io/p5js-shaders
// https://github.com/aferriss/p5jsShaderExamples

/**
 * @type {import("p5").Shader}
 */
let theShader;

function preload() {
  theShader = loadShader('./shader.vert', './shader.frag');
}

function setup() {
  pixelDensity(1);
  frameRate(60);
  createCanvas(500, 500, WEBGL);

  // noStroke();
}

function draw() {
  theShader.setUniform('resolution', [width, height]);
  theShader.setUniform('mousePos', [mouseX, mouseY]);

  shader(theShader);

  // rect(0, 0, width, height);
  quad(-1, -1, -1, 1, 1, 1, 1, -1);

  resetShader();
}
