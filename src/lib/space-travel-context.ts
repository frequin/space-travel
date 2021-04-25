import { Clock } from "three";
import { lerpWithPrecision } from "./utils";

export interface SpaceTravelContextParameters {
  throttle?: number;
  throttleLerpFactor?: number;
  opacity?: number;
  opacityLerpFactor?: number;
  startOpacity?: number;
}

const lerpPrecision = 0.01;

export default class SpaceTravelContext {
  delta: number;
  throttle: number;
  throttleTarget: number;
  throttleLerpFactor: number;
  opacity: number;
  opacityTarget: number;
  opacityLerpFactor: number;
  private readonly clock: Clock;

  constructor(parameters: SpaceTravelContextParameters = {}) {
    const {
      throttle = 0,
      throttleLerpFactor = 0.035,
      opacity = 1,
      opacityLerpFactor = 0.016,
      startOpacity = 0
    } = parameters;

    this.clock = new Clock(false);
    this.delta = 0;
    this.throttle = throttle;
    this.throttleTarget = throttle;
    this.throttleLerpFactor = throttleLerpFactor;
    this.opacity = startOpacity;
    this.opacityTarget = opacity;
    this.opacityLerpFactor = opacityLerpFactor;
    this.update();
  }

  get isPaused(): boolean {
    return !this.clock.running;
  }

  update(): void {
    this.delta = this.clock.getDelta();

    if (this.throttle !== this.throttleTarget) {
      this.throttle = lerpWithPrecision(
        this.throttle,
        this.throttleTarget,
        this.throttleLerpFactor,
        lerpPrecision
      );
    }

    if (this.opacity !== this.opacityTarget) {
      this.opacity = lerpWithPrecision(
        this.opacity,
        this.opacityTarget,
        this.opacityLerpFactor,
        lerpPrecision
      );
    }
  }

  start(): void {
    this.clock.start();
  }

  pause(): void {
    this.clock.stop();
  }

  setThrottle(value: number): void {
    this.throttleTarget = value;
  }

  setOpacity(value: number): void {
    this.opacityTarget = value;
  }
}
