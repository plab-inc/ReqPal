import {defineStore} from 'pinia';
import {DragAndDropItem} from "@/types/drag.ts";

export const useContainerStore = defineStore('containerStore', {
    state: () => ({
        boxCounter: 0,
        containers: new Map<string, DragAndDropItem[]>()
    }),
    actions: {
        createContainer(id: string) {
            this.containers.set(id, []);
        },
        addBox(containerId: string, top: number, left: number, title: string) {

            if(!this.containers.get(containerId)) return;
            const id = `box_${this.boxCounter++}`;

            this.containers.get(containerId)?.push({ id, top, left, title: title, containerId } as DragAndDropItem);

        },
        moveBox(oldContainerId: string, newContainerId: string, id: string, left: number, top: number) {
            const oldContainerBoxes = this.containers.get(oldContainerId) || [];
            const newContainerBoxes = this.containers.get(newContainerId) || [];

            const box = oldContainerBoxes.find(box => box.id === id);

            if (!box) return;

            box.left = left;
            box.top = top;

            if (oldContainerId === newContainerId) {
                this.containers.set(oldContainerId, oldContainerBoxes);
                return;
            }

            box.containerId = newContainerId;
            this.containers.set(oldContainerId, oldContainerBoxes.filter(box => box.id !== id));
            this.containers.set(newContainerId, [...newContainerBoxes, box]);
        },
        getBoxesFromContainer(containerId: string) {
            return this.containers.get(containerId) || [];
        },
        getAnswersInContainer(containerId: string) {
            return this.containers.get(containerId)?.map(box => box.title) || [];
        },
        getAnswersInContainers() {
            const result = new Map();

            this.containers.forEach((boxes, containerId) => {
                result.set(containerId, boxes.map(box => box.title));
            });

            return result;
        },
    },
});
