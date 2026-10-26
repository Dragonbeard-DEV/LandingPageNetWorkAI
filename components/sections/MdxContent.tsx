import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

type Props = {
  source: string;
  className?: string;
};

/** Renders an MDX body from /content. Content is trusted (repo-controlled), so no extra sanitizing. */
export function MdxContent({ source, className }: Props) {
  return (
    <div className={cn("prose-body max-w-3xl", className)}>
      <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </div>
  );
}
