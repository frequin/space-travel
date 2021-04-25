declare module "*.glb" {
  const value: string;
  export = value;
}

declare namespace SpaceTravel {
  type Color = number | string;

  interface Range<K> {
    min: K;
    max: K;
  }
}
