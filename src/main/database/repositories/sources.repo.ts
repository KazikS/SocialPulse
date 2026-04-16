import { Source, SourceStats } from "@shared/types/entites";

import { BaseRepository } from "./base.repo";

export class SourcesRepository extends BaseRepository<Source> {
  constructor() {
    super("sources");
  }

  addStats(data: Omit<SourceStats, "id">) {
    return this.insertTo("source_stats", data as Record<string, unknown>);
  }

  getStats(sourceId: number) {
    return this.getFrom("source_stats", "source_id", sourceId);
  }
}
