import { routes } from "@/shared/routes";
import {
  CompareIcon,
  DashboardIcon,
  FeedIcon,
  KeywordsIcon,
  SearchIcon,
  StatsIcon,
  TgLogo,
  VkLogo,
  WebIcon,
  YouTubeIcon,
} from "@/shared/ui/Icons";

export const navItems = [
  {
    sectionTitle: "Мониторинг",
    items: [
      {
        path: routes.home,
        title: "Дашборд",
        icon: <DashboardIcon width={12} height={12} />,
      },
      {
        path: "",
        title: "Лента публикаций",
        icon: <FeedIcon width={12} height={12} />,
      },
      { path: "", title: "Поиск", icon: <SearchIcon width={12} height={12} /> },
    ],
  },
  {
    sectionTitle: "Источники",
    items: [
      {
        path: routes.vk,
        title: "ВКонтакте",
        icon: <VkLogo width={12} height={12} />,
      },
      {
        path: routes.tg,
        title: "Telegram",
        icon: <TgLogo width={12} height={12} />,
      },
      {
        path: routes.yt,
        title: "YouTube",
        icon: <YouTubeIcon width={12} height={12} />,
      },
      {
        path: "",
        title: "Веб-источники",
        icon: <WebIcon width={12} height={12} />,
      },
    ],
  },
  {
    sectionTitle: "Аналитика",
    items: [
      {
        path: "",
        title: "Статистика",
        icon: <StatsIcon width={12} height={12} />,
      },
      {
        path: "",
        title: "Ключевые слова",
        icon: <KeywordsIcon width={12} height={12} />,
      },
      {
        path: "",
        title: "Сравнение",
        icon: <CompareIcon width={12} height={12} />,
      },
    ],
  },
];
