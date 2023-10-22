<script lang="ts" setup>

import {useDrag} from 'vue3-dnd'
import {DragItemTypes} from '@/types/dragItem.types.ts'
import {toRefs} from '@vueuse/core'
import {vElementHover} from "@vueuse/components";

const props = defineProps<{
  title: string
}>();

const [collect, drag] = useDrag(() => ({
  type: DragItemTypes.COMPONENT,
  item: () => ({
    name: props.title,
  }),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
}))

const { isDragging } = toRefs(collect);
const isHovered = ref(false);

function onHover(state: boolean) {
  isHovered.value = state;
}

</script>

<template>
  <div
      class="box"
      :ref="drag"
      :style="{ opacity: isDragging ? 0.3 : 1 }"
  >
        <v-card
            v-element-hover="onHover"
            :variant="isHovered ? 'outlined' : 'elevated'"
            border
            v-bind="props"
            ripple
            density="compact"
        >
        </v-card>
  </div>
</template>

<style scoped>
.box {
  cursor: move;
  user-select: none;
  text-align: center;
  height: auto;
}
</style>