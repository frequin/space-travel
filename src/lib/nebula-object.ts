import { Geometry, Mesh, type OGLRenderingContext } from "ogl";
import { coneIndices, conePositions, coneUvs } from "./cone-geometry";
import NebulaMaterial, { type NebulaMaterialParameters } from "./nebula-material";
import type SpaceTravelContext from "./space-travel-context";

export type NebulaParameters = NebulaMaterialParameters;

const createConeGeometry = (gl: OGLRenderingContext): Geometry =>
  new Geometry(gl, {
    position: { data: conePositions, size: 3 },
    uv: { data: coneUvs, size: 2 },
    index: { data: coneIndices }
  });

export default class Nebula extends Mesh {
  constructor(
    gl: OGLRenderingContext,
    context: SpaceTravelContext,
    parameters: NebulaParameters = {}
  ) {
    const program = new NebulaMaterial(gl, context, parameters);

    super(gl, {
      geometry: createConeGeometry(gl),
      program,
      renderOrder: 0
    });

    // The X rotation reproduces the cone.glb node transform that was baked
    // out of the raw arrays; the rest is scene placement. (Y is 0, so the
    // Euler order difference between three's XYZ and OGL's YXZ is moot.)
    this.rotation.set(Math.PI / 2, 0, -Math.PI);
    this.scale.set(2, 1, 2);
    this.position.z -= 5;

    this.onBeforeRender(() => {
      program.update();
    });
  }
}
