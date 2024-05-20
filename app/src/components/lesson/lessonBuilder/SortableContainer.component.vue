<script lang="ts" setup>
import {useDrag, useDrop} from 'vue3-dnd'
import {DragItemTypes} from "@/types/dragItem.types.ts";
import type {Identifier, XYCoord} from 'dnd-core'
import {computed, ref, unref} from 'vue'
import {toRefs} from '@vueuse/core'
import TrueOrFalse from "@/components/lesson/lessonModuleForms/TrueOrFalseForm.component.vue";
import MultipleChoiceForm from "@/components/lesson/lessonModuleForms/MultipleChoiceForm.component.vue";
import SliderForm from "@/components/lesson/lessonModuleForms/SliderForm.component.vue";
import TextfieldForm from "@/components/lesson/lessonModuleForms/TextfieldForm.component.vue";
import NotesForm from "@/components/lesson/lessonModuleForms/NotesForm.component.vue";
import Divider from "@/components/lesson/lessonModuleForms/DividerForm.component.vue";
import CatalogRequirementSelection
  from "@/components/lesson/lessonModuleForms/CatalogRequirementSelectionForm.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const props = defineProps<{
  id: string
  componentName: string | null
}>()

interface ComponentsMap {
  [key: string]: Component;
}

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(CatalogRequirementSelection),
  'MultipleChoice': markRaw(MultipleChoiceForm),
  'Slider': markRaw(SliderForm),
  'Textfield': markRaw(TextfieldForm),
  'Note': markRaw(NotesForm),
  'Divider': markRaw(Divider)
};

const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

const lessonFormStore = useLessonFormStore();

interface Item {
  id: string
  originalIndex: number
}

const sortable = ref<HTMLDivElement>()

const [dropCollect, drop] = useDrop<Item, void, { handlerId: Identifier | null }>({
  accept: [DragItemTypes.SORTABLE, DragItemTypes.COMPONENT],
  hover(item: Item, monitor) {

    if (!sortable.value) {
      return;
    }

    const dragIndex = lessonFormStore.getComponentIndexById(item.id);
    const hoverIndex = lessonFormStore.getComponentIndexById(props.id);

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

    lessonFormStore.moveComponent(item.id, hoverIndex);
  },
})

const [collect, drag] = useDrag({
  type: DragItemTypes.SORTABLE,
  item: () => {
    return { id: props.id }
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
})

const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0.85 : 1))


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
                 :is="getComponentInstance(props.componentName)"
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