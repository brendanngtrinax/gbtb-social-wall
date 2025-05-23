import { get } from "svelte/store";
import {
  birdX,
  birdY,
  targetX,
  targetY,
  birdSpeed,
  animationFrameId,
  currentTargetPromiseResolve,
  birdShortCard,
  birdLongCard,
} from "$lib/stores";

function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function updateBirdPosition() {
  const distance = calculateDistance(
    get(birdX),
    get(birdY),
    get(targetX),
    get(targetY),
  );

  if (distance > get(birdSpeed)) {
    // Move towards target
    const dx = get(targetX) - get(birdX);
    const dy = get(targetY) - get(birdY);

    const directionX = dx / distance;
    const directionY = dy / distance;

    birdX.update((x) => x + directionX * get(birdSpeed));
    birdY.update((y) => y + directionY * get(birdSpeed));
  } else {
    // Snap to target if very close to avoid overshooting/oscillation
    birdX.set(get(targetX));
    birdY.set(get(targetY));

    if (get(currentTargetPromiseResolve)) {
      get(currentTargetPromiseResolve)!();
      currentTargetPromiseResolve.set(null); // Clear it
    }
    // Optionally, stop the animation here if the bird should only move once
    // cancelAnimationFrame(animationFrameId);
  }

  // Continue animation loop
  animationFrameId.set(requestAnimationFrame(updateBirdPosition));
}

export async function flyToTarget(
  i: number,
  j: number,
  size: "short" | "long",
): Promise<void> {
  let element;
  if (size === "short") {
    element = document.getElementById(
      `short-card-${i}-${j}`,
    )?.firstElementChild;
  } else {
    element = document.getElementById(`long-card-${i}-${j}`)?.firstElementChild;
  }
  let x = element?.getBoundingClientRect().x!;
  let y = element?.getBoundingClientRect().y!;
  return new Promise((resolve) => {
    // Set the new target
    targetX.set(x);
    targetY.set(y);

    // Store the resolve function of this promise
    currentTargetPromiseResolve.set(resolve);

    // Ensure the animation loop is running
    if (!get(animationFrameId)) {
      animationFrameId.set(requestAnimationFrame(updateBirdPosition));
    }
  });
}
