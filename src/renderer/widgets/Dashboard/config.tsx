import { PlatformSlug } from "@shared/types/entites";
import { ReactNode } from "react";

import { TgLogo, VkLogo, YouTubeIcon } from "@/shared/ui/Icons";
import { MaxIcon } from "@/shared/ui/Icons/MaxIcon";

import { PlatformStatus } from "./ui/PlatformsCards/PlatformCard";

export type PlatformPresentation = {
  icon: ReactNode;
  status: PlatformStatus;
};

export const platformPresentation: Record<PlatformSlug, PlatformPresentation> =
  {
    vk: { icon: <VkLogo width={40} height={40} />, status: "active" },
    tg: { icon: <TgLogo width={40} height={40} />, status: "active" },
    yt: { icon: <YouTubeIcon width={40} height={40} />, status: "active" },
    max: { icon: <MaxIcon width={40} height={40} />, status: "soon" },
  };

export const platformColorsBySlug = {
  vk: "#0077FF",
  tg: "#26a5e4",
  yt: "#FF0000",
  max: "#9933DD",
};
