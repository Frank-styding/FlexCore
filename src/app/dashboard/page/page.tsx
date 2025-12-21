"use client";

import { useRouterSync } from "@/hooks/useRouterSync";

export default function Page() {
  const { data } = useRouterSync();

  return <div>{data.pageId}</div>;
}
