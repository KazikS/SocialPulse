import { Post, Source } from "@shared/types/entites";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/shared/api";
import { getPreviousPeriodRange } from "@/shared/lib/periods";
import { useDashboardFilters } from "@/shared/store/store";

export const useFilteredSources = () => {
  const [sources, setSources] = useState<Source[] | null>();
  const [posts, setPosts] = useState<Post[] | null>();
  const { period } = useDashboardFilters();
  const { start, end } = getPreviousPeriodRange(period);
  useEffect(() => {
    const fetchData = async () => {
      const sourcesList = await api.sources.getAll();
      const postsByDate = await api.posts.getInRange(start, end);
      setSources(sourcesList);
      setPosts(postsByDate);
    };

    fetchData();
  }, [start, end]);

  const sortedSources = useMemo(
    () =>
      sources
        ?.map((source) => ({
          source,
          postsCount:
            posts?.filter((post) => post.source_id === source.id).length ?? 0,
        }))
        .sort((a, b) => b.postsCount - a.postsCount),
    [posts, sources],
  );
  return sortedSources;
};
