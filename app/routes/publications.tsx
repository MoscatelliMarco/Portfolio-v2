import type { Route } from "./+types/publications";

import { AnimatedBlock, ContentPage, Paragraph } from "~/components/content-page";
import content from "~/content/content.json";
import { renderInlineText } from "~/lib/rich-text";

type Publication = {
  title: string;
  link?: string;
  publishedAt: string;
  overview: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Publications | Marco Moscatelli" },
    { name: "description", content: "Publications by Marco Moscatelli." },
  ];
}

export default function Publications() {
  const publications = content.publications satisfies Publication[];

  return (
    <ContentPage title="Publications">
      <div className="flex flex-col gap-7">
        {publications.map((publication, index) => (
          <AnimatedBlock key={publication.title} delay={(index + 1) * 0.08}>
            <Paragraph>
              <span className="text-[#fafafa]">{publication.publishedAt}</span>
              {" / "}
              <PublicationTitle publication={publication} />
              {"."}
            </Paragraph>
            <Paragraph>
              {renderInlineText(publication.overview, `publication-${index}`)}
            </Paragraph>
          </AnimatedBlock>
        ))}
      </div>
    </ContentPage>
  );
}

function PublicationTitle({ publication }: { publication: Publication }) {
  if (!publication.link) {
    return (
      <span className="font-medium text-[#fafafa]">{publication.title}</span>
    );
  }

  return (
    <a
      href={publication.link}
      className="animated-underline-link font-medium text-[#fafafa]"
      target={publication.link.startsWith("http") ? "_blank" : undefined}
      rel={publication.link.startsWith("http") ? "noreferrer" : undefined}
    >
      {publication.title}
    </a>
  );
}
