precision highp float;

varying vec2 vTexCoord;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float frame;

vec3 v3 = vec3(1.,1.,1);

vec3 palette(float t){
  vec3 a = v3 * -0.5;
  vec3 b = v3 * 1.6;
  vec3 c = v3 * 1.2;
  vec3 d = vec3(0.0, 1./3., 2./3.);

  return a + b*cos(3.14159*2.0*(c*t + d));
}

void main() {
  vec2 mouse = vec2(mousePos.x / resolution.x, mousePos.y / resolution.y) * 2.0 - 1.0;
	mouse.x *= resolution.x / resolution.y; // keep ratio
  mouse = vec2(-mouse.y, mouse.x); // 3d座標に向きを合わせる

  float time = frame / 60.0;

  vec2 uv = vTexCoord * 2.0 - 1.0;
  uv.y *= resolution.x / resolution.y; // keep ratio
  vec2 uv0 = uv;

  // uv = fract(uv * 2.) -0.5;

  float waveLength=8.;

  float d = length(uv-mouse);

  vec3 color = palette(length(uv0)+time);

  d = abs(sin(d*waveLength + time * 12.)/waveLength);

  d = 0.035 / d;
  color *= d;

  gl_FragColor = vec4(color, 1.0);
}