<script setup lang="ts">
import {requiredStringRule} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import Help from "@/components/lesson/modules/Help.component.vue";

const props = defineProps<{ componentId: string }>();
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
  <v-row>
    <v-col>
      <div class="text-subtitle-1">{{ 'Füge hier einen Titel oder eine Beschreibung zur Aufgabe hinzu.' }}</div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-textarea
          v-model="fields.options"
          :rules="[requiredStringRule]"
          label="Beschreibung"
          variant="outlined"
          auto-grow></v-textarea>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="d-flex flex-grow-1 align-end justify-end">
      <div class="mr-2">
        <Help dialog-type="textfieldExplanation"></Help>
      </div>
    </v-col>
  </v-row>
</template>
