export type ApiResponse<T> = {
  meta: {
    status: boolean;
    code: number;
    message: string;
  };
  data: T | null;
};

export type PlatformSlug = "vk" | "tg" | "yt" | "max";

export interface Platform {
  id: number;
  name: string;
  slug: PlatformSlug;
}
export type PlatformOverview = Platform & {
  sourcesCount: number;
  postsCount: number;
};

export interface Source {
  id: number;
  platform_id: number;
  external_id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface Post {
  id: number;
  source_id: number;
  external_id: string;
  text: string;
  published_at: string;
  created_at: string;
}

export type PostByPlatform = {
  slug: PlatformSlug;
} & Post;

export interface PostMedia {
  id: number;
  post_id: number;
  type: string;
  url: string;
}

export interface PostStats {
  id: number;
  post_id: number;
  views: number;
  likes: number;
  reposts: number;
  collected_at: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  author: string;
  author_link: string;
  text: string;
  published_at: string;
}

export interface FullPost extends Post {
  media: PostMedia[];
  stats: PostStats[];
  comments: PostComment[];
}

export interface SourceStats {
  id: number;
  source_id: number;
  subscribers: number;
  posts_count: number;
  collected_at: string;
}
