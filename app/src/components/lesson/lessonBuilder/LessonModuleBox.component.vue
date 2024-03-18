<script lang="ts" setup>

import {useDrag} from 'vue3-dnd'
import {DragItemTypes} from '@/types/dragItem.types.ts'
import {toRefs} from '@vueuse/core'
import {vElementHover} from "@vueuse/components";

const props = defineProps<{
  title: string,
  showToolTip: boolean
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
        v-element-hover="onHover"
        :variant="isHovered ? 'outlined' : 'elevated'"
        border
        ripple
        density="compact"
        :title="translatedTitle"
    >
      <v-tooltip v-if="showToolTip" location="bottom" activator="parent">
        {{ translatedTooltip }}
      </v-tooltip>
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