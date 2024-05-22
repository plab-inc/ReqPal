<script setup lang="ts">
import {useDrop} from 'vue3-dnd';
import {DragItem} from '@/types/dragItem.ts';
import {toRefs} from '@vueuse/core';
import {useTheme} from "vuetify";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {useUtilStore} from "@/stores/util.ts";
import {LessonBuilderDragItem} from "@/types/drag.ts";
import { computed, unref } from "vue";

const themeColors = useTheme().current.value.colors;
const lessonFormStore = useLessonFormStore();
const utilStore = useUtilStore();

const MAX_QUESTIONS: number = 20;

const [collect, drop] = useDrop(() => ({
  accept: DragItem.MODULE,
  drop: (item: LessonBuilderDragItem) => {
    if (components.length < MAX_QUESTIONS) {
      lessonFormStore.insertComponentAt(item.name, lessonFormStore.insertModuleIndex);
      return;
    }
    utilStore.addAlert('Die maximale Anzahl von Lektionsbausteinen pro Lektion wurde erreicht', 'info');
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
    canDrop: (monitor.canDrop() && components.length < MAX_QUESTIONS),
  }),
}));

const isActive = computed(() => unref(canDrop) && unref(isOver));
const components = lessonFormStore.getLessonModules;
const {canDrop, isOver} = toRefs(collect);

</script>

<template>
  <div
      :ref="drop"
      class="container"
      :style="{borderColor: isActive ? themeColors.success : themeColors.primary}"
  >
    <v-container>
      <v-container v-if="components">
        <slot></slot>
      </v-container>
      <v-container>
        <v-row>
          <v-col v-if="!components.length">
            <v-icon icon="mdi-tools"></v-icon>
          </v-col>
          <v-col>
            {{
              !components.length ? "Füge Lektionsbausteine hinzu indem du sie aus der Rechten Spalte herziehst" : "Füge weitere Lektionsbausteine hinzu indem du sie aus der Rechten Spalte herziehst"
            }}
          </v-col>
        </v-row>
      </v-container>
    </v-container>
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
  min-height: 75vh;
}
</style>
