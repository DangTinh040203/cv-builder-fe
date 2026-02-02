import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { StorageSliceName } from "@/constants";
import { type RootState } from "@/stores/store";

export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type ColumnLayout = "single" | "double";
export type HeaderStyle = "left" | "center";
export type Theme = "light" | "dark" | "auto";
export type BorderStyle = "none" | "simple" | "double" | "accent";
export type SectionType =
  | "personal"
  | "summary"
  | "skills"
  | "education"
  | "experience"
  | "projects";

export interface Format {
  // Typography
  fontSize: number;
  titleSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  letterSpacing: number;

  // Layout
  sectionSpacing: number;
  margin: number;
  pageFormat: "A4";
  columnLayout: ColumnLayout;
  sectionOrder: SectionType[];
  headerStyle: HeaderStyle;

  // Appearance
  color: string;
  theme: Theme;
  borderStyle: BorderStyle;
  showIcons: boolean;
  dateFormat: string;

  // Content visibility
  hiddenSections: SectionType[];
}

export interface TemplateConfig {
  format: Format;
  previewMode: boolean;
}

export interface TemplateState {
  templateConfig: TemplateConfig;
  templateSelected: string | null;
}

export const defaultSectionOrder: SectionType[] = [
  "personal",
  "summary",
  "skills",
  "education",
  "experience",
  "projects",
];

export const defaultFormat: Format = {
  // Typography
  fontSize: 12,
  titleSize: 35,
  lineHeight: 1.5,
  fontWeight: "normal",
  letterSpacing: 0,

  // Layout
  sectionSpacing: 10,
  margin: 20,
  pageFormat: "A4",
  columnLayout: "single",
  sectionOrder: defaultSectionOrder,
  headerStyle: "left",

  // Appearance
  color: "blue",
  theme: "light",
  borderStyle: "none",
  showIcons: true,
  dateFormat: "MM/YYYY",

  // Content visibility
  hiddenSections: [],
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
