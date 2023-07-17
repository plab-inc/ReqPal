import { ThemeDefinition } from "vuetify";
import { colors } from "./colors";

// String that represents the name of the theme I am using
export const LIGHT_THEME = "light";
// Light mode theme
export const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: colors.indigo[600],
    secondary: colors.purple[600],
    error: colors.red[500],
    info: colors.blue[500],
    success: colors.emerald[500],
    warning: colors.amber[500],
  },
};

// String that represents the name of the dark theme I am using
export const DARK_THEME = "dark";
// Dark mode theme
export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: colors.slate[950],
    surface: colors.slate[900],
    primary: colors.indigo[500],
    secondary: colors.purple[500],
    error: colors.red[500],
    info: colors.blue[500],
    success: colors.emerald[500],
    warning: colors.amber[500],
  },
};
