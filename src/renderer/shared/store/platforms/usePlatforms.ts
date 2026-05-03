import { Platform } from "@shared/types/entites";
import { useEffect, useState } from "react";

import { getPlatforms } from "./platformsStore";

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPlatforms().then((data) => {
      setPlatforms(data);
      setIsLoading(false);
    });
  }, []);

  return { platforms, isLoading };
};
