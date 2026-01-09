import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/shared/tailwind.config";

export default {
  ...sharedConfig,
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"]
} satisfies Config;
