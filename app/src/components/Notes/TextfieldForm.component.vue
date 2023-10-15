<script setup lang="ts">
import {noEmptyStringRule} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const props = defineProps<{ componentId: number }>();
const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options') || [''],
});

updateStoreData(fields.value);

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.options);
}

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});
</script>

<template>
  <div class="text-subtitle-1">{{ 'Füge hier einen Titel oder eine Beschreibung zur Aufgabe hinzu.' }}</div>
  <v-textarea
      v-model="fields.options"
      :rules="[noEmptyStringRule]"
      label="Beschreibung"
      variant="outlined"
      auto-grow></v-textarea>
</template>
