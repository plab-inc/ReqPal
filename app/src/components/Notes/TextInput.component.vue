<script setup lang="ts">
import {noEmptyStringRule, requiredRule} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const text = ref<string>("");
const props = defineProps<{ componentId: number }>();
const lessonFormStore = useLessonFormStore();

watch(text, (newText) => {
  lessonFormStore.setComponentData(props.componentId, 'question', newText);
}, {deep: true});

onBeforeMount(() => {
  const data = lessonFormStore.getComponentFieldValues(props.componentId, 'question');
  if (typeof data === 'string') {
    text.value = data;
  }
})
</script>

<template>
  <div class="text-subtitle-1">{{ 'Füge hier einen Titel oder eine Beschreibung zur Aufgabe hinzu.' }}</div>
  <v-textarea
      v-model="text"
      :rules="[noEmptyStringRule]"
      label="Beschreibung"
      variant="outlined"
      auto-grow></v-textarea>
</template>
