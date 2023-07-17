/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
// Defaults
import { defaults } from "@/utils/defaults";
//Themes
import { light, dark, LIGHT_THEME, DARK_THEME } from "@/utils/themes";
//Blueprints
import { md1, md2, md3 } from "vuetify/blueprints";

export default createVuetify({
  defaults: defaults,
  blueprint: md3,
  theme: {
    defaultTheme: DARK_THEME,
    themes: {
      light,
      dark,
    },
  },
});
