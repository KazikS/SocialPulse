import { MainPage } from "@/pages/MainPage";
import { TelegramPage } from "@/pages/Telegram";
import { VkPage } from "@/pages/Vk";
import { YouTubePage } from "@/pages/YouTube";
import { routes } from "@/shared/routes";
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: routes.home,
    element: <MainPage />,
  },
  {
    path: routes.youtube,
    element: <YouTubePage />,
  },
  {
    path: routes.vk,
    element: <VkPage />,
  },
  {
    path: routes.telegram,
    element: <TelegramPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
