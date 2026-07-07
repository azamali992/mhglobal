import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the project's custom font-size utilities so tailwind-merge treats
// them as font-sizes rather than text colors. Without this, combining a custom
// size like `text-body` with a colour like `text-white` made tailwind-merge
// think they conflicted and drop one — which silently stripped `text-white`
// from md/lg buttons, rendering their labels crimson-on-crimson (invisible).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "h4", "body-lg", "body", "caption"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
