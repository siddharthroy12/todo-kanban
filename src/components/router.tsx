import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Tasks } from "@/pages/tasks";
import { Layout } from "@/components/layout";
import { Settings } from "@/pages/settings/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Tasks />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <></>,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
