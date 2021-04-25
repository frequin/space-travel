import { Color, MathUtils, Matrix4, ShaderMaterial, Texture, TextureLoader, Vector4 } from "three";
import { vertexShader, fragmentShader } from "./nebula-shader";

import type SpaceTravelContext from "./space-travel-context";

export interface NebulaMaterialParmeters {
  textureUrl?: string;
  colorRange?: SpaceTravel.Range<SpaceTravel.Color>;
  opacityRange?: SpaceTravel.Range<number>;
  repeatOffsetRange?: SpaceTravel.Range<[number, number]>;
  fallOffDistance?: number;
  speedRange?: SpaceTravel.Range<number>;
  rotationSpeedRange?: SpaceTravel.Range<number>;
}

const textureLoader = new TextureLoader();

const getMap = (textureUrl: string): Texture => {
  if (!textureUrl) {
    return new Texture();
  }

  const texture = textureLoader.load(textureUrl);
  const wrap = 1000;
  texture.wrapS = wrap;
  texture.wrapT = wrap;
  return texture;
};

export default class NebulaMaterial extends ShaderMaterial {
  private readonly context: SpaceTravelContext;
  private readonly speedRange: SpaceTravel.Range<number>;
  private readonly rotationSpeedRange: SpaceTravel.Range<number>;

  constructor(context: SpaceTravelContext, parameters: NebulaMaterialParmeters) {
    const {
      textureUrl = "",
      colorRange: { min: minColor, max: maxColor } = {
        min: 0xff0000,
        max: 0x0000ff
      },
      repeatOffsetRange: { min: minRepeatOffset, max: maxRepeatOffset } = {
        min: [1, 1],
        max: [0.15, 1]
      },
      opacityRange: { min: minOpacity, max: maxOpacity } = { min: 0.5, max: 1 },
      fallOffDistance = -8,
      speedRange = { min: 0.0025, max: 0.525 },
      rotationSpeedRange = { min: 1, max: 45 }
    } = parameters;

    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        globalOpacity: {
          value: 1
        },
        map: {
          value: getMap(textureUrl)
        },
        colorMin: {
          value: new Color(minColor)
        },
        colorMax: {
          value: new Color(maxColor)
        },
        opacityMin: {
          value: minOpacity
        },
        opacityMax: {
          value: maxOpacity
        },
        offsetRepeatMin: {
          value: new Vector4(1, 0, ...minRepeatOffset)
        },
        offsetRepeatMax: {
          value: new Vector4(1, 0, ...maxRepeatOffset)
        },
        fallOffDistance: {
          value: fallOffDistance
        },
        rotation: {
          value: new Matrix4()
        },
        throttle: {
          value: 0
        },
        distance: {
          value: 0
        },
        rotationDistance: {
          value: 0
        }
      }
    });

    this.context = context;
    this.speedRange = speedRange;
    this.rotationSpeedRange = rotationSpeedRange;

    this.transparent = true;
    this.depthWrite = false;
  }

  update(): void {
    const { delta, throttle, opacity } = this.context;
    this.uniforms.throttle.value = throttle;
    this.uniforms.globalOpacity.value = opacity;
    const speed = MathUtils.mapLinear(throttle, 0, 1, this.speedRange.min, this.speedRange.max);
    this.uniforms.distance.value += delta * speed;
    const rotationSpeed = MathUtils.mapLinear(
      throttle,
      0,
      1,
      this.rotationSpeedRange.min,
      this.rotationSpeedRange.max
    );
    this.uniforms.rotationDistance.value += MathUtils.degToRad(delta * rotationSpeed);
  }
}
