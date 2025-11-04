import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

import { StorageSliceName } from "@/constants/slice.constant";
import { templateReducer } from "@/stores/features/template.slice";
import { userReducer } from "@/stores/features/user.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [StorageSliceName.User]: userReducer,
      [StorageSliceName.Template]: templateReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
