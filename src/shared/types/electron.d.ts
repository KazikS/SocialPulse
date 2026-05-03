import {
  Platform,
  Post,
  PostByPlatform,
  PostComment,
  PostMedia,
  PostStats,
  Source,
  SourceStats,
} from "@shared/types/entites";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  interface ElectronAPI {
    platforms: {
      getAll: () => Promise<Platform[]>;
      create: (data: Omit<Platform, "id">) => Promise<unknown>;
      getById: (id: number) => Promise<Platform | undefined>;
      deleteById: (id: number) => Promise<unknown>;
      getOverview: () => Promise<PlatformOverview[]>;
    };
    posts: {
      getAll: () => Promise<Post[]>;
      create: (data: Record<string, unknown>) => Promise<unknown>;
      getById: (id: number) => Promise<Post | undefined>;
      deleteById: (id: number) => Promise<unknown>;
      addMedia: (data: Record<string, unknown>) => Promise<unknown>;
      getMedia: (postId: number) => Promise<PostMedia[]>;
      addComment: (data: Record<string, unknown>) => Promise<unknown>;
      getComments: (postId: number) => Promise<PostComment[]>;
      getStats: (postId: number) => Promise<PostStats[]>;
      addStats: (data: Record<string, unknown>) => Promise<unknown>;
      getAllByDate: (date: string) => Promise<PostByPlatform[]>;
    };
    sources: {
      getAll: () => Promise<Source[]>;
      create: (data: Record<string, unknown>) => Promise<unknown>;
      getById: (id: number) => Promise<Source | undefined>;
      deleteById: (id: number) => Promise<unknown>;
      getStats: (sourceId: number) => Promise<SourceStats[]>;
      addStats: (data: Record<string, unknown>) => Promise<unknown>;
    };
    db: {
      test: () => Promise<{ name: string }[]>;
    };
  }
}
