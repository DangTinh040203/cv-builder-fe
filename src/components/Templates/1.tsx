"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "red",
  },
  section: {
    width: "100%",
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const Template1 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>

      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  );
};

export default Template1;
