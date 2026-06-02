import type { Route } from "./+types/home";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import homeContent from "~/content/home.md?raw";
import { ShimmeringText } from "~/components/ui/shimmering-text";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marco Moscatelli" },
    { name: "description", content: "Personal portfolio homepage." },
  ];
}

export default function Home() {
  const paragraphs = parseMarkdownParagraphs(homeContent);
  const [readyToAnimate, setReadyToAnimate] = useState(false);

  useEffect(() => {
    setReadyToAnimate(true);
  }, []);

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#0a0a0a] px-6 py-16 font-sans text-[#a1a1a1] sm:px-10 md:px-16 lg:px-20">
      <section className="flex max-w-lg flex-col gap-2">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={paragraph.key}
            className="text-[0.95rem] leading-[1.75]"
            initial={{ opacity: 0, filter: "blur(12px)", y: 18 }}
            animate={
              readyToAnimate
                ? { opacity: 1, filter: "blur(0px)", y: 0 }
                : undefined
            }
            transition={{
              duration: 0.65,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {paragraph.children}
          </motion.p>
        ))}
      </section>
    </main>
  );
}

type ParsedParagraph = {
  key: string;
  children: ReactNode[];
};

type InlineNode =
  | { type: "text"; value: string }
  | {
      type: "tag";
      name: SupportedTag;
      attrs: Record<string, string>;
      children: InlineNode[];
    };

type SupportedTag =
  | "accent"
  | "age"
  | "handwritten"
  | "icon"
  | "link"
  | "shimmering"
  | "underline";

const supportedTags = new Set<SupportedTag>([
  "accent",
  "age",
  "handwritten",
  "icon",
  "link",
  "shimmering",
  "underline",
]);

const tagPattern =
  /<\/?(accent|age|handwritten|icon|link|shimmering|underline)\b[^>]*>/g;

function parseMarkdownParagraphs(markdown: string): ParsedParagraph[] {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      key: `${index}-${paragraph.slice(0, 24)}`,
      children: renderInlineNodes(parseInlineNodes(paragraph), `${index}`),
    }));
}

function parseInlineNodes(text: string): InlineNode[] {
  return parseNodesUntil(text, { cursor: 0 }).nodes;
}

function parseNodesUntil(
  text: string,
  state: { cursor: number },
  closingTag?: SupportedTag
): { nodes: InlineNode[]; closed: boolean } {
  const nodes: InlineNode[] = [];

  while (state.cursor < text.length) {
    tagPattern.lastIndex = state.cursor;
    const match = tagPattern.exec(text);

    if (!match) {
      nodes.push({ type: "text", value: text.slice(state.cursor) });
      state.cursor = text.length;
      break;
    }

    if (match.index > state.cursor) {
      nodes.push({ type: "text", value: text.slice(state.cursor, match.index) });
    }

    const rawTag = match[0];
    const tagName = match[1] as SupportedTag;
    const isClosingTag = rawTag.startsWith("</");
    const isSelfClosing =
      rawTag.endsWith("/>") ||
      tagName === "age" ||
      tagName === "icon";
    state.cursor = match.index + rawTag.length;

    if (isClosingTag) {
      if (closingTag === tagName) {
        return { nodes, closed: true };
      }

      nodes.push({ type: "text", value: rawTag });
      continue;
    }

    if (!supportedTags.has(tagName)) {
      nodes.push({ type: "text", value: rawTag });
      continue;
    }

    const attrs = parseAttributes(rawTag);

    if (isSelfClosing) {
      nodes.push({ type: "tag", name: tagName, attrs, children: [] });
      continue;
    }

    const childResult = parseNodesUntil(text, state, tagName);

    if (!childResult.closed) {
      nodes.push({ type: "text", value: rawTag });
      nodes.push(...childResult.nodes);
      continue;
    }

    nodes.push({
      type: "tag",
      name: tagName,
      attrs,
      children: childResult.nodes,
    });
  }

  return { nodes, closed: false };
}

function parseAttributes(rawTag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /([a-zA-Z][\w-]*)="([^"]*)"/g;

  for (const match of rawTag.matchAll(attrPattern)) {
    attrs[match[1]] = match[2];
  }

  return attrs;
}

function renderInlineNodes(nodes: InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => renderInlineNode(node, `${keyPrefix}-${index}`));
}

function renderInlineNode(node: InlineNode, key: string): ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  const children = renderInlineNodes(node.children, key);

  switch (node.name) {
    case "accent":
      return (
        <span key={key} className="font-medium text-[#fafafa]">
          {children}
        </span>
      );

    case "age":
      return <span key={key}>{calculateAge()}</span>;

    case "handwritten":
      return (
        <span
          key={key}
          className="inline-block pr-1 font-caveat text-xl leading-0 font-bold whitespace-nowrap text-sky-400"
        >
          {children}
        </span>
      );

    case "icon":
      return <InlineIcon key={key} name={node.attrs.name} />;

    case "shimmering":
      return (
        <ShimmeringText
          key={key}
          text={nodesToText(node.children)}
          className="align-baseline font-medium"
          repeatDelay={0.8}
          spread={1.7}
        />
      );

    case "link":
      return (
        <a
          key={key}
          href={node.attrs.href}
          className="inline cursor-pointer font-medium whitespace-nowrap text-[#fafafa] transition-colors hover:text-white"
          target={node.attrs.href?.startsWith("http") ? "_blank" : undefined}
          rel={node.attrs.href?.startsWith("http") ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );

    case "underline":
      return (
        <span key={key} className="animated-underline-link inline">
          {children}
        </span>
      );
  }
}

function nodesToText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.value;
      }

      return nodesToText(node.children);
    })
    .join("");
}

function calculateAge(): string {
  const birthdate =
    import.meta.env.VITE_BIRTHDATE ?? import.meta.env.BIRTHDATE ?? "";
  const parsedBirthdate = new Date(`${birthdate}T00:00:00`);

  if (!birthdate || Number.isNaN(parsedBirthdate.getTime())) {
    return "19";
  }

  const today = new Date();
  let age = today.getFullYear() - parsedBirthdate.getFullYear();
  const birthdayThisYear = new Date(
    today.getFullYear(),
    parsedBirthdate.getMonth(),
    parsedBirthdate.getDate()
  );

  if (today < birthdayThisYear) {
    age -= 1;
  }

  return String(age);
}

function InlineIcon({ name }: { name?: string }) {
  const normalizedName = name?.toLowerCase();
  const iconClassName = "mr-1 mb-0.5 inline size-[1em] align-middle text-[#fafafa]";

  if (normalizedName === "github") {
    return <FaGithub aria-hidden="true" className={iconClassName} />;
  }

  if (normalizedName === "linkedin") {
    return <FaLinkedin aria-hidden="true" className={iconClassName} />;
  }

  if (normalizedName === "mail") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  return null;
}
