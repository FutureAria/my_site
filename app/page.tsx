import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DeferredHomeSections from "@/components/DeferredHomeSections";
import Footer from "@/components/Footer";

async function getPortfolioData() {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  return {
    ...data,
    projects: (data.projects || []).map((project: any) => ({
      title: project.title,
      period: project.period,
      desc: project.desc,
      techs: project.techs || [],
      image: project.image,
      link: project.link,
      github: project.github,
      documents: project.documents || [],
      detail: {
        role: project.detail?.role || "",
      },
    })),
    blog: (data.blog || []).map((post: any) => ({
      title: post.title,
      date: post.date,
      tags: post.tags || [],
      summary: post.summary,
    })),
  };
}

export const revalidate = 60;

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main>
        <Hero data={data.hero} />
        <DeferredHomeSections data={data} />
      </main>
      <Footer />
    </>
  );
}
