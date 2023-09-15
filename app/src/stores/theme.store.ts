import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { Ref } from "vue";

interface ThemeState {
    browserTheme: Ref<string>;
    userTheme: Ref<string>;
}

export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        browserTheme: useLocalStorage('browserTheme', 'browser'),
        userTheme: useLocalStorage('userTheme', 'init'),
    }),
    getters: {
        currentTheme(): string {
            return this.userTheme === 'init' ? this.browserTheme : this.userTheme;
        },
        hasStoredUserTheme(): boolean {
            return this.userTheme !== 'init';
        },
        getStoredUserTheme(): string {
            return this.userTheme;
        },
    },
    actions: {
        syncWithBrowserSettings(): void {
            this.browserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        },
        setUserTheme(theme: string): void {
            this.userTheme = theme;
        },
    },
});