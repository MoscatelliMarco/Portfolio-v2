import type { Route } from "./+types/education-experience";

import {
  AnimatedBlock,
  ContentPage,
  Paragraph,
  SectionTitle,
} from "~/components/content-page";
import content from "~/content/content.json";
import { renderInlineText } from "~/lib/rich-text";

type TimedEntry = {
  title: string;
  organization: string;
  period: string;
  overview: string;
};

type Certification = {
  title: string;
  link?: string;
  issuer: string;
  issuedAt?: string;
  overview: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Education & Experience | Marco Moscatelli" },
    {
      name: "description",
      content: "Education, experience, and certifications by Marco Moscatelli.",
    },
  ];
}

export default function EducationExperience() {
  const experience = content.experience satisfies TimedEntry[];
  const education = content.education satisfies TimedEntry[];
  const extracurriculars = content.extracurriculars satisfies TimedEntry[];
  const certifications = content.certifications satisfies Certification[];

  return (
    <ContentPage
      title="Education & Experience"
      analyticsSurface="education_experience"
    >
      <div className="flex flex-col gap-9">
        <EntrySection
          title="Experience"
          entries={experience}
          delayOffset={1}
          keyPrefix="experience"
        />
        <EntrySection
          title="Education"
          entries={education}
          delayOffset={experience.length + 2}
          keyPrefix="education"
        />
        <EntrySection
          title="Extracurriculars"
          entries={extracurriculars}
          delayOffset={experience.length + education.length + 3}
          keyPrefix="extracurricular"
        />
        <CertificationSection
          entries={certifications}
          delayOffset={
            experience.length + education.length + extracurriculars.length + 4
          }
        />
      </div>
    </ContentPage>
  );
}

function EntrySection({
  title,
  entries,
  delayOffset,
  keyPrefix,
}: {
  title: string;
  entries: TimedEntry[];
  delayOffset: number;
  keyPrefix: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-7">
        {entries.map((entry, index) => (
          <AnimatedBlock
            key={`${entry.title}-${entry.organization}`}
            delay={(delayOffset + index) * 0.08}
          >
            <Paragraph>
              <span className="font-medium text-[#fafafa]">{entry.title}</span>
              {entry.organization.toLowerCase() === "self-employed" ? (
                <>
                  {" being "}
                  <span className="text-[#fafafa]">{entry.organization}</span>
                </>
              ) : (
                <>
                  {" at "}
                  <span className="text-[#fafafa]">{entry.organization}</span>
                </>
              )}
              {" / "}
              {entry.period}
              {"."}
            </Paragraph>
            <Paragraph>
              {renderInlineText(entry.overview, `${keyPrefix}-${index}`)}
            </Paragraph>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function CertificationSection({
  entries,
  delayOffset,
}: {
  entries: Certification[];
  delayOffset: number;
}) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Certifications</SectionTitle>
      <div className="flex flex-col gap-7">
        {entries.map((entry, index) => (
          <AnimatedBlock
            key={`${entry.title}-${entry.issuer}`}
            delay={(delayOffset + index) * 0.08}
          >
            <Paragraph>
              <CertificationTitle certification={entry} />
              {" by "}
              <span className="text-[#fafafa]">{entry.issuer}</span>
              {entry.issuedAt && ` / ${entry.issuedAt}`}
              {"."}
            </Paragraph>
            <Paragraph>
              {renderInlineText(entry.overview, `certification-${index}`)}
            </Paragraph>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function CertificationTitle({
  certification,
}: {
  certification: Certification;
}) {
  if (!certification.link) {
    return (
      <span className="font-medium text-[#fafafa]">{certification.title}</span>
    );
  }

  return (
    <a
      href={certification.link}
      className="animated-underline-link font-medium text-[#fafafa]"
      target="_blank"
      rel="noreferrer"
      data-ph-capture-attribute-click-name={`certification_${analyticsSlug(certification.title)}_open`}
      data-ph-capture-attribute-surface="education_experience"
      data-ph-capture-attribute-link-kind="external"
    >
      {certification.title}
    </a>
  );
}

function analyticsSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
