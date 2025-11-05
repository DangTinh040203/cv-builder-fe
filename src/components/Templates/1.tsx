"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { Font, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useMemo } from "react";

import HtmlToPdf from "@/components/Templates/HtmlToPdf";
import { templateGlobalStyles } from "@/configs/template.config";
import { type Format } from "@/stores/features/template.slice";
import { type Template } from "@/types/template.type";

Font.registerHyphenationCallback((word) => [word]);

interface Template1Props {
  templateFormat: Format;
  data: Template;
}

const Template1: React.FC<Template1Props> = ({ templateFormat, data }) => {
  const {
    title,
    subTitle,
    overview,
    information,
    skills,
    educations,
    projects,
    experiences,
  } = data;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        page: {
          ...templateGlobalStyles.page,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          rowGap: templateFormat.sectionSpacing,
          lineHeight: templateFormat.lineHeight,
          fontSize: templateFormat.fontSize,
        },

        section: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 4,
        },

        sectionContent: {
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: 6,
        },

        title: {
          ...templateGlobalStyles.heading1,
          ...templateGlobalStyles.fontWeight600,
          color: templateFormat.color,
          lineHeight: 1.1,
        },

        subTitle: {
          ...templateGlobalStyles.heading2,
          ...templateGlobalStyles.fontWeight600,
          lineHeight: 1.2,
        },

        informationGroup: {
          ...templateGlobalStyles.gapXl,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
        },

        informationItem: {
          ...templateGlobalStyles.flexRow,
          fontStyle: "normal",
        },

        informationLabel: {
          ...templateGlobalStyles.fontWeight600,
          minWidth: 70,
          display: "flex",
        },

        overview: {
          lineHeight: templateFormat.lineHeight,
          fontSize: templateFormat.fontSize,
        },

        sectionTitle: {
          ...templateGlobalStyles.heading3,
          ...templateGlobalStyles.fontWeight600,
          color: templateFormat.color,
        },

        separator: {
          height: 1,
          width: "100%",
          backgroundColor: "gray",
        },
      }),
    [templateFormat],
  );

  const informationGroup = useMemo(() => {
    const sorted = information.sort((a, b) => a.order - b.order);

    return {
      infoLeftColumn: sorted.filter((_, index) => index % 2 === 0),
      infoRightColumn: sorted.filter((_, index) => index % 2 === 1),
    };
  }, [information]);

  return (
    <Page size="A4" style={styles.page}>
      {/* RESUME TITLE */}
      <View style={{ flexDirection: "column", gap: 2 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>

      {/* RESUME INFO GROUP */}
      <View style={styles.section}>
        <View style={styles.informationGroup}>
          {/* Left */}
          <View>
            <View style={{ flexDirection: "column", gap: 4 }}>
              {informationGroup.infoLeftColumn.map((info) => (
                <View key={info._id} style={styles.informationItem}>
                  <Text style={styles.informationLabel}>{info.label}:</Text>
                  <Text style={{ textOverflow: "ellipsis" }}>{info.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right */}
          <View>
            <View style={{ flexDirection: "column", gap: 4 }}>
              {informationGroup.infoRightColumn.map((info) => (
                <View key={info._id} style={styles.informationItem}>
                  <Text style={styles.informationLabel}>{info.label}:</Text>
                  <Text>{info.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.separator} />
        <HtmlToPdf style={styles.overview} content={overview} />
      </View>

      {/* Skill */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.separator} />
        <View style={styles.sectionContent}>
          {skills.map((skill) => (
            <View
              key={skill._id}
              style={{ gap: 10, display: "flex", flexDirection: "row" }}
            >
              <Text style={{ minWidth: 80, fontWeight: 600 }}>
                {skill.label}
              </Text>
              <Text>{skill.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.separator} />
        <View style={styles.sectionContent}>
          {educations.map((education) => (
            <View
              key={education._id}
              style={{ gap: 10, display: "flex", flexDirection: "row" }}
            >
              <View style={{ minWidth: 120, fontWeight: 600 }}>
                <Text>
                  {dayjs(education.startDate).format("MM/YYYY")} -{" "}
                  {education.endDate
                    ? dayjs(education.endDate).format("MM/YYYY")
                    : "Present"}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontWeight: 600 }}>{education.schoolName}</Text>
                <Text>
                  {education.major} - {education.degree}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.separator} />
        <View style={styles.sectionContent}>
          {experiences.map((experience) => (
            <View
              key={experience._id}
              style={{
                gap: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
              wrap={false}
            >
              <View style={{ minWidth: 120, fontWeight: 600 }}>
                <Text>
                  {dayjs(experience.startDate).format("MM/YYYY")} -{" "}
                  {experience.endDate
                    ? dayjs(experience.endDate).format("MM/YYYY")
                    : "Present"}
                </Text>
              </View>

              <View
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <Text style={{ fontWeight: 600 }}>{experience.company}</Text>
                <Text>{experience.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <View style={styles.separator} />
        <View style={styles.sectionContent}>
          {projects.map((project) => (
            <View
              wrap={false}
              key={project._id}
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: 10,
              }}
            >
              {/* Project Header */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ fontWeight: 600 }}>{project.name}</Text>
                <Text style={{ fontWeight: 600 }}>
                  {dayjs(project.startDate).format("MM/YYYY")} -{" "}
                  {project.endDate
                    ? dayjs(project.endDate).format("MM/YYYY")
                    : "Present"}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {project.information.map((info, index) => (
                  <View
                    key={info._id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 10,
                      borderBottom: "1px solid #ccc",
                      ...(index === 0 ? { borderTop: "1px solid #ccc" } : {}),
                    }}
                  >
                    <Text
                      style={{
                        minWidth: 120,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                    >
                      {info.label}
                    </Text>
                    <Text style={{ flex: 1, paddingTop: 4, paddingBottom: 4 }}>
                      {info.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

export default Template1;
