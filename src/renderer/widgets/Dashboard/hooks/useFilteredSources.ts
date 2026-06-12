import { Post, Source } from "@shared/types/entites";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { api } from "@/shared/api";

export const useFilteredSources = () => {
  const [sources, setSources] = useState<Source[] | null>();
  const [posts, setPosts] = useState<Post[] | null>();
  const dateSince = dayjs().subtract(6, "month").startOf("month").toISOString();
  useEffect(() => {
    const fetchData = async () => {
      const sourcesList = await api.sources.getAll();
      const postsByDate = await api.posts.getAllByDate(dateSince);
      setSources(sourcesList);
      setPosts(postsByDate);
    };

    fetchData();
  }, [dateSince]);

  const sortedSources = sources
    ?.map((source) => ({
      source,
      postsCount:
        posts?.filter((post) => post.source_id === source.id).length ?? 0,
    }))
    .sort((a, b) => b.postsCount - a.postsCount);
  return sortedSources;
};
