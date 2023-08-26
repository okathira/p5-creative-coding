precision highp float;

varying vec2 vTexCoord;
uniform vec2 resolution;
uniform vec2 mousePos;

void main() {
  vec2 pos = vTexCoord;
  vec2 mouse = vec2(mousePos.x / resolution.x, mousePos.y / resolution.y);

  float d = length(pos - 0.5) * 2.0;

  // vec3 color = vec3(pos.xy, (pos.x + pos.y) / 2.0);
  vec3 color = 1. - vec3(mouse.xy, (pos.x + pos.y) / 2.) * d;
  // vec3 color = vec3(d);


  gl_FragColor = vec4(color, 1.0);
}