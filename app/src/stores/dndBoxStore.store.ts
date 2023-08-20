import { defineStore } from 'pinia';
import { Box } from '@/interfaces/DragAndDrop.interfaces';

type BoxState = {
    boxes: Record<string, Box>;
}

export const useBoxStore = defineStore({id: 'boxStore',
    state: (): BoxState => ({
        boxes: {}
    }),
    actions: {
        addBox(id: string, title: string, left: number, top: number) {
            this.boxes[id] = { title, left, top };
        },
        moveBox(id: string, left: number, top: number) {
            if (this.boxes[id]) {
                this.boxes[id].left = left;
                this.boxes[id].top = top;
            }
        },
        removeBox(id: string) {
            delete this.boxes[id];
        }
    }
});
