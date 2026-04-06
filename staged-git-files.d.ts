declare module 'staged-git-files' {
  type StagedFile = {
    filename: string;
    status: string;
  };

  export default function sgf(): Promise<StagedFile[]>;
}
