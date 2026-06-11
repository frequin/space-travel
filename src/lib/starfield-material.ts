import { Color, Mat4, type OGLRenderingContext, Program, Texture, Vec2, Vec3 } from "ogl";
import { vertexShader, fragmentShader } from "./starfield-shader";
import { mapLinear } from "./utils";
import type SpaceTravelContext from "./space-travel-context";
import type { Color as ColorValue, Range } from "./types";

export interface StarfieldMaterialParameters {
  container?: {
    length: number;
    depth: number;
  };
  colorRange?: Range<ColorValue>;
  thicknessRange?: Range<number>;
  rayLengthRange?: Range<number>;
  stretchFactorRange?: Range<number>;
  shakeSpeedFactor?: number;
  shakeStrengthFactor?: number;
  speedRange?: Range<number>;
  particleTextureUrl?: string;
  noiseTextureUrl?: string;
}

const loadImageTexture = (texture: Texture, url: string): void => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.addEventListener("load", () => {
    texture.image = image;
  });
  image.src = url;
};

export default class StarfieldMaterial extends Program {
  private readonly context: SpaceTravelContext;
  private readonly speedRange: Range<number>;

  constructor(
    gl: OGLRenderingContext,
    context: SpaceTravelContext,
    parameters: StarfieldMaterialParameters = {}
  ) {
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

    const particleTexture = new Texture(gl);
    loadImageTexture(particleTexture, particleTextureUrl);
    const noiseTexture = new Texture(gl, {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });
    loadImageTexture(noiseTexture, noiseTextureUrl);

    super(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        globalOpacity: { value: 1 },
        map: { value: particleTexture },
        noise: { value: noiseTexture },
        bboxMin: {
          value: new Vec3(-containerLength / 2, -containerLength / 2, -containerDepth / 2)
        },
        bboxMax: {
          value: new Vec3(containerLength / 2, containerLength / 2, containerDepth / 2)
        },
        offset: { value: new Vec2(0, 0) },
        direction: { value: new Vec3(0, 0, 1) },
        rotation: { value: new Mat4() },
        color1: { value: new Color(minColor) },
        color2: { value: new Color(maxColor) },
        minThickness: { value: minThickness },
        maxThickness: { value: maxThickness },
        minRayLength: { value: minRayLength },
        maxRayLength: { value: maxRayLength },
        minStretchFactor: { value: minStretchFactor },
        maxStretchFactor: { value: maxStretchFactor },
        shakeSpeedFactor: { value: shakeSpeedFactor },
        shakeStrengthFactor: { value: shakeStrengthFactor },
        throttle: { value: 0 },
        distance: { value: 0 }
      },
      depthWrite: false,
      cullFace: false
    });

    this.context = context;
    this.speedRange = speedRange;
    this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
  }

  update(): void {
    const { delta, throttle, opacity } = this.context;
    this.uniforms.throttle.value = throttle;
    this.uniforms.globalOpacity.value = opacity;
    const speed = mapLinear(throttle, 0, 1, this.speedRange.min, this.speedRange.max);
    this.uniforms.distance.value += delta * speed;
  }
}
