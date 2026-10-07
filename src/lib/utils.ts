export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .join(" ");
}