<script setup lang="ts">
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {requiredStringRule} from "@/utils/validationRules.ts";
import Help from "@/components/lesson/builder/helper/Help.vue";
import Delete from "@/components/lesson/builder/helper/Delete.vue";

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'options') || [''],
});

updateStoreData(fields.value);

function updateStoreData(fields: any) {
  lessonFormStore.setLessonModuleData(props.componentId, 'options', fields.options);
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
    <v-row  no-gutters v-for="(field, index) in fields.options" :key="index">
      <v-col :cols="index > 0 ? '11':'12'">
        <v-text-field
            :rules="[requiredStringRule]"
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
    <v-row no-gutters>
      <v-col class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="notesTeacherExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>