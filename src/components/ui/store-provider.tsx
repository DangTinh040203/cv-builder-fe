"use client";
import { useMemo } from "react";
import { Provider } from "react-redux";

import { type AppStore, makeStore } from "@/stores/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo<AppStore>(() => makeStore(), []);
  return <Provider store={store}>{children}</Provider>;
}
