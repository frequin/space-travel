import { Geometry, Mesh, type OGLRenderingContext } from "ogl";
import StarfieldMaterial, { type StarfieldMaterialParameters } from "./starfield-material";
import { mapLinear, random } from "./utils";
import type SpaceTravelContext from "./space-travel-context";

export interface StarfieldParameters extends StarfieldMaterialParameters {
  count?: number;
}

const createGeometry = (
  gl: OGLRenderingContext,
  count: number,
  containerLength: number,
  containerDepth: number
): Geometry => {
  const positions = [];
  const corners = [];
  const uvs = [];
  const bufferIndex = [];
  const colorMixes = [];

  for (let index = 0; index < count; index++) {
    const posX = mapLinear(random(), 0, 1, -containerLength / 2, containerLength / 2);
    const posY = mapLinear(random(), 0, 1, -containerLength / 2, containerLength / 2);
    const posZ = mapLinear(random(), 0, 1, -containerDepth / 2, containerDepth / 2);
    positions.push(posX, posY, posZ, posX, posY, posZ, posX, posY, posZ, posX, posY, posZ);
    uvs.push(0, 1, 1, 1, 0, 0, 1, 0);
    corners.push(0, 1, 2, 3);
    const colorMix = random();
    colorMixes.push(colorMix, colorMix, colorMix, colorMix);
    const itemIndex = 4 * index;
    bufferIndex.push(
      itemIndex,
      itemIndex + 1,
      itemIndex + 2,
      itemIndex + 1,
      itemIndex + 3,
      itemIndex + 2
    );
  }

  return new Geometry(gl, {
    position: { data: new Float32Array(positions), size: 3 },
    uv: { data: new Float32Array(uvs), size: 2 },
    corner: { data: new Float32Array(corners), size: 1 },
    colorMix: { data: new Float32Array(colorMixes), size: 1 },
    index: { data: new Uint16Array(bufferIndex) }
  });
};

export default class Starfield extends Mesh {
  constructor(
    gl: OGLRenderingContext,
    context: SpaceTravelContext,
    parameters: StarfieldParameters = {}
  ) {
    const {
      count = 1500,
      container: { length: containerLength, depth: containerDepth } = {
        length: 40,
        depth: 40
      },
      container,
      ...materialParameters
    } = parameters;

    const geometry = createGeometry(gl, count, containerLength, containerDepth);
    const program = new StarfieldMaterial(gl, context, { container, ...materialParameters });

    super(gl, {
      geometry,
      program,
      frustumCulled: false,
      renderOrder: 1
    });

    this.position.z -= containerDepth / 2;

    this.onBeforeRender(() => {
      program.update();
    });
  }
}
