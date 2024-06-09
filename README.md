# Space Travel

[demo](https://webgl-space-travel.requin.pro/)

WebGL space scene with lightspeed warp effect.

**Strongly** inspired by https://nova.app/. Entirely rewritten in typescript.

Use [three.js](https://threejs.org/) JavaScript 3D library under the hood.

## Usage

### Script

```html
<canvas id="space-travel"></canvas>
<script type="module">
  import SpaceTravel from "https://unpkg.com/space-travel?module";
  new SpaceTravel({ canvas: document.getElementById("space-travel") }).start();
</script>
```

### Module

```console
$ npm install space-travel
```

From your application js file :

```js
import SpaceTravel from "space-travel";
new SpaceTravel({ canvas: document.getElementById("space-travel") }).start();
```

### Interactions

You can bind DOM events to interact with instance state (`throttle`, `opacity`) or call methods (`pause()`, `resume()`, `resize()`).
See [src/main.ts](https://github.com/frequin/space-travel/blob/master/src/main.ts) as an example.

## Documentation

### `class SpaceTravel`

#### constructor

```js
const scene = new SpaceTravel(parameters);
```

#### `parameters`

| name                            | value                            | description                                                                                        |
| ------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `parameters.canvas`             | **required**                     | HTML canvas to be rendered                                                                         |
| `parameters.throttle`           | _optionnal_ default : `0`        | Number between `0` and `1`. Initial speed with relative increasing intensity.                      |
| `parameters.throttleLerpFactor` | _optionnal_ default : `0.035`    | Number defining an acceleration factor to reach a new throttle value                               |
| `parameters.opacity`            | _optionnal_ default : `1`        | Number between `0` and `1`. Initial global opacity.                                                |
| `parameters.opacityLerpFactor`  | _optionnal_ default : `0.016`    | Number between `0` and `1`. Number defining an acceleration factor to reach a new opacity value.   |
| `parameters.startOpacity`       | _optionnal_ default : `0`        | Number between `0` and `1`. Global opacity on scene creation before reaching `parameters.opacity`. |
| `parameters.backgroundColor`    | _optionnal_ default : `0x08000f` | Color (hex number or css string value) filling the canvas background                               |
| `parameters.starfield`          | _optionnal_                      | starfield parameters (see below)                                                                   |
| `parameters.nebulae`            | _optionnal_                      | nebulae parameters (see below)                                                                     |

#### `starfield` parameters

| name                            | value                                                                               | description                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `starfield.count`               | _optionnal_ default : `1500`                                                        | Number of stars in the scene                                                            |
| `starfield.container`           | _optionnal_ default : `{ length: 40, depth: 40 }`                                   | Object defining length and depth of the box containing the stars                        |
| `starfield.colorRange`          | _optionnal_ default : `{ min: 0x3068ff, max: 0xf34f94 }`                            | Object defining minimum and maximum star random colors (hex number or css string value) |
| `starfield.thicknessRange`      | _optionnal_ default : `{ min: 0.035, max: 0.06 }`                                   | Object defining minimum and maximum star thickness related to `throttle` value          |
| `starfield.rayLengthRange`      | _optionnal_ default : `{ min: 0.1, max: 2.5 }`                                      | Object defining minimum and maximum star ray length related to `throttle` value         |
| `starfield.stretchFactorRange`  | _optionnal_ default : `{ min: 0, max: 1.5 }`                                        | Object defining minimum and maximum star stretch factor related to `throttle` value     |
| `starfield.shakeSpeedFactor`    | _optionnal_ default : `0.001`                                                       | Number defining the camera random offset related to `throttle` value                    |
| `starfield.shakeStrengthFactor` | _optionnal_ default : `0.0035`                                                      | Number defining the intensity of the shaking                                            |
| `starfield.speedRange`          | _optionnal_ default : `{ min: 0.5, max: 60 }`                                       | Object defining minimum and maximum speed of the stars related to `throttle` value      |
| `starfield.particleTextureUrl`  | _optionnal_ default : `"https://webgl-space-travel.requin.pro/particle-sprite.png"` | Url of the particle texture image                                                       |
| `starfield.noiseTextureUrl`     | _optionnal_ default : `"https://webgl-space-travel.requin.pro/noise.jpg"`           | Url of the noise image used to generate the shaking effect                              |

#### `nebulae` parameters

Array of `nebula` parameters (see below)

Default value :

```js
[
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
```

#### `nebula` parameters

| name                        | value                                                                    | description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `nebula.coneModelUrl`       | _optionnal_ default : `"https://webgl-space-travel.requin.pro/cone.glb"` | Url of the object that defines the shape of the nebula                                            |
| `nebula.textureUrl`         | _optionnal_ default : `null`                                             | Texture image url                                                                                 |
| `nebula.colorRange`         | _optionnal_ default : `{ min: 0xff0000, max: 0x0000ff }`                 | Object defining minimum and maximum nebula color related to `throttle` value                      |
| `nebula.opacityRange`       | _optionnal_ default : `{ min: 0.5, max: 1 }`                             | Object defining minimum and maximum nebula opacity related to `throttle` value                    |
| `nebula.repeatOffsetRange`  | _optionnal_ default : `{ min: [1, 1], max: [0.15, 1] }`                  | Object defining minimum and maximum texture offset related to `throttle` value                    |
| `nebula.fallOffDistance`    | _optionnal_ default : `-8`                                               | Number defining a maximum visibility depth distance for the texture                               |
| `nebula.speedRange`         | _optionnal_ default : `{ min: 0.0025, max: 0.525 }`                      | Object defining minimum and maximum texture speed depth scrolling related to `throttle` value     |
| `nebula.rotationSpeedRange` | _optionnal_ default : `{ min: 1, max: 45 }`                              | Object defining minimum and maximum texture rotation speed (in deg/s) related to `throttle` value |

#### properties

- `throttle`

Get or set a new `throttle` target value.

```js
scene.throttle = Math.min(1, scene.throttle + 0.1);
```

- `opacity`

Get or set a new `opacity` target value.

```js
scene.opacity = 0.5;
```

#### methods

- `start()`

Puts the scene into action.

```js
scene.start();
```

- `resume()`

Alias of `start()` method.

```js
scene.resume();
```

- `pause()`

Freeze the scene.

```js
scene.pause();
```

- `resize()`

Automatically resize the scene to fit the canvas current size.

```js
scene.resize();
```
