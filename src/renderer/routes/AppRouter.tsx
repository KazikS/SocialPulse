import { createHashRouter, RouterProvider } from "react-router-dom";

import { DashboardPage } from "@/pages/Dashboard";
import { TelegramPage } from "@/pages/Telegram";
import { VkPage } from "@/pages/Vk";
import { YouTubePage } from "@/pages/YouTube";
import { routes } from "@/shared/routes";
import { Layout } from "@/shared/ui/Layout";
import { AddSourceButton } from "@/widgets/Dashboard/ui/AddSourceForm";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: routes.home,
        element: <DashboardPage />,
        handle: {
          title: "Дашборд",
          controls: <AddSourceButton />,
        },
      },
      {
        path: routes.tg,
        element: <TelegramPage />,
        handle: { title: "Телеграм" },
      },
      { path: routes.vk, element: <VkPage />, handle: { title: "ВК" } },
      {
        path: routes.yt,
        element: <YouTubePage />,
        handle: { title: "YouTube" },
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
