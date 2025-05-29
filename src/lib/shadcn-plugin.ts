
import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";

export const shadcnPlugin = plugin(
  ({ addBase }) => {
    addBase({
      ":root": {
        "--background": "44 44% 90%", //eggshell
        "--foreground": "222.2 84% 4.9%", //dark gray
        "--card": "44 44% 90%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "44 44% 90%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "78 27% 30%", //moss
        "--primary-foreground": "44 44% 90%", //eggshell
        "--secondary": "45 100% 68%", //mustard
        "--secondary-foreground": "222.2 47.4% 11.2%",
        "--muted": "44 44% 85%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "45 100% 68%", //mustard
        "--accent-foreground": "44 44% 15%", //dark brown
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "78 27% 70%", //lighter moss
        "--input": "78 27% 70%",
        "--ring": "78 27% 70%", //moss again
        "--radius": "0.5rem",
      },
      ".dark": {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "210 40% 98%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "78 27% 30%",
        "--primary-foreground": "222.2 47.4% 11.2%",
        "--secondary": "217.2 32.6% 17.5%",
        "--secondary-foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "217.2 32.6% 17.5%",
        "--accent-foreground": "210 40% 98%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "224.3 76.3% 48%",
      },
    });

    addBase({
      "*": {
        "@apply border-border": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
        fontFeatureSettings: '"rlig" 1, "calt" 1',
      },
    });
  }
);
