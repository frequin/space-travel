import {
  AdditiveBlending,
  Box3,
  Color,
  DoubleSide,
  MathUtils,
  Matrix4,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3
} from "three";

import { vertexShader, fragmentShader } from "./starfield-shader";
import type SpaceTravelContext from "./space-travel-context";

export interface StarfieldMaterialParameters {
  container?: {
    length: number;
    depth: number;
  };
  colorRange?: SpaceTravel.Range<SpaceTravel.Color>;
  thicknessRange?: SpaceTravel.Range<number>;
  rayLengthRange?: SpaceTravel.Range<number>;
  stretchFactorRange?: SpaceTravel.Range<number>;
  shakeSpeedFactor?: number;
  shakeStrengthFactor?: number;
  speedRange?: SpaceTravel.Range<number>;
  particleTextureUrl?: string;
  noiseTextureUrl?: string;
}

export default class StarfieldMaterial extends ShaderMaterial {
  private readonly context: SpaceTravelContext;
  private readonly speedRange: SpaceTravel.Range<number>;

  constructor(context: SpaceTravelContext, parameters: StarfieldMaterialParameters = {}) {
    const {
      container: { length: containerLength, depth: containerDepth } = {
        length: 40,
        depth: 40
      },
      colorRange: { min: minColor, max: maxColor } = {
        min: 0x3068ff,
        max: 0xf34f94
      },
      thicknessRange: { min: minThickness, max: maxThickness } = {
        min: 0.035,
        max: 0.06
      },
      rayLengthRange: { min: minRayLength, max: maxRayLength } = {
        min: 0.1,
        max: 2.5
      },
      stretchFactorRange: { min: minStretchFactor, max: maxStretchFactor } = {
        min: 0,
        max: 1.5
      },
      shakeSpeedFactor = 0.001,
      shakeStrengthFactor = 0.0035,
      speedRange = { min: 0.5, max: 60 },
      particleTextureUrl = "https://webgl-space-travel.requin.pro/particle-sprite.png",
      noiseTextureUrl = "https://webgl-space-travel.requin.pro/noise.jpg"
    } = parameters;

    const textureLoader = new TextureLoader();
    const particleTexture = textureLoader.load(particleTextureUrl);
    const noiseTexture = textureLoader.load(noiseTextureUrl);
    const wrap = 1000;
    noiseTexture.wrapT = wrap;
    noiseTexture.wrapS = wrap;

    const bbox = new Box3(
      new Vector3(-containerLength / 2, -containerLength / 2, -containerDepth / 2),
      new Vector3(containerLength / 2, containerLength / 2, containerDepth / 2)
    );

    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        globalOpacity: {
          value: 1
        },
        map: {
          value: particleTexture
        },
        noise: {
          value: noiseTexture
        },
        bboxMin: {
          value: bbox.min
        },
        bboxMax: {
          value: bbox.max
        },
        offset: {
          value: new Vector2(0, 0)
        },
        direction: {
          value: new Vector3(0, 0, 1)
        },
        rotation: {
          value: new Matrix4()
        },
        color1: {
          value: new Color(minColor)
        },
        color2: {
          value: new Color(maxColor)
        },
        minThickness: {
          value: minThickness
        },
        maxThickness: {
          value: maxThickness
        },
        minRayLength: {
          value: minRayLength
        },
        maxRayLength: {
          value: maxRayLength
        },
        minStretchFactor: {
          value: minStretchFactor
        },
        maxStretchFactor: {
          value: maxStretchFactor
        },
        shakeSpeedFactor: {
          value: shakeSpeedFactor
        },
        shakeStrengthFactor: {
          value: shakeStrengthFactor
        },
        throttle: {
          value: 0
        },
        distance: {
          value: 0
        }
      }
    });

    this.context = context;
    this.speedRange = speedRange;

    this.depthWrite = false;
    this.transparent = true;
    this.side = DoubleSide;
    this.blending = AdditiveBlending;
  }

  update(): void {
    const { delta, throttle, opacity } = this.context;
    this.uniforms.throttle.value = throttle;
    this.uniforms.globalOpacity.value = opacity;
    const speed = MathUtils.mapLinear(throttle, 0, 1, this.speedRange.min, this.speedRange.max);
    this.uniforms.distance.value += delta * speed;
  }
}
