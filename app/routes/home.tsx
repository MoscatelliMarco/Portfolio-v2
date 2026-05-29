import type { Route } from "./+types/home";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

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

type SupportedTag = "accent" | "handwritten" | "shimmering" | "link" | "image";

const supportedTags = new Set<SupportedTag>([
  "accent",
  "handwritten",
  "shimmering",
  "link",
  "image",
]);

const tagPattern =
  /<\/?(accent|handwritten|shimmering|link|image)\b[^>]*>/g;

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
    const isSelfClosing = rawTag.endsWith("/>") || tagName === "image";
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

      if (tagName === "image" && text.startsWith("</image>", state.cursor)) {
        state.cursor += "</image>".length;
      }

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

    case "handwritten":
      return (
        <span
          key={key}
          className="inline-block pr-1 font-caveat text-xl leading-0 font-bold whitespace-nowrap text-sky-400"
        >
          {children}
        </span>
      );

    case "shimmering":
      return (
        <ShimmeringText
          key={key}
          text={nodesToText(node.children)}
          color="#a1a1a1"
          shimmerColor="#fafafa"
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
          className="animated-underline-link inline cursor-pointer font-medium whitespace-nowrap text-[#fafafa]"
          target={node.attrs.href?.startsWith("http") ? "_blank" : undefined}
          rel={node.attrs.href?.startsWith("http") ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );

    case "image":
      return (
        <img
          key={key}
          alt={node.attrs.alt ?? ""}
          src={node.attrs.src ?? ""}
          className="mr-1 mb-1 inline h-[1em] w-auto align-middle"
          loading="lazy"
        />
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
