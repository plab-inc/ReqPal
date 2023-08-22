import { defineStore } from 'pinia';

export const useBoxStore = defineStore('boxStore', {
    state: () => ({
        boxes: {} as {
            [key: string]: {
                top: number;
                left: number;
                title: string;
                containerId: string;
            };
        },
    }),
    actions: {
        moveBox(id: string, left: number, top: number, containerId: string) {
            Object.assign(this.boxes[id], { left, top, containerId });
        },
        getAllBoxesWithContainerIds() {
            return Object.entries(this.boxes)
                .map(
                    ([key, box]) => `Box Key: ${key}, Title: ${box.title}, Container ID: ${box.containerId || 'None'}`
                )
                .join('\n');
        },
        addBox(id: string, boxData: { top: number; left: number; title: string; containerId: string }) {
            this.boxes[id] = boxData;
        }
    },
});
