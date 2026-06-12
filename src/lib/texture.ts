import type { Texture } from "ogl";

// Loads an image from a URL and assigns it to an existing OGL texture once
// decoded. crossOrigin is required because the textures are served from a
// different origin and feed into WebGL.
export const loadImageTexture = (texture: Texture, url: string): void => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.addEventListener("load", () => {
    texture.image = image;
  });
  image.src = url;
};
