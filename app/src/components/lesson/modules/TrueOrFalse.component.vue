<script setup lang="ts">

import {ref} from "vue";
import {requiredBooleanRule} from "@/utils/validationRules.ts";
import Hint from "@/components/lesson/modules/Hint.component.vue";
import Help from "@/components/lesson/modules/Help.component.vue";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();
const question = lessonStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonStore.getComponentFieldValues(props.componentId, 'hint')
const solution = lessonStore.getComponentFieldValues(props.componentId, 'solution');

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonStore.setComponentData(props.componentId, 'options', fields.options);
}

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});

</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col sm="10">
          <v-row>
            <div class="text-h6 text-md-h5 mr-2">True or False?</div>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-h6">{{ question }}</div>
              <v-container>
                <v-radio-group v-model="fields.options" :rules="[requiredBooleanRule]">
                  <v-radio label="True" :value="true"
                           :class="{'disabled': solution !== undefined,'right': (solution !== undefined && solution === fields.options), 'wrong': (solution !== undefined && solution !== fields.options)}"></v-radio>
                  <v-radio label="False" :value="false"
                           :class="{'disabled': solution !== undefined, 'right': (solution !== undefined && !solution === !fields.options), 'wrong': (solution !== undefined && solution !== fields.options)}"></v-radio>
                </v-radio-group>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="2" class="d-flex flex-grow-1 align-end justify-end">
          <div class="mr-2">
            <Help dialog-type="mcExplanation"></Help>
          </div>
          <div>
            <Hint v-if="hint" :hint="hint"></Hint>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.right {
  color: #52ff52;
  font-weight: bold;
}

.wrong {
  color: #ff4b4b;
  font-weight: bold;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
