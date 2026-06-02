import type { IconType } from "react-icons";
import {
  FaAws,
  FaChessKnight,
  FaDocker,
  FaGitAlt,
  FaJava,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import {
  SiCplusplus,
  SiJavascript,
  SiMedusa,
  SiMongodb,
  SiNextdotjs,
  SiNumpy,
  SiOpenai,
  SiPandas,
  SiPostgresql,
  SiPytorch,
  SiReactrouter,
  SiScikitlearn,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVite,
} from "react-icons/si";

const skillIcons: Record<string, IconType> = {
  aws: FaAws,
  "c++": SiCplusplus,
  chess: FaChessKnight,
  docker: FaDocker,
  "game theory": FaChessKnight,
  "game theory algorithms": FaChessKnight,
  git: FaGitAlt,
  java: FaJava,
  javascript: SiJavascript,
  "machine learning": SiScikitlearn,
  medusa: SiMedusa,
  medusajs: SiMedusa,
  mongodb: SiMongodb,
  "next.js": SiNextdotjs,
  node: FaNodeJs,
  "node.js": FaNodeJs,
  numpy: SiNumpy,
  openai: SiOpenai,
  pandas: SiPandas,
  postgresql: SiPostgresql,
  python: FaPython,
  pytorch: SiPytorch,
  react: FaReact,
  "react router": SiReactrouter,
  "scikit-learn": SiScikitlearn,
  "tailwind css": SiTailwindcss,
  tensorflow: SiTensorflow,
  typescript: SiTypescript,
  vite: SiVite,
};

export function SkillList({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[0.82rem] leading-none text-[#fafafa]">
      {skills.map((skill) => {
        const Icon = skillIcons[skill.toLowerCase()];

        return (
          <li key={skill} className="inline-flex items-center gap-1.5">
            {Icon ? <Icon aria-hidden="true" className="size-[1em]" /> : null}
            <span>{skill}</span>
          </li>
        );
      })}
    </ul>
  );
}
