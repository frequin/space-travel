import { Camera, Color, type OGLRenderingContext, type Renderer, Transform } from "ogl";
import Starfield, { type StarfieldParameters } from "./starfield-object";
import type { NebulaeParameters } from "./nebulae-object";
import type SpaceTravelContext from "./space-travel-context";
import type { Color as ColorValue } from "./types";

export interface SpaceTravelSceneParameters {
  backgroundColor?: ColorValue;
  starfield?: StarfieldParameters;
  nebulae?: NebulaeParameters;
}

export default class SpaceTravelScene extends Transform {
  private readonly camera: Camera;

  constructor(
    gl: OGLRenderingContext,
    context: SpaceTravelContext,
    parameters: SpaceTravelSceneParameters = {}
  ) {
    super();

    const { backgroundColor = 0x08000f, starfield: starfieldParameters } = parameters;

    const starfield = new Starfield(gl, context, starfieldParameters);

    this.camera = this.createCamera(gl);
    this.addChild(this.camera);
    this.camera.addChild(starfield);

    const [r, g, b] = new Color(backgroundColor);
    gl.clearColor(r, g, b, 1);
  }

  render(renderer: Renderer): void {
    renderer.render({ scene: this, camera: this.camera });
  }

  setCameraAspectRatio(aspectRatio: number): void {
    this.camera.perspective({ aspect: aspectRatio });
  }

  private createCamera(gl: OGLRenderingContext): Camera {
    const camera = new Camera(gl, { fov: 60, aspect: 1, near: 0.01, far: 500 });
    camera.position.set(0, 0, -4);
    camera.lookAt([0, 0, 0]);
    return camera;
  }
}
