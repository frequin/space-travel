// Park-Miller LCG, matching three's MathUtils.seededRandom() sequence and
// initial seed (1234567) so the seeded star layout is byte-identical.
let seed = 1234567;

export const random = (s?: number): number => {
  if (s !== undefined) seed = s % 2147483647;
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
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
