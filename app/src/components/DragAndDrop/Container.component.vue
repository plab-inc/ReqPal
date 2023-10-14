<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd';
import { DragItemTypes } from '@/types/dragItem.types.ts';
import type { DragAndDropItem } from '@/interfaces/DragItems.interfaces.ts';
import { useContainerStore } from '@/stores/DragAndDrop/container.store';
import DraggableBox from './DraggableBox.component.vue';
import {toRefs} from "@vueuse/core";

import { useTheme } from "vuetify";
const themeColors = useTheme().current.value.colors;

const props = defineProps({
  boxTitles: Array as () => string[],
  containerId: {
    type: String,
    required: true
  },
  title: String
});

const containerStore = useContainerStore();
containerStore.createContainer(props.containerId);

props.boxTitles?.forEach((title, index) => {
  containerStore.addBox(props.containerId,50 + index * 100, 80, title);
});

const [collect, drop] = useDrop(() => ({
  accept: DragItemTypes.BOX,
  drop(item: DragAndDropItem, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as {
      x: number
      y: number
    }
    const newLeft = Math.round(item.left + delta.x)
    const newTop = Math.round(item.top + delta.y)

    containerStore.moveBox(item.containerId, props.containerId, item.id, newLeft, newTop);
  },
  collect: (monitor: any) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
}));

const {isOver} = toRefs(collect);


</script>

<template>
  <div
      :ref="drop"
      class="container"
      :style="{
        borderColor: isOver ? themeColors.success : themeColors.primary,
        }"
  >
    <div v-if="props.title" class="container-title">{{ props.title }}</div>
    <DraggableBox
        v-for="(box) in containerStore.getBoxesFromContainer(props.containerId)"
        :id="box.id"
        :left="box.left"
        :top="box.top"
        :container-id="props.containerId"
        :title="box.title"
    >
      {{ box.title }}
    </DraggableBox>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  border: 1px solid;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;
}
.container-title {
  font-size: 30px;
}

</style>