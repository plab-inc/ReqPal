import { ThemeDefinition } from "vuetify";
export const LIGHT_THEME = "light";
export const light: ThemeDefinition = {
  colors: {
    surface: '#FFFFFF',
    background: '#FFFFFF',
    primary: '#6e4aff',
    secondary: '#00d2fc',
    error: '#DC3251',
    info: '#239ECE',
    success: '#1EA885',
    warning: '#FF9900',
    textColor: '#363636',
    highlightColor: '#edd9ff'
  },
};

export const DARK_THEME = "dark";
export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1A1523',
    surface: '#2C2541',
    primary: '#6e4aff',
    secondary: '#120034',
    error: '#FF6D0A',
    info: '#4497E2',
    success: '#3ED6C3',
    warning: '#FFC93C',
    textColor: '#e8e8e8',
    highlightColor: '#edd9ff',
    bronzeColor: '#cd7f32',
    silverColor: '#c0c0c0',
    goldColor: '#ffd700'
  },
};