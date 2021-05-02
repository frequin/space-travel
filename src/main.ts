import "./style.css";
import SpaceTravel from "./lib/space-travel";

const canvas: HTMLCanvasElement | null = document.querySelector("#space-travel");

if (!canvas) {
  throw new Error("Canvas not found");
}

let paused = false;
let throttle = 0;

const spaceTravel = new SpaceTravel({
  canvas,
  throttle
});

document.addEventListener("visibilitychange", () => {
  if (paused) {
    return;
  }

  if (document.hidden) {
    spaceTravel.pause();
  } else {
    spaceTravel.resume();
  }
});

document.addEventListener("keydown", ({ code }) => {
  if (code === "Space") {
    if (paused) {
      spaceTravel.resume();
    } else {
      spaceTravel.pause();
    }

    paused = !paused;
  }

  if (code === "ArrowDown") {
    throttle = Math.max(0, throttle - 0.2);
    spaceTravel.throttle = throttle;
  }

  if (code === "ArrowUp") {
    throttle = Math.min(1, throttle + 0.2);
    spaceTravel.throttle = throttle;
  }
});

window.addEventListener("resize", () => {
  spaceTravel.resize();
});

spaceTravel.start();
