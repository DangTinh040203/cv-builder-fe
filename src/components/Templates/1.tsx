"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { Font, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

import { type TemplateProp } from "@/components/Templates";
import HtmlToPdf from "@/components/Templates/HtmlToPdf";
import { templateGlobalStyles } from "@/configs/template.config";

Font.registerHyphenationCallback((word) => [word]);

const Template1: React.FC<TemplateProp> = ({ templateFormat, resume }) => {
  const {
    title,
    subTitle,
    overview,
    information,
    section: { educations, projects, skills, workExperiences },
  } = resume;

  const styles = useMemo(() => {
    const theme = {
      color: templateFormat.color,
      fontSize: templateFormat.fontSize,
      lineHeight: templateFormat.lineHeight,
      sectionSpacing: templateFormat.sectionSpacing,
    };

    return StyleSheet.create({
      page: {
        ...templateGlobalStyles.page,
        padding: 20,
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
        gap: 4,
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
        ...templateGlobalStyles.heading1,
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

  const informationGroup = useMemo(() => {
    const sorted = [...information].sort((a, b) => a.order - b.order);
    return {
      left: sorted.filter((_, i) => i % 2 === 0),
      right: sorted.filter((_, i) => i % 2 === 1),
    };
  }, [information]);

  return (
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.col}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>

      {/* INFO */}
      {information.length > 0 && (
        <View style={styles.section}>
          <View style={styles.informationGroup}>
            {[informationGroup.left, informationGroup.right].map((col, i) => (
              <View key={i} style={styles.col} wrap={false}>
                {col.map((info) => (
                  <View key={uuid()} style={styles.informationItem}>
                    <Text style={styles.informationLabel}>{info.label}:</Text>
                    <Text>{info.value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* OVERVIEW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.separator} />
        <HtmlToPdf style={styles.text} content={overview} />
      </View>

      {/* SKILLS */}
      {skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {skills.content.map((skill) => (
              <View key={uuid()} style={styles.row}>
                <Text style={styles.label}>{skill.label}</Text>
                <Text>{skill.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* EDUCATION */}
      {educations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {educations.content.map((edu) => (
              <View key={uuid()} style={styles.row}>
                <View style={{ minWidth: 120 }}>
                  <Text>
                    {dayjs(edu.startDate).format("MM/YYYY")} -{" "}
                    {edu.endDate
                      ? dayjs(edu.endDate).format("MM/YYYY")
                      : "Present"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={{ fontWeight: 600 }}>{edu.school}</Text>
                  <Text>
                    {edu.major} - {edu.degree}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* EXPERIENCE */}
      {workExperiences && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {workExperiences.content.map((exp) => (
              <View
                key={uuid()}
                style={[styles.row, { alignItems: "flex-start" }]}
                wrap={false}
              >
                <View style={{ minWidth: 120 }}>
                  <Text>
                    {dayjs(exp.startDate).format("MM/YYYY")} -{" "}
                    {exp.endDate
                      ? dayjs(exp.endDate).format("MM/YYYY")
                      : "Present"}
                  </Text>
                </View>
                <View style={[styles.col, { flex: 1 }]}>
                  <Text style={{ fontWeight: 600 }}>{exp.company}</Text>
                  <Text>{exp.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* PROJECTS */}
      {projects && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {projects.content.map((project) => (
              <View key={uuid()} style={styles.projectContainer} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={{ fontWeight: 600 }}>{project.title}</Text>
                  {/* <Text style={{ fontWeight: 600 }}>
                    {dayjs(project.).format("MM/YYYY")} -{" "}
                    {project.endDate
                      ? dayjs(project.endDate).format("MM/YYYY")
                      : "Present"}
                  </Text> */}
                </View>

                <View style={styles.col}>
                  {project.information.map((info, index) => (
                    <View
                      key={uuid()}
                      style={[
                        styles.projectInfoRow,
                        ...(index === 0 ? [styles.projectInfoRowFirst] : []),
                      ]}
                    >
                      <Text style={{ minWidth: 120, paddingVertical: 4 }}>
                        {info.label}
                      </Text>
                      <Text style={{ flex: 1, paddingVertical: 4 }}>
                        {info.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};

export default Template1;
