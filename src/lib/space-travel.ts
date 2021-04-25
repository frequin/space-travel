import { WebGLRenderer } from "three";
import RenderLoop from "./render-loop";
import SpaceTravelContext, { SpaceTravelContextParameters } from "./space-travel-context";
import SpaceTravelScene, { SpaceTravelSceneParameters } from "./space-travel-scene";

interface SpaceTravelParameters extends SpaceTravelContextParameters, SpaceTravelSceneParameters {
  canvas: HTMLCanvasElement;
}

export default class SpaceTravel {
  private readonly context: SpaceTravelContext;
  private readonly scene: SpaceTravelScene;
  private readonly renderer: WebGLRenderer;
  private readonly renderLoop: RenderLoop;

  constructor(parameters: SpaceTravelParameters) {
    const {
      canvas,
      backgroundColor,
      throttle,
      throttleLerpFactor,
      opacity,
      startOpacity,
      opacityLerpFactor,
      starfield,
      nebulae
    } = parameters;

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError("Invalid canvas");
    }

    this.context = new SpaceTravelContext({
      throttle,
      throttleLerpFactor,
      opacity,
      startOpacity,
      opacityLerpFactor
    });
    this.scene = new SpaceTravelScene(this.context, {
      backgroundColor,
      starfield,
      nebulae
    });
    this.renderer = this.createRenderer(canvas);
    this.setSize(canvas);
    this.renderLoop = new RenderLoop(this.onRender.bind(this));
  }

  get throttle(): number {
    return this.context.throttleTarget;
  }

  set throttle(value: number) {
    this.context.setThrottle(value);
  }

  get opacity(): number {
    return this.context.opacityTarget;
  }

  set opacity(value: number) {
    this.context.setOpacity(value);
  }

  start(): void {
    this.context.start();
    this.renderLoop.start();
  }

  // Alias of start
  resume(): void {
    this.start();
  }

  pause(): void {
    this.context.pause();
    this.renderLoop.pause();
  }

  resize(): void {
    this.setSize(this.renderer.domElement);
  }

  private createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
    const renderer = new WebGLRenderer({ canvas });
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    return renderer;
  }

  private setSize(canvas: HTMLCanvasElement) {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    this.renderer.setSize(width, height, false);
    this.scene.setCameraAspectRatio(width / height);
  }

  private isRenderable(): boolean {
    const { opacity } = this.context;
    return opacity !== 0;
  }

  private onRender(): void {
    this.context.update();

    if (this.isRenderable()) {
      this.scene.render(this.renderer);
    }
  }
}
