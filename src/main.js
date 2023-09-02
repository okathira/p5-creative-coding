const getMousePos = () => ({
  x: mouseX - windowWidth / 2,
  y: mouseY - windowHeight / 2,
});

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(127);
}

function draw() {
  // background(127);

  orbitControl();

  const { x, y } = getMousePos();

  // ellipse(x, y, 100, 100);

  translate(x, y);
  sphere(50);
}
