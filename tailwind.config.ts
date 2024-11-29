import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flyonui/dist/js/*.js",
  ],

  theme: {
    extend: {},
  },

  plugins: [require("flyonui"), require("flyonui/plugin")],
  flyonui: {
    vendors: true,
    logs: false,
  },
} satisfies Config;
