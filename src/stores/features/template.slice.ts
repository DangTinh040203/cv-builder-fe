import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { StorageSliceName } from "@/constants/slice.constant";
import { type RootState } from "@/stores/store";

export interface Format {
  fontSize: number;
  titleSize: number;
  sectionSpacing: number;
  lineHeight: number;
  paragraphIndent: number;
  color: string;
}

export interface TemplateConfig {
  format: Format;
}

interface TemplateState {
  templateConfig: TemplateConfig;
}

export const defaultFormat: Format = {
  fontSize: 12,
  titleSize: 35,
  sectionSpacing: 14,
  paragraphIndent: 0,
  lineHeight: 1.5,
  color: "blue",
};

const initialState: TemplateState = {
  templateConfig: {
    format: defaultFormat,
  },
};

const templateSlice = createSlice({
  name: StorageSliceName.Template,
  initialState,
  reducers: {
    updateTemplateConfigFormat: (
      state,
      action: PayloadAction<Partial<Format>>,
    ) => {
      state.templateConfig.format = {
        ...state.templateConfig.format,
        ...action.payload,
      };
    },
  },
});

export const templateFormatSelector = (state: RootState) =>
  state.template.templateConfig.format;
export const templateReducer = templateSlice.reducer;
