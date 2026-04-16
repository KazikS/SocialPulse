import { createHashRouter, RouterProvider } from "react-router-dom";

import { MainPage } from "@/pages/MainPage";
import { TelegramPage } from "@/pages/Telegram";
import { VkPage } from "@/pages/Vk";
import { YouTubePage } from "@/pages/YouTube";
import { routes } from "@/shared/routes";
import { Layout } from "@/shared/ui/Layout";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: routes.home,
        element: <MainPage />,
        handle: { title: "Дашборд" },
      },
      {
        path: routes.telegram,
        element: <TelegramPage />,
        handle: { title: "Телеграм" },
      },
      { path: routes.vk, element: <VkPage />, handle: { title: "ВК" } },
      {
        path: routes.youtube,
        element: <YouTubePage />,
        handle: { title: "YouTube" },
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
