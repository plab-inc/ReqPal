<script lang="ts" setup>

import { useDrag } from "vue3-dnd";
import { DragItem } from "@/types/dragItem.ts";
import { toRefs } from "@vueuse/core";
import { vElementHover } from "@vueuse/components";
import { computed, ref } from "vue";

const props = defineProps<{
  title: string,
}>();

const [collect, drag] = useDrag(() => ({
  type: DragItem.MODULE,
  item: () => ({
    name: props.title,
  }),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
}))

const componentsTranslationMap: Record<string, { title: string, tooltip: string }> = {
  'TrueOrFalse': {title: 'Wahr oder Falsch', tooltip: 'Eine einfache Frage mit zwei Antwortmöglichkeiten'},
  'Requirement': {title: 'Anforderung', tooltip: 'Anzeigen einer Anforderung und nach Bedarf das Abfragen von Qualifikationen zu den Produkten'},
  'MultipleChoice': {title: 'Multiple Choice', tooltip: 'Eine Frage mit mehreren Antwortmöglichkeiten'},
  'Slider': {title: 'Slider', tooltip: 'Eine Frage mit einer Skala als Antwortmöglichkeit'},
  'Textfield': {title: 'Info', tooltip: 'Ein Freitextfeld für zusätzliche Informationen '},
  'Note': {title: 'Notizen', tooltip: 'Ein Freitextfeld für Notizen des Studenten'},
  'Divider': {title: 'Trenner', tooltip: 'Ein optischer Trenner zwischen den Lektionsbausteinen'},
};

const {isDragging} = toRefs(collect);
const isHovered = ref(false);

const translatedTitle = computed(() => {
  return componentsTranslationMap[props.title]?.title || props.title;
});

const translatedTooltip = computed(() => {
  return componentsTranslationMap[props.title]?.tooltip || '';
});

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
      max-height="45"
        v-element-hover="onHover"
        :variant="isHovered ? 'outlined' : 'elevated'"
        border
        ripple
        density="compact"
        :title="translatedTitle"
    />
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