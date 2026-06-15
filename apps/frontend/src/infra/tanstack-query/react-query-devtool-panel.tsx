"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

export default function ReactQueryDevtoolPanel() {
  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);
  return (
    <div className="hidden md:block">
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <React.Suspense fallback={null}>
        <ReactQueryDevtoolsProduction />
      </React.Suspense>
    </div>
  );
}
