import path from "path";
import fs from "node:fs/promises";

export type CodeTab = {
  key: string;
  title: string;
  code: string;
};

export type CodeCollection = {
  key: string;
  title: string;
  tabs: CodeTab[];
  sandbox: SandboxInfo | null;
};

export type SandboxInfo = { name: string; url: string };

export type SupportedTypes = keyof typeof supported;

export const fetchCodeCollections = async (
  dirname: string,
  sandboxes: { [K in SupportedTypes]?: SandboxInfo } = {},
) => {
  const collections: CodeCollection[] = [];
  const cached = new Map<string, string>();

  let key: SupportedTypes;
  for (key in supported) {
    const { title, tabs } = supported[key];
    const codeTabs: CodeTab[] = [];

    for (const tab of tabs) {
      const filename = path.resolve(dirname, tab.file);
      let code = cached.get(filename) || (await readCode(filename));
      cached.set(filename, code);

      if (tab.matcher) {
        code = getCodeExcerpt(code, tab.matcher);
      }

      if (code) {
        codeTabs.push({
          key: tab.title,
          title: tab.title,
          code,
        });
      }
    }

    const sandbox = sandboxes[key] ?? null;
    collections.push({
      key,
      title,
      tabs: codeTabs,
      sandbox,
    });
  }

  return collections;
};

const matchers = {
  html: /<(body|main) [^>]*id="main-html"[^>]*>/,
  css: /<(style) [^>]*id="main-css"[^>]*>/,
  js: /<(script) [^>]*id="main-js"[^>]*>/,
} as const;

const supported = {
  react: {
    title: "React",
    tabs: [
      { title: "TSX", file: "demo.tsx", matcher: null },
      { title: "CSS", file: "demo.module.css", matcher: null },
    ],
  },
  jsApi: {
    title: "JavaScript API",
    tabs: [
      { title: "JavaScript", file: "demo-js-api.html", matcher: matchers.js },
      { title: "HTML", file: "demo-js-api.html", matcher: matchers.html },
      { title: "CSS", file: "demo-js-api.html", matcher: matchers.css },
    ],
  },
  htmlApi: {
    title: "HTML API",
    tabs: [
      { title: "HTML", file: "demo-html-api.html", matcher: matchers.html },
      { title: "CSS", file: "demo-html-api.html", matcher: matchers.css },
    ],
  },
} as const;

const readCode = async (filename: string) => {
  let code = "";
  try {
    code = await fs.readFile(filename, { encoding: "utf8" });
  } catch (error) {
    console.error("Error reading file:", error);
    code = "";
  }
  return code;
};

const getCodeExcerpt = (code: string, matcher: RegExp) => {
  let excerpt = code;
  const matchStart = matcher.exec(excerpt);
  if (!matchStart) {
    console.error(`Contents of file did not match regex for ${matcher}`);
    return "";
  }

  const tag = matchStart[1];
  if (!tag) {
    console.error(`Regex for ${matcher} has no captured group!`);
    return "";
  }

  excerpt = excerpt.slice(matchStart.index + matchStart[0].length);
  const matchEnd = new RegExp(`</ *${tag}>`).exec(excerpt);
  if (!matchEnd) {
    console.error(`Contents of file did not match regex for ${matcher}`);
    return "";
  }

  excerpt = excerpt.slice(0, matchEnd.index);
  return trimLines(excerpt);
};

const trimLines = (s: string) => {
  s = s.replace(/^\s*\r?\n/, "");
  const m = s.match(/^\s+/);
  return m ? s.trim().replaceAll("\n" + m[0], "\n") : s;
};
