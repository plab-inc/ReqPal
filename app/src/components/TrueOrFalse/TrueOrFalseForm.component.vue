<script setup lang="ts">
import {booleanValueRule, requiredRule} from "@/utils/validationRules";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const props = defineProps<{componentId: number}>();
const lessonFormStore = useLessonFormStore();

const fields = ref({
  question: lessonFormStore.getComponentFieldValues(props.componentId, 'question'),
  solution: lessonFormStore.getComponentFieldValues(props.componentId, 'solution'),
  hint: lessonFormStore.getComponentFieldValues(props.componentId, 'hint')
});

watch(fields, (newFields) => {
  lessonFormStore.setComponentData(props.componentId, 'question', newFields.question);
  lessonFormStore.setComponentData(props.componentId, 'solution', newFields.solution);
  lessonFormStore.setComponentData(props.componentId, 'hint', newFields.hint);
}, { deep: true });

const rules = {
  required: requiredRule,
  requiredBool: booleanValueRule,
};
</script>

<template>
  <v-container>
    <v-text-field
        label="Frage"
        v-model="fields.question"
        :rules="[rules.required]"
    ></v-text-field>

    <v-row>
      <v-col cols="6">
        <v-radio-group
            label="Lösung zur Frage:"
            v-model="fields.solution"
            :rules="[rules.requiredBool]"
        >
          <v-radio label="Richtig" :value="true"></v-radio>
          <v-radio label="Falsch" :value="false"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="6">
        <v-text-field
            label="Hinweis"
            v-model="fields.hint"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>