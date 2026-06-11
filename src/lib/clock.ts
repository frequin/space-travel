export type TimeSource = () => number;

const defaultTimeSource: TimeSource = () =>
  (typeof performance === "undefined" ? Date : performance).now();

export default class Clock {
  running = false;
  private previousTime = 0;
  private readonly now: TimeSource;

  constructor(now: TimeSource = defaultTimeSource) {
    this.now = now;
  }

  start(): void {
    this.previousTime = this.now();
    this.running = true;
  }

  stop(): void {
    this.running = false;
  }

  getDelta(): number {
    if (!this.running) {
      return 0;
    }

    const currentTime = this.now();
    const delta = (currentTime - this.previousTime) / 1000;
    this.previousTime = currentTime;
    return delta;
  }
}
