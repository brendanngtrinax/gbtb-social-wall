import type { ShortCardType, LongCardType } from "$lib/types";

export const avatarImgPaths = [
  "/avatars/otter.png",
  "/avatars/dragonfly.png",
  "/avatars/supertree.png",
  "/avatars/tree.png",
  "/avatars/fruit.png",
  "/avatars/flower.png",
];
export const backgroundImgPaths = [
  "/backgrounds/blue.png",
  "/backgrounds/lightblue.png",
  "/backgrounds/blue.png",
  "/backgrounds/lightblue.png",
  "/backgrounds/blue.png",
  "/backgrounds/lightblue.png",
];

export const sampleShortCards: ShortCardType[] = [
  {
    type: "short",
    status: "hidden",
    name: "John Doe",
    pledge: "I pledge to save the environment.",
    avatarIndex: 0,
    backgroundIndex: 0,
  },
  {
    type: "short",
    status: "hidden",
    name: "Jane Smith",
    pledge: "I pledge to reduce plastic waste.",
    avatarIndex: 1,
    backgroundIndex: 1,
  },
  {
    type: "short",
    status: "hidden",
    name: "Alice Johnson",
    pledge: "I pledge to plant more trees.",
    avatarIndex: 2,
    backgroundIndex: 2,
  },
];
