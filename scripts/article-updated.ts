import sgf from "staged-git-files";
import matter from 'gray-matter'
import fs from 'fs'

declare function sgf(): Promise<{ filename: string; status: "Modified" }[]>;

const parse = (filepath: string) => {
  const data = matter.read(filepath);
  const frontmatter = data.data;
  frontmatter.updated = new Date()
  const modified = data.stringify("")
  console.log("🚀 ~ file: update-article-date.ts ~ line 16 ~ parse ~ modified", modified)
  fs.writeFileSync(filepath, modified)
}

async function main() {
  const stagedFiles = await sgf();
  console.log(
    `🚀 ~ file: pre-commit.ts ~ line 5 ~ main ~ stagedFiles`,
    stagedFiles
  );
  for (const file of stagedFiles) {
    const { filename, status } = file;
    if (!filename.endsWith(".md")) {
      continue;
    }
    if (!filename.startsWith("source/")) {
      continue;
    }
    console.log(`${filename} ${status}, try modify it's updated time`);
    parse(filename)
  }
}

main();
