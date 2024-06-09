import { Mesh, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import NebulaMaterial, { NebulaMaterialParmeters } from "./nebula-material";
import type SpaceTravelContext from "./space-travel-context";

export interface NebulaParameters extends NebulaMaterialParmeters {
  coneModelUrl?: string;
}

export default class Nebula extends Object3D {
  constructor(context: SpaceTravelContext, parameters: NebulaParameters) {
    super();

    void this.createConeModel(context, parameters);
  }

  async createConeModel(
    context: SpaceTravelContext,
    parameters: NebulaParameters = {}
  ): Promise<void> {
    const {
      coneModelUrl = "https://webgl-space-travel.requin.pro/cone.glb",
      textureUrl,
      colorRange,
      opacityRange,
      repeatOffsetRange,
      fallOffDistance,
      speedRange,
      rotationSpeedRange
    } = parameters;
    const {
      scene: {
        children: [coneModel]
      }
    } = await new GLTFLoader().loadAsync(coneModelUrl);
    const coneModelMesh = coneModel as Mesh;

    const material = new NebulaMaterial(context, {
      textureUrl,
      colorRange,
      opacityRange,
      repeatOffsetRange,
      fallOffDistance,
      speedRange,
      rotationSpeedRange
    });

    coneModelMesh.material = material;
    coneModelMesh.scale.set(2, 1, 2);
    coneModelMesh.position.z -= 5;
    coneModelMesh.rotation.z = -Math.PI;

    coneModelMesh.onBeforeRender = () => {
      material.update();
    };

    this.add(coneModelMesh);
  }
}
