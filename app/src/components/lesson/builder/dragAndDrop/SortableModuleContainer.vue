<script lang="ts" setup>
import {useDrag, useDrop} from 'vue3-dnd'
import {DragItem} from "@/types/dragItem.ts";
import type {Identifier, XYCoord} from 'dnd-core'
import { ComponentInstance, computed, markRaw, onMounted, ref, unref } from "vue";
import {toRefs} from '@vueuse/core'
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import TrueOrFalseForm from "@/components/lesson/modules/trueOrFalse/TrueOrFalseForm.vue";
import MultipleChoiceForm from "@/components/lesson/modules/multipleChoice/MultipleChoiceForm.vue";
import SliderForm from "@/components/lesson/modules/slider/SliderForm.vue";
import TextfieldForm from "@/components/lesson/modules/textfield/TextfieldForm.vue";
import NotesForm from "@/components/lesson/modules/notes/NotesForm.vue";
import DividerForm from "@/components/lesson/modules/divider/DividerForm.vue";
import CatalogRequirementSelectionForm from "@/components/lesson/modules/requirement/RequirementSelectionForm.vue";

const props = defineProps<{
  id: string
  componentName: string | null
}>()

interface LessonModuleFormMap {
  [key: string]: ComponentInstance<any>;
}

const lessonModuleFormMap: LessonModuleFormMap = {
  'TrueOrFalse': markRaw(TrueOrFalseForm),
  'Requirement': markRaw(CatalogRequirementSelectionForm),
  'MultipleChoice': markRaw(MultipleChoiceForm),
  'Slider': markRaw(SliderForm),
  'Textfield': markRaw(TextfieldForm),
  'Note': markRaw(NotesForm),
  'Divider': markRaw(DividerForm)
};

const getLessonModuleFormInstance = (lessonModuleFormName: string): ComponentInstance<any> => {
  return lessonModuleFormMap[lessonModuleFormName];
};

const lessonFormStore = useLessonFormStore();

interface Item {
  id: string
  originalIndex: number
}

const sortable = ref<HTMLDivElement>()

const [dropCollect, drop] = useDrop<Item, void, { handlerId: Identifier | null }>({
  accept: [DragItem.SORTABLE, DragItem.MODULE],
  hover(item: Item, monitor) {

    if (!sortable.value) {
      return;
    }

    const dragIndex = lessonFormStore.getLessonModuleIndexById(item.id);
    const hoverIndex = lessonFormStore.getLessonModuleIndexById(props.id);

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = sortable.value?.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

    // Inserting upwards
    if (dragIndex < 0 && hoverClientY < hoverMiddleY) {
      lessonFormStore.setInsertingComponentIndex(hoverIndex)
      return;
    }

    // Inserting downwards
    if (dragIndex < 0 && hoverClientY > hoverMiddleY) {
      lessonFormStore.setInsertingComponentIndex(hoverIndex + 1)
      return;
    }

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    lessonFormStore.moveLessonModule(item.id, hoverIndex);
  },
})

const [collect, drag] = useDrag({
  type: DragItem.SORTABLE,
  item: () => {
    return { id: props.id }
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
})

const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0.5 : 1))


onMounted(() => {
  if (sortable.value) {
    drag(drop(sortable.value))
  }
})

</script>

<template>
  <div ref="sortable" class="sortable" :style="{ opacity: opacity }">
    <v-sheet rounded class="pa-3">
      <component v-if="props.componentName"
                 :is="getLessonModuleFormInstance(props.componentName)"
                 :key="props.id"
                 :componentId="props.id"
      ></component>
    </v-sheet>
  </div>
</template>

<style scoped>
  .sortable {
    cursor: move;
  }
</style>