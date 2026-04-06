/// <reference path="../staged-git-files.d.ts" />

import sgf from 'staged-git-files';
import matter from 'gray-matter';
import fs from 'fs';
import dayjs from 'dayjs';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai');

type StagedFile = {
  filename: string;
  status: string;
};

const formatTime = (date: string | number | Date | dayjs.Dayjs) =>
  dayjs(date).format('YYYY-MM-DD HH:mm:ss');

const parse = (filepath: string) => {
  const file = matter.read(filepath);
  const frontmatter = file.data;
  frontmatter.date = formatTime(frontmatter.date ?? new Date());
  frontmatter.updated = formatTime(dayjs());
  const modified = file.stringify('');
  const original = fs.readFileSync(filepath, 'utf8');
  if (original === modified) {
    return false;
  }
  fs.writeFileSync(filepath, modified);
  return true;
};

async function main() {
  const stagedFiles = (await sgf()) as StagedFile[];
  for (const file of stagedFiles) {
    const { filename, status } = file;
    if (!filename.endsWith('.md')) {
      continue;
    }
    if (!filename.startsWith('source/')) {
      continue;
    }
    if (parse(filename)) {
      console.log(`${filename} ${status}, updated frontmatter time`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
