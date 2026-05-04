"use client";

import { useEffect, useState } from "react";
import About from "@/components/About";
import CoreStrengths from "@/components/CoreStrengths";
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

    if (requestIdle) {
      const id = requestIdle(load, { timeout: 700 });
      return () => window.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(load, 250);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <>
      <About data={data.about} />
      <CoreStrengths />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Blog data={data.blog || []} />
      <Contact data={data.contact} />
    </>
  );
}
