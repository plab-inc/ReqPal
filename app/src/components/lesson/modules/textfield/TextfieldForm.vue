<script setup lang="ts">
import {requiredStringRule} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import Help from "@/components/lesson/builder/helper/Help.vue";
import Delete from "@/components/lesson/builder/helper/Delete.vue";
import { ref, watch } from "vue";

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'options') || [''],
});

updateStoreData(fields.value);

function updateStoreData(fields: any) {
  lessonFormStore.setLessonModuleData(props.componentId, 'options', fields.options);
}

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-textarea
            placeholder="Hier kannst du deinen Studierenden weitere Informationen geben."
            v-model="fields.options"
            :rules="[requiredStringRule]"
            label="Beschreibung"
            variant="outlined"
            auto-grow></v-textarea>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="textfieldExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>
