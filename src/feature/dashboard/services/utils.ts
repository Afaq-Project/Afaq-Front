import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The type scale in globals.css adds text-* sizes tailwind-merge doesn't know; without this it
// reads them as colors and drops them when merged with a text color (e.g. "text-small text-neutral-600").
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "display", "h1", "h2", "h3", "body", "small", "caption"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
