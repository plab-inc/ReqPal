<script setup lang="ts">

import {ref} from "vue";
import {requiredBooleanRule} from "@/utils/validationRules.ts";
import Hint from "@/components/lesson/builder/helper/Hint.vue";
import Help from "@/components/lesson/builder/helper/Help.vue";
import {useLessonStore} from "@/stores/lesson.ts";
import {useAuthStore} from "@/stores/auth.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();
const question = lessonStore.getLessonModuleFieldValues(props.componentId, 'question')
const hint = lessonStore.getLessonModuleFieldValues(props.componentId, 'hint')
const solution = lessonStore.getLessonModuleFieldValues(props.componentId, 'solution');
const questionId = lessonStore.getLessonModuleFieldValues(props.componentId, 'uuid');
const points = lessonStore.getLessonModuleFieldValues(props.componentId, 'points');
const authStore = useAuthStore();
const isTeacher: boolean = authStore.isTeacher;

const fields = ref<any>({
  options: lessonStore.getLessonModuleFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonStore.setLessonModuleData(props.componentId, 'options', fields.options);
}

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});

</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="11">
          <div class="text-h6 text-md-h5">True or False?</div>
        </v-col>
        <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
          <div class="text-h4">
            {{ points }}
            <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="10">
          <v-row v-if="!isTeacher">
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

          <v-row v-else>
            <v-col>
              <div class="text-h6">{{ question }}</div>
              <v-container>
                <v-radio-group v-model="fields.options" :rules="[requiredBooleanRule]">
                  <v-radio label="True" :value="true"
                           :class="{'disabled': solution !== undefined,
                           'right': (solution !== undefined && solution),
                           'wrong': (solution !== undefined && !solution)}"></v-radio>
                  <v-radio label="False" :value="false"
                           :class="{'disabled': solution !== undefined,
                           'right': (solution !== undefined && !solution),
                           'wrong': (solution !== undefined && solution)}"></v-radio>
                </v-radio-group>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="2" class="d-flex flex-grow-1 align-end justify-end">
          <div class="mr-2">
            <Help dialog-type="tfExplanation"></Help>
          </div>
          <div>
            <Hint v-if="hint" :hint="hint" :questionId="questionId"></Hint>
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
