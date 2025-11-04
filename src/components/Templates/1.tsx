"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { StyleSheet } from "@react-pdf/renderer";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

import { templateGlobalStyles } from "@/configs/template.config";
import { type Information } from "@/types/template.type";

const MOCK_INFORMATION: Array<Information> = [
  {
    _id: uuid(),
    label: "Email",
    value: "your_email@example.com",
    order: 1,
  },
  {
    _id: uuid(),
    label: "Phone",
    value: "+123 456 7890",
    order: 2,
  },
  {
    _id: uuid(),
    label: "Address",
    value: "123 Main St, City, Country",
    order: 3,
  },
  {
    _id: uuid(),
    label: "LinkedIn",
    value: "linkedin.com/in/yourprofile",
    order: 4,
  },
  {
    _id: uuid(),
    label: "Website",
    value: "www.yourwebsite.com",
    order: 5,
  },
  {
    _id: uuid(),
    label: "GitHub",
    value: "github.com/yourusername",
    order: 6,
  },
];

const Template1 = () => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...templateGlobalStyles.heading1,
          ...templateGlobalStyles.fontWeight600,
          color: "blue",
        },

        subTitle: {
          ...templateGlobalStyles.heading3,
          ...templateGlobalStyles.fontWeight600,
        },

        informationGroup: {
          ...templateGlobalStyles.gapXl,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        },

        informationItem: {
          ...templateGlobalStyles.flexRow,
          lineHeight: 1.5,
          fontSize: 10,
          fontStyle: "normal",
        },

        informationLabel: {
          ...templateGlobalStyles.fontWeight600,
          minWidth: 70,
          display: "flex",
        },
      }),
    [],
  );

  const informationGroup = useMemo(() => {
    return {
      infoLeftColumn: MOCK_INFORMATION.filter((_, index) => index % 2 === 0),
      infoRightColumn: MOCK_INFORMATION.filter((_, index) => index % 2 === 1),
    };
  }, []);

  return (
    <Page size="A4" style={templateGlobalStyles.page}>
      {/* RESUME TITLE */}
      <View
        style={{
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Text style={styles.title}>Your Name</Text>
        <Text style={styles.subTitle}>Your profession</Text>
      </View>

      {/* RESUME INFO GROUP */}
      <View style={styles.informationGroup}>
        {/* Left */}
        <View>
          <View style={{ flexDirection: "column" }}>
            {informationGroup.infoLeftColumn.map((info) => (
              <View key={info._id} style={styles.informationItem}>
                <Text style={styles.informationLabel}>{info.label}:</Text>
                <Text>{info.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right */}
        <View>
          <View style={{ flexDirection: "column" }}>
            {informationGroup.infoRightColumn.map((info) => (
              <View key={info._id} style={styles.informationItem}>
                <Text style={styles.informationLabel}>{info.label}:</Text>
                <Text>{info.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Template1;
