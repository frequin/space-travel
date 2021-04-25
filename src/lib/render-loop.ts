export default class RenderLoop {
  private paused: boolean;
  private requestId: number;
  private readonly onRender: () => void;

  constructor(callback: () => void) {
    this.paused = true;
    this.requestId = 0;
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
      window.cancelAnimationFrame(this.requestId);
    }
  }

  private requestNextRender(): void {
    this.requestId = window.requestAnimationFrame(this.onRender);
  }
}
