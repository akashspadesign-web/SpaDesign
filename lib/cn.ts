type ClassValue = string | number | null | false | undefined;

/** Minimal className joiner — no external deps. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
