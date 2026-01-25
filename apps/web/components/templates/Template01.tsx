"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { Font } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

import HtmlToPdf from "@/components/templates/html-to-pdf";
import { type TemplateProp } from "@/components/templates/template-wrapper";
import { templateGlobalStyles } from "@/configs/template.config";
import { useTemplateStyle } from "@/hooks/use-template-style";

Font.registerHyphenationCallback((word) => [word]);

const Template01: React.FC<TemplateProp> = ({ templateFormat, resume }) => {
  const {
    title,
    subTitle,
    overview,
    information,
    skills,
    projects,
    workExperiences,
    educations,
  } = resume;

  const { styles } = useTemplateStyle(templateFormat);

  const informationGroup = useMemo(() => {
    return {
      left: information.filter((_, i) => i % 2 === 0),
      right: information.filter((_, i) => i % 2 === 1),
    };
  }, [information]);

  return (
    <Page size={"A4"} style={styles.page}>
      {/* HEADER */}
      <View style={styles.col}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>

      {/* INFO */}
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
          <View style={{ ...styles.sectionContent, gap: 2 }}>
            {skills.map((skill) => (
              <View key={uuid()} style={styles.row}>
                <Text style={styles.label}>{skill.label}</Text>
                <Text style={styles.text}>{skill.value}</Text>
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
            {educations.map((edu) => (
              <View key={uuid()} style={{ ...styles.row, marginBottom: 4 }}>
                <View style={{ minWidth: 120 }}>
                  <Text>
                    {dayjs(edu.startDate).format("MM/YYYY")} -{" "}
                    {edu.endDate
                      ? dayjs(edu.endDate).format("MM/YYYY")
                      : "Present"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={{ fontWeight: 700 }}>{edu.school}</Text>
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
            {workExperiences.map((exp) => (
              <View
                key={uuid()}
                style={[
                  styles.row,
                  { alignItems: "flex-start", marginBottom: 4 },
                ]}
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
                  <Text style={{ fontWeight: 700 }}>{exp.company}</Text>
                  <HtmlToPdf
                    style={{ ...styles.text, margin: 0 }}
                    content={exp.description}
                  />
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
            {projects.map((project) => (
              <View key={uuid()} style={styles.projectContainer} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={{ fontWeight: 600 }}>{project.title}</Text>
                </View>

                <HtmlToPdf style={styles.text} content={project.details} />
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};

export default Template01;
