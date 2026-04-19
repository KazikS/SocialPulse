import { Platform, PlatformOverview } from "@shared/types/entites";

import { BaseRepository } from "./base.repo";

export class PlatformsRepository extends BaseRepository<Platform> {
  constructor() {
    super("platforms");
  }

  getOverview(): PlatformOverview[] {
    const sql = `SELECT p.*, 
      COUNT(DISTINCT s.id) AS sourcesCount,
      COUNT(DISTINCT po.id) AS postsCount
      FROM platforms p
      LEFT JOIN sources s ON s.platform_id = p.id
      LEFT JOIN posts po ON po.source_id = s.id
      GROUP BY p.id`;
    return this.database.prepare(sql).all() as PlatformOverview[];
  }
}
