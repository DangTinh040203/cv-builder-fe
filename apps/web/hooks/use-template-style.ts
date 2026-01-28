import { StyleSheet } from "@react-pdf/renderer";
import { useMemo } from "react";

import { templateGlobalStyles } from "@/configs/template-style.config";
import { type Format } from "@/stores/features/template.slice";

export const useTemplateStyle = (templateFormat: Format) => {
  const styles = useMemo(() => {
    const theme = {
      color: templateFormat.color,
      fontSize: templateFormat.fontSize,
      titleSize: templateFormat.titleSize,
      lineHeight: templateFormat.lineHeight,
      sectionSpacing: templateFormat.sectionSpacing,
      margin: templateFormat.margin,
      pageFormat: templateFormat.pageFormat,
    };

    return StyleSheet.create({
      page: {
        ...templateGlobalStyles.page,
        padding: theme.margin,
        flexDirection: "column",
        rowGap: theme.sectionSpacing,
        fontSize: theme.fontSize,
        lineHeight: theme.lineHeight,
      },

      section: {
        flexDirection: "column",
        width: "100%",
        gap: 2,
      },

      sectionContent: {
        flexDirection: "column",
        gap: 6,
        marginTop: 6,
      },

      separator: {
        height: 1,
        width: "100%",
        backgroundColor: "gray",
      },

      text: {
        fontSize: theme.fontSize,
        lineHeight: theme.lineHeight,
      },

      title: {
        fontSize: theme.titleSize,
        ...templateGlobalStyles.fontWeight600,
        color: theme.color,
        lineHeight: 1.1,
      },

      subTitle: {
        ...templateGlobalStyles.heading2,
        ...templateGlobalStyles.fontWeight600,
        lineHeight: 1.2,
      },

      sectionTitle: {
        ...templateGlobalStyles.heading3,
        ...templateGlobalStyles.fontWeight600,
        color: theme.color,
      },

      label: {
        ...templateGlobalStyles.fontWeight600,
        minWidth: 70,
      },

      informationGroup: {
        ...templateGlobalStyles.gapXl,
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
      },

      informationItem: {
        flexDirection: "row",
        fontStyle: "normal",
      },

      informationLabel: {
        ...templateGlobalStyles.fontWeight600,
        minWidth: 70,
      },

      row: {
        flexDirection: "row",
        gap: 10,
      },

      rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
      },

      col: {
        flexDirection: "column",
      },

      projectContainer: {
        flexDirection: "column",
        paddingBottom: 10,
      },

      projectHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
      },

      projectInfoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        borderBottom: "1px solid #ccc",
      },

      projectInfoRowFirst: {
        borderTop: "1px solid #ccc",
      },
    });
  }, [templateFormat]);

  return { styles };
};
