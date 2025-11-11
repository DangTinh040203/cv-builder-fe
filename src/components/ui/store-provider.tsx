"use client";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { makeStore } from "@/stores/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => makeStore(), []);
  const persistor = useMemo(() => persistStore(store), [store]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
