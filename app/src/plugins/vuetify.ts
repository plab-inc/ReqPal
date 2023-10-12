/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import '@/styles/main.scss'

import { createVuetify } from "vuetify";
//Defaults
import { defaults } from "@/utils/defaults";
//Themes
import { light, dark, LIGHT_THEME, DARK_THEME } from "@/utils/themes";
//Blueprints
import { md1, md2, md3 } from "vuetify/blueprints";
import { mdi } from 'vuetify/iconsets/mdi'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

export default createVuetify({
  defaults: defaults,
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: DARK_THEME,
    themes: {
      light,
      dark,
    },
  },
  components: {
    VSkeletonLoader,
  },
  display: {
    thresholds:{
      xs: 0,
      sm: 600,
      md: Infinity,
      lg: Infinity,
      xl: Infinity,
    }
  }
});
