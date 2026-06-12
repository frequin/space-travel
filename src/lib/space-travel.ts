import { Renderer } from "ogl";
import RenderLoop from "./render-loop";
import SpaceTravelContext, { type SpaceTravelContextParameters } from "./space-travel-context";
import SpaceTravelScene, { type SpaceTravelSceneParameters } from "./space-travel-scene";

export type { SpaceTravelContextParameters } from "./space-travel-context";
export type { SpaceTravelSceneParameters } from "./space-travel-scene";
export type { StarfieldParameters } from "./starfield-object";
export type { NebulaParameters } from "./nebula-object";
export type { NebulaeParameters } from "./nebulae-object";
export type { Color, Range } from "./types";

export interface SpaceTravelParameters
  extends SpaceTravelContextParameters, SpaceTravelSceneParameters {
  canvas: HTMLCanvasElement;
}

export default class SpaceTravel {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: SpaceTravelContext;
  private readonly scene: SpaceTravelScene;
  private readonly renderer: Renderer;
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

    this.canvas = canvas;
    this.context = new SpaceTravelContext({
      throttle,
      throttleLerpFactor,
      opacity,
      startOpacity,
      opacityLerpFactor
    });
    this.renderer = this.createRenderer(canvas);
    this.scene = new SpaceTravelScene(this.renderer.gl, this.context, {
      backgroundColor,
      starfield,
      nebulae
    });
    this.setSize();
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
    this.setSize();
  }

  private createRenderer(canvas: HTMLCanvasElement): Renderer {
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new Renderer({ canvas, dpr });
    // OGL's Renderer constructor writes an inline 300x150 width/height onto the
    // canvas, which would override the consumer's stylesheet. Clear it so CSS
    // layout stays with the consumer (matching three's setSize updateStyle=false).
    canvas.style.width = "";
    canvas.style.height = "";
    return renderer;
  }

  // Mirrors three's renderer.setSize(w, h, /*updateStyle*/ false): drawing
  // buffer follows DPR, CSS layout is left to the consumer's stylesheet.
  private setSize(): void {
    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;
    this.renderer.width = width;
    this.renderer.height = height;
    this.canvas.width = Math.round(width * this.renderer.dpr);
    this.canvas.height = Math.round(height * this.renderer.dpr);
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
