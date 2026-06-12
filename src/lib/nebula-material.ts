import { Color, Mat4, type OGLRenderingContext, Program, Texture, Vec4 } from "ogl";
import { vertexShader, fragmentShader } from "./nebula-shader";
import { loadImageTexture } from "./texture";
import { degToRad, mapLinear } from "./utils";
import type SpaceTravelContext from "./space-travel-context";
import type { Color as ColorValue, Range } from "./types";

export interface NebulaMaterialParameters {
  textureUrl?: string;
  colorRange?: Range<ColorValue>;
  opacityRange?: Range<number>;
  repeatOffsetRange?: Range<[number, number]>;
  fallOffDistance?: number;
  speedRange?: Range<number>;
  rotationSpeedRange?: Range<number>;
}

const getMap = (gl: OGLRenderingContext, textureUrl: string): Texture => {
  if (!textureUrl) {
    return new Texture(gl);
  }

  const texture = new Texture(gl, { wrapS: gl.REPEAT, wrapT: gl.REPEAT });
  loadImageTexture(texture, textureUrl);
  return texture;
};

export default class NebulaMaterial extends Program {
  private readonly context: SpaceTravelContext;
  private readonly speedRange: Range<number>;
  private readonly rotationSpeedRange: Range<number>;

  constructor(
    gl: OGLRenderingContext,
    context: SpaceTravelContext,
    parameters: NebulaMaterialParameters
  ) {
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

    super(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        globalOpacity: {
          value: 1
        },
        map: {
          value: getMap(gl, textureUrl)
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
          value: new Vec4(1, 0, ...minRepeatOffset)
        },
        offsetRepeatMax: {
          value: new Vec4(1, 0, ...maxRepeatOffset)
        },
        fallOffDistance: {
          value: fallOffDistance
        },
        rotation: {
          value: new Mat4()
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
      },
      transparent: true,
      depthWrite: false
    });

    this.context = context;
    this.speedRange = speedRange;
    this.rotationSpeedRange = rotationSpeedRange;
  }

  update(): void {
    const { delta, throttle, opacity } = this.context;
    this.uniforms.throttle.value = throttle;
    this.uniforms.globalOpacity.value = opacity;
    const speed = mapLinear(throttle, 0, 1, this.speedRange.min, this.speedRange.max);
    this.uniforms.distance.value += delta * speed;
    const rotationSpeed = mapLinear(
      throttle,
      0,
      1,
      this.rotationSpeedRange.min,
      this.rotationSpeedRange.max
    );
    this.uniforms.rotationDistance.value += degToRad(delta * rotationSpeed);
  }
}
