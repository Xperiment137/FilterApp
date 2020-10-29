precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random (in vec2 point) {
  return fract(100.0 * sin(point.x + fract(100.0 * sin(point.y)))); // http://www.matteo-basei.it/noise
}

float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1., 0.));
  float c = random(i + vec2(0., 1.));
  float d = random(i + vec2(1., 1.));

  vec2 u = f * f * (3. - 2. * f);

  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define octaves 7

float fbm (in vec2 p) {
  float value = 1.;
  float freq = 1.;
  float amp = .5;

  for (int i = 0; i < octaves; i++) {
    value += amp * (noise((p - vec2(1.)) * freq));
    freq *= 1.9;
    amp *= .6;
  }

  return value;
}

float pattern(in vec2 p) {
  vec2 offset = vec2(-.5);

  vec2 aPos = vec2(sin(u_time * .05), sin(u_time * .1)) * 6.;
  vec2 aScale = vec2(3.);
  float a = fbm(p * aScale + aPos);

  vec2 bPos = vec2(sin(u_time * .1), sin(u_time * .1)) * 1.;
  vec2 bScale = vec2(.5);
  float b = fbm((p + a) * bScale + bPos);

  vec2 cPos = vec2(-.6, -.5) + vec2(sin(-u_time * .01), sin(u_time * .1)) * 2.;
  vec2 cScale = vec2(2.);
  float c = fbm((p + b) * cScale + cPos);

  return c;
}

vec3 palette(in float t) {
  vec3 a = vec3(.5, .1, 0.);
  vec3 b = vec3(.9, .5, .1);
  vec3 c = vec3(.5, .5, .1);
  vec3 d = vec3(.1, .0, .1);
  return a + b * cos(7.28318 * (c * t + d));
}

void main() {
 vec4 fg = texture2D(uSampler, vTextureCoord);
  vec2 p = gl_FragCoord.xy / u_resolution.xy;
  p.x *= u_resolution.x / u_resolution.y;

  float value = pow(pattern(p), 2.);
  vec3 color  = palette(value);
   fg *=vec4(color, 1.);
  gl_FragColor = vec4(color, 1.);
}
