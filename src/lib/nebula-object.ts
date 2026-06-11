import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { coneIndices, conePositions, coneUvs } from "./cone-geometry";
import NebulaMaterial, { type NebulaMaterialParameters } from "./nebula-material";
import type SpaceTravelContext from "./space-travel-context";

export type NebulaParameters = NebulaMaterialParameters;

const createConeGeometry = (): BufferGeometry => {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(conePositions, 3));
  geometry.setAttribute("uv", new BufferAttribute(coneUvs, 2));
  geometry.setIndex(new BufferAttribute(coneIndices, 1));
  return geometry;
};

export default class Nebula extends Mesh {
  constructor(context: SpaceTravelContext, parameters: NebulaParameters = {}) {
    const material = new NebulaMaterial(context, parameters);
    super(createConeGeometry(), material);

    // Matches the original cone.glb node rotation (90° around X) followed by
    // the runtime override of rotation.z. Scale/position carried over from
    // the previous GLTFLoader-based wiring.
    this.rotation.set(Math.PI / 2, 0, -Math.PI);
    this.scale.set(2, 1, 2);
    this.position.z -= 5;

    this.onBeforeRender = () => {
      material.update();
    };
  }
}
