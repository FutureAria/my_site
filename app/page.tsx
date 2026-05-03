import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CoreStrengths from "@/components/CoreStrengths";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

async function getPortfolioData() {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main>
        <Hero data={data.hero} />
        <About data={data.about} />
        <CoreStrengths />
        <Projects data={data.projects} />
        <Skills data={data.skills} />
        <Blog data={data.blog || []} />
        <Contact data={data.contact} />
      </main>
      <Footer />
    </>
  );
}
