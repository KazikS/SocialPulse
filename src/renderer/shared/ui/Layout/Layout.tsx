import { ReactNode } from "react";
import { Outlet, useMatches } from "react-router-dom";

import styles from "./Layout.module.scss";
import { LayoutHeader } from "./LayoutHeader";
import { LayoutNavBar } from "./LayoutNavBar";

type RouteHandle = {
  title: string;
  subtitle?: ReactNode;
  controls?: ReactNode;
};

export const Layout = () => {
  const matches = useMatches();

  const handle = matches[matches.length - 1].handle as RouteHandle;
  return (
    <div className={styles.wrapper}>
      <LayoutNavBar />
      <main>
        <LayoutHeader
          title={handle.title}
          subtitle={handle.subtitle ?? undefined}
          controls={handle.controls ?? undefined}
        />
        <Outlet />
      </main>
    </div>
  );
};
