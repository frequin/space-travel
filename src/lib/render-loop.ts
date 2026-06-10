export default class RenderLoop {
  private paused = true;
  private requestId = 0;
  private readonly onRender: () => void;

  constructor(callback: () => void) {
    this.onRender = () => {
      callback();
      this.requestNextRender();
    };
  }

  start(): void {
    if (!this.paused) {
      return;
    }

    this.paused = false;
    this.requestNextRender();
  }

  pause(): void {
    if (this.paused) {
      return;
    }

    this.paused = true;
    this.cancelNextRender();
  }

  private cancelNextRender(): void {
    if (this.requestId) {
      globalThis.cancelAnimationFrame(this.requestId);
    }
  }

  private requestNextRender(): void {
    this.requestId = globalThis.requestAnimationFrame(this.onRender);
  }
}
