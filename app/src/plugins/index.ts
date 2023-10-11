/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "./pinia";
import router from "../router";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();

  app.use(vuetify).use(router).use(pinia);
  app.component('EasyDataTable', Vue3EasyDataTable);
}
