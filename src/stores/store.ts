"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { persistReducer } from "redux-persist";

import { StorageSliceName } from "@/constants/slice.constant";
import { resumeReducer } from "@/stores/features/resume.slice";
import { templateReducer } from "@/stores/features/template.slice";
import { userReducer } from "@/stores/features/user.slice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined" ? AsyncStorage : createNoopStorage();

const rootReducer = combineReducers({
  [StorageSliceName.User]: userReducer,
  [StorageSliceName.Template]: templateReducer,
  [StorageSliceName.Resume]: resumeReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  {
    key: "root",
    storage,
    whitelist: [StorageSliceName.Template],
    transforms: [],
  },
  rootReducer,
);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
