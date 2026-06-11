// Park-Miller LCG, matching three's MathUtils.seededRandom() sequence and
// initial seed so the seeded star layout is identical.
const lcgModulus = 2147483647; // 2^31 - 1
const lcgMultiplier = 16807;
let seed = 1234567;

export const random = (newSeed?: number): number => {
  if (newSeed !== undefined) seed = newSeed % lcgModulus;
  seed = (seed * lcgMultiplier) % lcgModulus;
  return (seed - 1) / (lcgModulus - 1);
};

// eslint-disable-next-line max-params
export const mapLinear = (x: number, a1: number, a2: number, b1: number, b2: number): number =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

export const lerp = (start: number, end: number, t: number): number => (1 - t) * start + t * end;

export const degToRad = (degrees: number): number => degrees * (Math.PI / 180);

export const lerpWithPrecision = (
  start: number,
  end: number,
  interpolationFactor: number,
  precision: number
): number => {
  const value = lerp(start, end, interpolationFactor);
  return Math.abs(end - value) < precision ? end : value;
};
