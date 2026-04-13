import { Platform } from "@shared/types/entites";
import { BaseRepository } from "./base.repo";

export class PlatformsRepository extends BaseRepository<Platform> {
  constructor() {
    super("platforms");
  }
}
