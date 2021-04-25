import { Color, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import Starfield, { StarfieldParameters } from "./starfield-object";
import Nebulae, { NebulaeParameters } from "./nebulae-object";
import type SpaceTravelContext from "./space-travel-context";

export interface SpaceTravelSceneParameters {
  backgroundColor?: SpaceTravel.Color;
  starfield?: StarfieldParameters;
  nebulae?: NebulaeParameters;
}

export default class SpaceTravelScene extends Scene {
  private camera: PerspectiveCamera;

  constructor(context: SpaceTravelContext, parameters: SpaceTravelSceneParameters = {}) {
    super();

    const {
      backgroundColor = 0x08000f,
      starfield: starfieldParameters,
      nebulae: nebulaeParameters
    } = parameters;

    const starfield = new Starfield(context, starfieldParameters);
    const nebulae = new Nebulae(context, nebulaeParameters);

    this.camera = this.createCamera();
    this.add(this.camera);
    this.setObjectRenderOrder(nebulae, 0);
    this.setObjectRenderOrder(starfield, 1);
    this.camera.add(nebulae);
    this.camera.add(starfield);
    this.frustumCulled = false;
    this.background = new Color(backgroundColor);
  }

  render(renderer: WebGLRenderer): void {
    renderer.render(this, this.camera);
  }

  setCameraAspectRatio(aspectRatio: number): void {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  private createCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(60, 1, 0.01, 500);
    camera.position.set(0, 0, -4);
    camera.lookAt(new Vector3(0, 0, 0));
    return camera;
  }

  private setObjectRenderOrder(parentObject: Object3D, order: number): void {
    parentObject.traverse((object) => {
      object.renderOrder = order;
    });
  }
}
