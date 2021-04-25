export const vertexShader = `
attribute float corner;
attribute float colorMix;

varying vec2 vUv;
varying vec3 vColor;

uniform float globalOpacity;
uniform sampler2D noise;
uniform vec3 bboxMax;
uniform vec3 bboxMin;
uniform vec2 offset;
uniform vec3 direction;
uniform mat4 rotation;
uniform vec3 color1;
uniform vec3 color2;
uniform float minThickness;
uniform float maxThickness;
uniform float minRayLength;
uniform float maxRayLength;
uniform float minStretchFactor;
uniform float maxStretchFactor;
uniform float shakeSpeedFactor;
uniform float shakeStrengthFactor;
uniform float throttle;
uniform float distance;

float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}


void main() {
  vUv = uv;

  // set particle color based on mix attribute
  vColor = mix(color1, color2, colorMix);

  float zRange = bboxMax.z - bboxMin.z;
  float yRange = bboxMax.y - bboxMin.y;
  float xRange = bboxMax.x - bboxMin.x;

  vec3 pos = position;
  pos += (distance * vec3(0.0, 0.0, 1.0));
  pos.x -= offset.x;
  pos.x = mod(pos.x, xRange) - xRange / 2.0;
  pos.y -= offset.y;
  pos.y = mod(pos.y, yRange) - (yRange / 2.0);
  pos.z = mod(pos.z, zRange) - zRange / 2.0;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 worldOrigin = worldPos;
  vec4 pOrigin = projectionMatrix * viewMatrix * worldOrigin;

  float globalSizeFactor = clamp(remap(pOrigin.z, zRange, zRange * 0.925, 0.0, globalOpacity), 0.0, globalOpacity);
  float rayLength = remap(throttle, 0.0, 1.0, minRayLength, maxRayLength);
  float stretchFactor = remap(throttle, 0.0, 1.0, minStretchFactor, maxStretchFactor);

  if (corner == 3.0 || corner == 1.0) {
    worldPos.xyz -= (direction * rayLength * stretchFactor * globalSizeFactor);
  }

  if (corner == 0.0 || corner == 2.0) {
    worldPos.xyz += (direction * rayLength * stretchFactor * globalSizeFactor);
  }

  vec4 viewPosition = viewMatrix * worldPos;
  viewPosition = rotation * vec4(viewPosition.xyz, 1.0);

  float size =  0.1 * globalSizeFactor;
  float thickness = remap(throttle, 0.0, 1.0, minThickness, maxThickness);
  float verticalStretch = mix(size, thickness, stretchFactor);
  float angle = atan(-worldOrigin.y, -worldOrigin.x);

  if (corner == 0.0) {
    viewPosition.xy += rotate(vec2(-size, -verticalStretch), angle);
  }

  if (corner == 1.0) {
    viewPosition.xy += rotate(vec2(size, -verticalStretch), angle);
  }

  if (corner == 2.0) {
    viewPosition.xy += rotate(vec2(-size, verticalStretch), angle);
  }

  if (corner == 3.0) {
    viewPosition.xy += rotate(vec2(size, verticalStretch), angle);
  }

  // Camera Shake
  float shakeSpeed = shakeSpeedFactor * throttle;
  float offsetX = remap(texture2D(noise, vec2(distance * shakeSpeed, 0)).r, 0.0, 1.0, -1.0, 1.0);
  float offsetY = remap(texture2D(noise, vec2(distance * shakeSpeed, 0.5)).r, 0.0, 1.0, -1.0, 1.0);
  float shakeStrength = shakeStrengthFactor * throttle;
  vec2 shakeOffset = vec2(offsetX, offsetY) * shakeStrength;

  vec4 pPosition = projectionMatrix * viewPosition;
  pPosition.xy /= pPosition.w;
  pPosition.xy += shakeOffset;
  pPosition.xy *= pPosition.w;

  gl_Position = pPosition;
}
`;

export const fragmentShader = `
varying vec2 vUv;
varying vec3 vColor;

uniform sampler2D map;

void main() {
  vec4 texel = texture2D(map, vUv);
  float alpha = texel.r;
  vec3 color = mix(vColor, vec3(1.0), texel.r);

  gl_FragColor = vec4(color, alpha);
}
`;
