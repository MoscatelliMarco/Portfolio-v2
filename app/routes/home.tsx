import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import homeContent from "~/content/home.md?raw";
import { parseMarkdownParagraphs } from "~/lib/rich-text";

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
      <section className="flex max-w-lg flex-col gap-2 pb-2">
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
