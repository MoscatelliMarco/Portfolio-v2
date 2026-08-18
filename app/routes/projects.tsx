import type { Route } from "./+types/projects";

import { AnimatedBlock, ContentPage, Paragraph } from "~/components/content-page";
import { SkillList } from "~/components/skill-list";
import content from "~/content/content.json";
import { renderInlineText } from "~/lib/rich-text";

type Project = {
  name: string;
  link: string;
  sourceCode?: string;
  overview: string;
  skills: string[];
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects | Marco Moscatelli" },
    { name: "description", content: "Selected projects by Marco Moscatelli." },
  ];
}

export default function Projects() {
  const projects = content.projects satisfies Project[];

  return (
    <ContentPage title="Projects" analyticsSurface="projects">
      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <AnimatedBlock key={project.name} delay={(index + 1) * 0.08}>
            <Paragraph>
              <a
                href={project.link}
                className="animated-underline-link font-medium text-[#fafafa]"
                target={project.link.startsWith("http") ? "_blank" : undefined}
                rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                data-ph-capture-attribute-click-name={`project_${analyticsSlug(project.name)}_open`}
                data-ph-capture-attribute-surface="projects"
                data-ph-capture-attribute-link-kind="external"
              >
                {project.name}
              </a>
              {project.sourceCode ? (
                <>
                  {" "}
                  <span aria-hidden="true">/</span>{" "}
                  <a
                    href={project.sourceCode}
                    className="animated-underline-link font-medium text-[#fafafa]"
                    target="_blank"
                    rel="noreferrer"
                    data-ph-capture-attribute-click-name={`project_${analyticsSlug(project.name)}_source`}
                    data-ph-capture-attribute-surface="projects"
                    data-ph-capture-attribute-link-kind="source"
                  >
                    Source code
                  </a>
                </>
              ) : null}
              {"."}
            </Paragraph>
            <Paragraph>{renderInlineText(project.overview, `project-${index}`)}</Paragraph>
            <div className="mt-1">
              <SkillList skills={project.skills} />
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </ContentPage>
  );
}

function analyticsSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
