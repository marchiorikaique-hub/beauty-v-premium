/** Prefix public assets when deployed under the GitHub Pages repository path. */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
