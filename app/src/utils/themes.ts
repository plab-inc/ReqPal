import { ThemeDefinition } from "vuetify";
export const LIGHT_THEME = "light";
export const light: ThemeDefinition = {
  colors: {
    surface: '#575757',
    primary: '#E53265',
    secondary: '#D1CFCD',
    error: '#DC3251',
    info: '#239ECE',
    success: '#1EA885',
    warning: '#FF9900',
  },
};

export const DARK_THEME = "dark";
export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#16141C',
    surface: '#25283A',
    primary: '#E53265',
    secondary: '#34384E',
    error: '#F5680A',
    info: '#28ACF6',
    success: '#2FD6B5',
    warning: '#F5D922',
  },
};