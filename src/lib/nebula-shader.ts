export const vertexShader = `
varying vec2 vUvSample1;
varying vec2 vUvSample2;
varying vec2 vUvSample3;
varying vec3 vViewPosition;

uniform float throttle;
uniform vec4 offsetRepeatMin;
uniform vec4 offsetRepeatMax;
uniform float distance;
uniform float rotationDistance;
uniform mat4 rotation;

vec2 transformUV(in vec2 uv, in float t, in vec2 offset, in vec2 scale) {
  vec2 result = vec2(uv.x, uv.y);
  result *= scale;
  result += (offset * t);
  return result;
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

void main() {
  vec4 offsetRepeat = mix(offsetRepeatMin, offsetRepeatMax, throttle);

  vec2 uvOffset1 = offsetRepeat.xy * vec2(1.0, 1.0);
  vec2 uvOffset2 = offsetRepeat.xy * vec2(1.0, 1.0);
  vec2 uvOffset3 = offsetRepeat.xy * vec2(1.0, 1.0);

  vec2 uvScale1 = offsetRepeat.zw * vec2(1.0, 1.0);
  vec2 uvScale2 = offsetRepeat.zw * vec2(0.5, 1.0);
  vec2 uvScale3 = offsetRepeat.zw * vec2(2.0, 1.0);

  vUvSample1 = transformUV(uv, distance * 2.0, uvOffset1, uvScale1);
  vUvSample2 = transformUV(uv, distance * 0.5, uvOffset2, uvScale2);
  vUvSample3 = transformUV(uv, distance * 8.0, uvOffset3, uvScale3);

  vec3 viewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

  viewPosition.xy = rotate(viewPosition.xy, rotationDistance);

  viewPosition = (rotation * vec4(viewPosition, 1.0)).xyz;

  vViewPosition = viewPosition;

  gl_Position = projectionMatrix * vec4(viewPosition, 1.0);
}
`;

export const fragmentShader = `
varying vec2 vUvSample1;
varying vec2 vUvSample2;
varying vec2 vUvSample3;
varying vec3 vViewPosition;

uniform float throttle;
uniform vec3 colorMin;
uniform vec3 colorMax;
uniform float opacityMin;
uniform float opacityMax;
uniform float globalOpacity;
uniform sampler2D map;
uniform float fallOffDistance;

float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float linearTosRGB(const in float c) {
  if (c >= 1.0) return 1.0;
  float S1 = sqrt(c);
  float S2 = sqrt(S1);
  float S3 = sqrt(S2);
  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * c;
}

void main() {
  vec3 color = mix(colorMin, colorMax, throttle);
  float opacity = mix(opacityMin, opacityMax, throttle) * globalOpacity;
  vec4 outputColor = vec4(color, opacity);

  vec4 sample1 = texture2D(map, vUvSample1);
  vec4 sample2 = texture2D(map, vUvSample2);
  vec4 sample3 = texture2D(map, vUvSample3);

  float alpha = sample1.r * sample2.r * sample3.r * 4.0;

  float falloff = clamp(remap(vViewPosition.z, 0.0, fallOffDistance, 1.0, 0.0), 0.0, 1.0);

  outputColor.a *= alpha;

  outputColor.a = linearTosRGB(outputColor.a);

  outputColor.a *= falloff;

  gl_FragColor = outputColor;
}
`;
