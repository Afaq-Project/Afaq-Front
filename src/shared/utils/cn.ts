type ClassValue = string | number | null | undefined | false;

/**
 * Tiny classnames combinator so we don't need to pull in a dependency
 * just to join conditional Tailwind classes.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
