import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

export function ContentPage({
  title,
  children,
  analyticsSurface,
}: {
  title: string;
  children: ReactNode;
  analyticsSurface: "projects" | "publications" | "education_experience";
}) {
  const [readyToAnimate, setReadyToAnimate] = useState(false);

  useEffect(() => {
    setReadyToAnimate(true);
  }, []);

  return (
    <main className="min-h-svh bg-[#0a0a0a] px-6 py-16 font-sans text-[#a1a1a1] sm:px-10 md:px-16 lg:px-20">
      <section className="mx-auto flex max-w-2xl flex-col gap-8">
        <motion.header
          initial={{ opacity: 0, filter: "blur(12px)", y: 18 }}
          animate={
            readyToAnimate
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : undefined
          }
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/"
            className="animated-underline-link mb-6 inline-block text-[0.82rem] font-medium text-neutral-100"
            data-ph-capture-attribute-click-name={`${analyticsSurface}_home`}
            data-ph-capture-attribute-surface={analyticsSurface}
            data-ph-capture-attribute-link-kind="internal"
          >
            Home
          </Link>
          <h1 className="text-xl xl:text-2xl font-medium text-[#fafafa]">{title}</h1>
        </motion.header>
        {children}
      </section>
    </main>
  );
}

export function AnimatedBlock({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [readyToAnimate, setReadyToAnimate] = useState(false);

  useEffect(() => {
    setReadyToAnimate(true);
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, filter: "blur(12px)", y: 18 }}
      animate={
        readyToAnimate ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined
      }
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-[0.95rem] leading-[1.75]">{children}</p>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[0.82rem] font-medium tracking-[0.14em] text-[#fafafa] uppercase">
      {children}
    </h2>
  );
}
