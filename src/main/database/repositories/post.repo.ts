import {
  FullPost,
  Post,
  PostComment,
  PostMedia,
  PostStats,
} from "@shared/types/entites";

import { BaseRepository } from "./base.repo";

export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super("posts");
  }

  findBySourceId(sourceId: number) {
    const sql = `SELECT * FROM ${this.tableName} WHERE source_id = ?`;
    return this.database.prepare(sql).all(sourceId);
  }

  getFullPost(id: number): FullPost | undefined {
    const post = this.findById(id);
    if (!post) return undefined;

    return {
      ...post,
      media: this.getFrom<PostMedia>("post_media", "post_id", id),
      comments: this.getFrom<PostComment>("post_comments", "post_id", id),
      stats: this.getFrom<PostStats>("post_stats", "post_id", id),
    };
  }

  addMedia(data: Omit<PostMedia, "id">) {
    return this.insertTo("post_media", data as Record<string, unknown>);
  }

  getMedia(postId: number) {
    return this.getFrom("post_media", "post_id", postId);
  }

  addComment(data: Omit<PostComment, "id">) {
    return this.insertTo("post_comments", data as Record<string, unknown>);
  }

  getComment(postId: number) {
    return this.getFrom("post_comments", "post_id", postId);
  }

  addStats(data: Omit<PostStats, "id">) {
    return this.insertTo("post_stats", data as Record<string, unknown>);
  }

  getStats(postId: number) {
    return this.getFrom("post_stats", "post_id", postId);
  }
}
