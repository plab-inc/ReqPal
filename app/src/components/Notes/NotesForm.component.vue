<script setup lang="ts">
import { ref } from 'vue';
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {requiredRule} from "@/utils/validationRules.ts";

const props = defineProps<{ componentId: number }>();
const lessonFormStore = useLessonFormStore();
const rules = {
  required: requiredRule
};
const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options') || [''],
});

updateStoreData(fields.value);

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.options);
}

const addField = () => {
  fields.value.options.push('');
};

const removeField = (index: number) => {
  fields.value.options.splice(index, 1);
};

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});

</script>

<template>
  <v-container>
    <v-row v-for="(field, index) in fields.options" :key="index">
      <v-col :cols="index > 0 ? '11':'12'">
        <v-text-field
            :rules="[rules.required]"
            v-model="fields.options[index]"
            :label="'Name des Notizfelds ' + (index + 1)"
            variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col :cols="1">
        <v-btn icon v-if="index > 0" @click="removeField(index)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="addField" icon>
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

