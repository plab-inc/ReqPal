<script setup lang="ts">
import { XYCoord, useDragLayer } from 'vue3-dnd'
import { ItemTypes } from '@/types/dragAndDrop.types'
import BoxDragPreview from "@/components/DragAndDrop/BoxDragPreview.component.vue";
import { toRefs } from '@vueuse/core'

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {

    if (!initialOffset || !currentOffset) {
      return {
        display: 'none',
      }
    }

    let { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`

    return {
      transform
    }

}

const collect = useDragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))

const { itemType, isDragging, item, initialOffset, currentOffset } =
    toRefs(collect)
</script>

<template>
  <div class="layer">
    <div :style="getItemStyles(initialOffset, currentOffset)">
      <BoxDragPreview v-if="itemType === ItemTypes.BOX" :title="item.title" />
    </div>
  </div>
</template>

<style scoped>
.layer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>