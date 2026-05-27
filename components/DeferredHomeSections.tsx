"use client";

import { useEffect, useState } from "react";
import About from "@/components/About";
import CoreStrengths from "@/components/CoreStrengths";
import ProblemSolving from "@/components/ProblemSolving";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

interface DeferredHomeSectionsProps {
  data: {
    about: any;
    projects: any[];
    skills: Record<string, string[]>;
    blog: any[];
    contact: any;
  };
}

export default function DeferredHomeSections({ data }: DeferredHomeSectionsProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const requestIdle =
      typeof window !== "undefined" ? window.requestIdleCallback : undefined;
    const timeoutId = window.setTimeout(load, 900);

    if (requestIdle) {
      const idleId = requestIdle(load, { timeout: 700 });
      return () => {
        window.cancelIdleCallback?.(idleId);
        window.clearTimeout(timeoutId);
      };
    }

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!ready) return null;

  return (
    <>
      <About data={data.about} />
      <CoreStrengths />
      <ProblemSolving />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Blog data={data.blog || []} />
      <Contact data={data.contact} />
    </>
  );
}
