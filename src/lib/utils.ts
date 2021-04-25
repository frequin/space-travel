import { MathUtils } from "three";

export const random = (): number => MathUtils.seededRandom();

export const lerpWithPrecision = (
  start: number,
  end: number,
  interpolationFactor: number,
  precision: number
): number => {
  const value = MathUtils.lerp(start, end, interpolationFactor);
  return Math.abs(end - value) < precision ? end : value;
};
