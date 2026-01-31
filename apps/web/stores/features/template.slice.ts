import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { StorageSliceName } from "@/constants";
import { type RootState } from "@/stores/store";

export interface Format {
  fontSize: number;
  titleSize: number;
  sectionSpacing: number;
  lineHeight: number;
  color: string;
  margin: number;
  pageFormat: "A4";
  dateFormat: string;
}

export interface TemplateConfig {
  format: Format;
  previewMode: boolean;
}

export interface TemplateState {
  templateConfig: TemplateConfig;
  templateSelected: string | null;
}

export const defaultFormat: Format = {
  fontSize: 12,
  titleSize: 35,
  sectionSpacing: 10,
  lineHeight: 1.5,
  color: "blue",
  margin: 20,
  pageFormat: "A4",
  dateFormat: "MM/YYYY",
};

const initialState: TemplateState = {
  templateConfig: {
    format: defaultFormat,
    previewMode: false,
  },
  templateSelected: null,
};

const templateSlice = createSlice({
  name: StorageSliceName.Template,
  initialState,
  reducers: {
    updatePreviewMode: (state, action: PayloadAction<boolean>) => {
      state.templateConfig.previewMode = action.payload;
    },
    updateTemplateConfigFormat: (
      state,
      action: PayloadAction<Partial<Format>>,
    ) => {
      state.templateConfig.format = {
        ...state.templateConfig.format,
        ...action.payload,
      };
    },
    setTemplateSelected: (state, action: PayloadAction<string | null>) => {
      state.templateSelected = action.payload;
    },
  },
});

export const templateConfigSelector = (state: RootState) =>
  state.template.templateConfig;
export const templateFormatSelector = (state: RootState) =>
  state.template.templateConfig.format;
export const templateSelectedSelector = (state: RootState) =>
  state.template.templateSelected;

export const {
  updateTemplateConfigFormat,
  setTemplateSelected,
  updatePreviewMode,
} = templateSlice.actions;

export const templateReducer = templateSlice.reducer;
