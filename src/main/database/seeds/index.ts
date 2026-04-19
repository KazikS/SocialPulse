import { createPlatformSeed } from "./001-platform";
import { createMockSourcesSeed } from "./002-mock-sources";
import { createMockPostsSeed } from "./003-mock-posts";

export const createSeeds = () => {
  createPlatformSeed();
  createMockSourcesSeed();
  createMockPostsSeed();
};
