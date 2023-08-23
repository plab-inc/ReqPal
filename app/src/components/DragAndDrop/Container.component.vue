<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd';
import { ItemTypes } from '@/types/dragAndDrop.types';
import Box from './Box.component.vue';
import type { DragItem } from '@/interfaces/DragAndDrop.interfaces';
import { useContainerStore } from '@/stores/DragAndDrop/container.store';

const props = defineProps({
  boxTitles: Array as () => string[],
  containerId: {
    type: String,
    required: true
  },
});

const containerStore = useContainerStore();
containerStore.createContainer(props.containerId);

props.boxTitles?.forEach((title, index) => {
  containerStore.addBox(props.containerId,50 + index * 100, 80, title);
});

const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: DragItem, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
    const newLeft = Math.round(item.left + delta.x)
    const newTop = Math.round(item.top + delta.y)

    containerStore.moveBox(item.containerId, props.containerId, item.id, newLeft, newTop);
  },
}));

</script>

<template>
  <div :ref="drop" class="container">
    <Box
        v-for="(box) in containerStore.getBoxesFromContainer(props.containerId)"
        :id="box.id"
        :left="box.left"
        :top="box.top"
        :container-id="props.containerId"
    >
      {{ box.title }}
    </Box>
  </div>
</template>