import { Group } from "three";
import Nebula, { NebulaParameters } from "./nebula-object";
import type SpaceTravelContext from "./space-travel-context";

export type NebulaeParameters = NebulaParameters[];

const defaultNebulaeParameters: NebulaeParameters = [
  {
    textureUrl: "https://webgl-space-travel.requin.pro/clouds1.jpg",
    colorRange: { min: 0xff0042, max: 0xff0042 },
    opacityRange: { min: 0.05, max: 0.2 },
    speedRange: { min: 0.0025, max: 0.175 },
    repeatOffsetRange: { min: [1, 1], max: [0.33, 1] },
    fallOffDistance: -8,
    rotationSpeedRange: { min: 1, max: 30 }
  },
  {
    textureUrl: "https://webgl-space-travel.requin.pro/noise3.jpg",
    colorRange: { min: 0x2659fd, max: 0x2659fd },
    opacityRange: { min: 0.05, max: 0.25 },
    speedRange: { min: 0.003, max: 0.075 },
    repeatOffsetRange: { min: [0.5, 1], max: [0.25, 1] },
    fallOffDistance: -6,
    rotationSpeedRange: { min: 0.5, max: 25 }
  },
  {
    textureUrl: "https://webgl-space-travel.requin.pro/noise3.jpg",
    colorRange: { min: 0x8500ef, max: 0x8500ef },
    opacityRange: { min: 0.02, max: 0.25 },
    speedRange: { min: 0.002, max: 0.1125 },
    repeatOffsetRange: { min: [0.75, 1], max: [0.35, 1] },
    fallOffDistance: -6,
    rotationSpeedRange: { min: 1.09, max: 31 }
  }
];

export default class Nebulae extends Group {
  constructor(
    context: SpaceTravelContext,
    parameters: NebulaeParameters = defaultNebulaeParameters
  ) {
    super();

    for (const nebulaParameters of parameters) {
      const nebula = new Nebula(context, nebulaParameters);
      this.add(nebula);
    }
  }
}
