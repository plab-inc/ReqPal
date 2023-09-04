import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { Ref } from "vue";

interface ThemeState {
    browserTheme: Ref;
    userTheme: Ref;
}

export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        browserTheme: useLocalStorage('browserTheme', 'browser'),
        userTheme: useLocalStorage('userTheme', 'init'),
    }),
    getters: {
        currentTheme: (state): Ref<string> => (state.userTheme === 'init' ? state.browserTheme : state.userTheme),
        hasStoredUserTheme: (state): boolean => state.userTheme !== 'init',
        getStoredUserTheme: (state): string => state.userTheme.value,
    },
    actions: {
        syncWithBrowserSettings() {
            this.browserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        },
        setUserTheme(theme: string) {
            this.userTheme = theme;
        },
    },
});