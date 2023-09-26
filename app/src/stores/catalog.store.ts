import { defineStore } from 'pinia';

export const useCatalogStore = defineStore('catalog', {
    state: () => ({
        currentCatalog: null
    }),

    getters: {
        getCurrentCatalog(): any{
            return this.currentCatalog;
        }
    },

    actions: {

    }
});