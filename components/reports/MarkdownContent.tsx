"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const proseClasses = [
  "text-zinc-700 dark:text-zinc-300",
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-zinc-900 dark:[&_h1]:text-zinc-100",
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-100",
  "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-zinc-900 dark:[&_h3]:text-zinc-100",
  "[&_p]:my-2 [&_p]:leading-relaxed",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1",
  "[&_li]:my-0.5",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600 dark:[&_blockquote]:text-zinc-400 dark:[&_blockquote]:border-zinc-600",
  "[&_table]:w-full [&_table]:my-4 [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-zinc-300 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-zinc-100 dark:[&_th]:bg-zinc-800 dark:[&_th]:border-zinc-600 [&_th]:text-zinc-900 dark:[&_th]:text-zinc-100",
  "[&_td]:border [&_td]:border-zinc-300 [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-zinc-600",
  "[&_pre]:my-4 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:overflow-x-auto dark:[&_pre]:bg-zinc-800",
  "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:text-sm dark:[&_code]:bg-zinc-800",
  "[&_pre_code]:p-0 [&_pre_code]:bg-transparent",
  "[&_hr]:my-8 [&_hr]:border-zinc-200 dark:[&_hr]:border-zinc-700",
].join(" ");

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className={proseClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
