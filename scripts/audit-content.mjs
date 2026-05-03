import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "data", "portfolio.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const issues = [];
const warnings = [];

function requireText(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push(`${label} 값이 비어 있습니다.`);
  }
}

function checkLocalFile(value, label) {
  if (!value || typeof value !== "string") return;
  if (!value.startsWith("/")) return;

  const filePath = path.join(root, "public", value);
  if (!fs.existsSync(filePath)) {
    issues.push(`${label} 파일을 찾을 수 없습니다: ${value}`);
  }
}

function checkUrl(value, label) {
  if (!value || typeof value !== "string") return;
  if (value.startsWith("/") || value.startsWith("mailto:")) return;

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      warnings.push(`${label} URL 프로토콜을 확인하세요: ${value}`);
    }
  } catch {
    issues.push(`${label} URL 형식이 올바르지 않습니다: ${value}`);
  }
}

requireText(data.hero?.name, "hero.name");
requireText(data.hero?.subtitle, "hero.subtitle");
requireText(data.settings?.home?.headline, "settings.home.headline");
requireText(data.contact?.email, "contact.email");
checkLocalFile(data.hero?.resumeFile, "resumeFile");
checkLocalFile(data.hero?.coverLetterFile, "coverLetterFile");
checkUrl(data.contact?.github, "contact.github");
checkUrl(data.contact?.homepage, "contact.homepage");

if (!Array.isArray(data.projects) || data.projects.length === 0) {
  issues.push("projects가 비어 있습니다.");
} else {
  data.projects.forEach((project, index) => {
    const label = `projects[${index + 1}] ${project.title || "제목 없음"}`;
    requireText(project.title, `${label}.title`);
    requireText(project.desc, `${label}.desc`);
    checkLocalFile(project.image, `${label}.image`);
    checkUrl(project.link, `${label}.link`);
    checkUrl(project.github, `${label}.github`);

    if (!project.detail?.role) warnings.push(`${label} 역할 설명이 비어 있습니다.`);
    if (!project.detail?.challenges) warnings.push(`${label} 문제와 해결 설명이 비어 있습니다.`);
    if (!project.detail?.takeaways?.length) warnings.push(`${label} 배운 점이 비어 있습니다.`);
    if (!project.techs?.length) warnings.push(`${label} 기술 스택이 비어 있습니다.`);

    (project.detail?.images || []).forEach((image, imageIndex) => {
      checkLocalFile(image, `${label}.detail.images[${imageIndex + 1}]`);
    });
  });
}

if (!Array.isArray(data.blog) || data.blog.length === 0) {
  warnings.push("Journal 글이 비어 있습니다.");
} else {
  data.blog.forEach((post, index) => {
    const label = `blog[${index + 1}] ${post.title || "제목 없음"}`;
    requireText(post.title, `${label}.title`);
    requireText(post.summary, `${label}.summary`);
    requireText(post.content, `${label}.content`);
  });
}

const featured = data.settings?.featuredProjectIndexes || [];
featured.forEach((index) => {
  if (!Number.isInteger(index) || index < 0 || index >= data.projects.length) {
    issues.push(`대표 프로젝트 index가 잘못되었습니다: ${index}`);
  }
});

if (issues.length) {
  console.error("Content audit failed.");
  issues.forEach((issue) => console.error(`- ${issue}`));
  if (warnings.length) {
    console.error("\nWarnings:");
    warnings.forEach((warning) => console.error(`- ${warning}`));
  }
  process.exit(1);
}

console.log("Content audit passed.");
if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
