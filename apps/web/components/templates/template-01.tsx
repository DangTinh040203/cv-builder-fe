"use client";

import { Page, Text, View } from "@rawwee/react-pdf-html";
import { Font } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";

import HtmlToPdf from "@/components/templates/html-to-pdf";
import { type TemplateProp } from "@/components/templates/template-wrapper";
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
    certifications,
    languages,
  } = resume;

  const { styles } = useTemplateStyle(templateFormat);

  // Helper function to format dates consistently using config
  const formatDate = useCallback(
    (date: Date | string | null | undefined) => {
      if (!date) return "Present";
      return dayjs(date).format(templateFormat.dateFormat);
    },
    [templateFormat.dateFormat],
  );

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
        <View style={styles.sectionContent}>
          <HtmlToPdf style={styles.text} content={overview} />
        </View>
      </View>

      {/* SKILLS */}
      {skills && skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.separator} />
          <View style={{ ...styles.sectionContent, gap: 2 }}>
            {skills.map((skill) => (
              <View key={uuid()} style={styles.row}>
                <Text>{skill.label}</Text>
                <Text>{skill.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* EDUCATION */}
      {educations && educations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {educations.map((edu) => (
              <View key={uuid()} style={{ ...styles.row, marginBottom: 4 }}>
                <View style={{ minWidth: 120 }}>
                  <Text>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text>
                    {edu.major} - {edu.degree}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CERTIFICATIONS */}
      {certifications && certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.separator} />
          <View style={{ ...styles.sectionContent, gap: 2 }}>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>{cert.name}</Text>
                <Text>
                  {cert.issuer} - {formatDate(cert.date)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* LANGUAGES */}
      {languages && languages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.separator} />
          <View style={{ ...styles.sectionContent, gap: 2 }}>
            {languages.map((lang) => (
              <View key={lang.id} style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>{lang.name}</Text>
                <Text>{lang.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* EXPERIENCE */}
      {workExperiences && workExperiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.separator} />
          <View style={styles.sectionContent}>
            {workExperiences.map((exp) => (
              <View key={exp.id} style={styles.col} wrap={false}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignContent: "center",
                  }}
                >
                  <Text style={styles.itemTitle}>{exp.company}</Text>
                  <Text style={{ ...styles.textSm, fontWeight: "semibold" }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={{ opacity: 0.8, fontStyle: "italic" }}>
                  {exp.position}
                </Text>
                <View>
                  <HtmlToPdf style={styles.text} content={exp.description} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.separator} />
          <View style={{ ...styles.sectionContent, gap: 25 }}>
            {projects.map((project) => (
              <View key={uuid()} style={styles.col}>
                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text style={{ opacity: 0.8, fontStyle: "italic" }}>
                    {project.subTitle}
                  </Text>
                </View>

                <View
                  style={{
                    border: "0.5px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  {/* Row */}
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View
                      style={{
                        borderRight: "0.5px solid #ccc",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                        width: 120,
                      }}
                    >
                      <Text>Descriptions</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                      }}
                    >
                      <HtmlToPdf
                        style={styles.text}
                        content={project.details}
                      />
                    </View>
                  </View>

                  {/* Row */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      borderTop: "0.5px solid #ccc",
                    }}
                  >
                    <View
                      style={{
                        borderRight: "0.5px solid #ccc",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                        width: 120,
                      }}
                    >
                      <Text>Responsibilities</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                      }}
                    >
                      <HtmlToPdf
                        style={styles.text}
                        content={project.details}
                      />
                    </View>
                  </View>

                  {/* Row */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      borderTop: "0.5px solid #ccc",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <View
                      style={{
                        borderRight: "0.5px solid #ccc",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                        width: 120,
                      }}
                    >
                      <Text>Technologies</Text>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                      }}
                    >
                      <Text>{project.technologies}</Text>
                    </View>
                  </View>

                  {/* Row */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      borderTop: "0.5px solid #ccc",
                    }}
                  >
                    <View
                      style={{
                        borderRight: "0.5px solid #ccc",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                        width: 120,
                      }}
                    >
                      <Text>Position</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                      }}
                    >
                      <Text>{project.position}</Text>
                    </View>
                  </View>

                  {/* Row */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      borderTop: "0.5px solid #ccc",
                    }}
                  >
                    <View
                      style={{
                        borderRight: "0.5px solid #ccc",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,

                        width: 120,
                      }}
                    >
                      <Text>Domain</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        margin: 0,
                      }}
                    >
                      <Text>{project.domain}</Text>
                    </View>
                  </View>

                  {/* Row */}
                  {project.demo && (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        borderTop: "0.5px solid #ccc",
                      }}
                    >
                      <View
                        style={{
                          borderRight: "0.5px solid #ccc",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          margin: 0,
                          width: 120,
                        }}
                      >
                        <Text
                          style={{
                            lineHeight: 1,
                            margin: 0,
                          }}
                        >
                          Demo
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          margin: 0,
                        }}
                      >
                        <Text
                          style={{
                            lineHeight: 1,
                            margin: 0,
                          }}
                        >
                          {project.demo}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};

export default Template01;
