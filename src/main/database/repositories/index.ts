import { PlatformsRepository } from "./platform.repo";
import { PostRepository } from "./post.repo";
import { SourcesRepository } from "./sources.repo";

export const platformRepo = new PlatformsRepository();
export const postRepo = new PostRepository();
export const sourceRepo = new SourcesRepository();
export * from "./base.repo";
