<script lang="ts" setup>
import {useDrag} from 'vue3-dnd'
import {DragItem} from '@/types/dragItem.ts'
import {toRefs} from '@vueuse/core'
import {getEmptyImage} from "react-dnd-html5-backend";
import Box from "@/components/drafts/lesson/dragAndDrop/Box.vue";
import { onMounted } from "vue";

const props = defineProps<{
  id: string;
  left: number;
  top: number;
  title: string;
  containerId: string;
}>();

const [collect, drag, preview] = useDrag(() => ({
  type: DragItem.BOX,
  item: props,
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
}))

onMounted(() => {
  preview(getEmptyImage(), {captureDraggingState: true})
})

const {isDragging} = toRefs(collect)

</script>

<template>
  <div :ref="drag"
       :style="{
        left: `${props.left}px`,
        top: `${props.top}px`,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        }"
       class="box"
       role="DraggableBox"
  >
    <Box :title="props.title"/>
  </div>
</template>

<style scoped>
.box {
  position: absolute;
  cursor: move;
}
</style>