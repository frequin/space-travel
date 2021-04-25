import { BufferGeometry, BufferAttribute, MathUtils, Mesh } from "three";
import StarfieldMaterial, { StarfieldMaterialParameters } from "./starfield-material";
import { random } from "./utils";
import type SpaceTravelContext from "./space-travel-context";

export interface StarfieldParameters extends StarfieldMaterialParameters {
  count?: number;
}

const createGeometry = (
  count: number,
  containerLength: number,
  containerDepth: number
): BufferGeometry => {
  const positions = [];
  const corners = [];
  const uvs = [];
  const bufferIndex = [];
  const colorMixes = [];
  const bufferGeometry = new BufferGeometry();

  for (let index = 0; index < count; index++) {
    const posX = MathUtils.mapLinear(random(), 0, 1, -containerLength / 2, containerLength / 2);
    const posY = MathUtils.mapLinear(random(), 0, 1, -containerLength / 2, containerLength / 2);
    const posZ = MathUtils.mapLinear(random(), 0, 1, -containerDepth / 2, containerDepth / 2);
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

  bufferGeometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  bufferGeometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
  bufferGeometry.setAttribute("corner", new BufferAttribute(new Float32Array(corners), 1));
  bufferGeometry.setAttribute("colorMix", new BufferAttribute(new Float32Array(colorMixes), 1));
  bufferGeometry.setIndex(bufferIndex);

  return bufferGeometry;
};

export default class Starfield extends Mesh {
  constructor(context: SpaceTravelContext, parameters: StarfieldParameters = {}) {
    const {
      count = 1500,
      container: { length: containerLength, depth: containerDepth } = {
        length: 40,
        depth: 40
      },
      container,
      colorRange,
      thicknessRange,
      rayLengthRange,
      speedRange,
      stretchFactorRange,
      shakeSpeedFactor,
      shakeStrengthFactor
    } = parameters;

    const geometry = createGeometry(count, containerLength, containerDepth);
    const material = new StarfieldMaterial(context, {
      container,
      colorRange,
      thicknessRange,
      rayLengthRange,
      speedRange,
      stretchFactorRange,
      shakeSpeedFactor,
      shakeStrengthFactor
    });

    super(geometry, material);

    this.frustumCulled = false;
    this.position.z -= containerDepth / 2;

    this.onBeforeRender = () => {
      material.update();
    };
  }
}
