<script setup lang="ts">
import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import Help from "@/components/lesson/modules/Help.component.vue";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const inputValue = ref<number>(0);

const sliderExplanation =
    "In einer Slider Aufgabe ist das Ziel, abhängig von der Fragestellung, einen Wert auf dem Schieberegler auszuwählen oder einzuschätzen. " +
    "Klicken Sie auf den Regler und ziehen Sie diesen nach links oder rechts, um einen Wert einzustellen. Ganz links befindet sich der kleinste Wert, " +
    "während ganz rechts sich der maximale Wert befindet."

const lessonFormStore = useLessonFormStore();
const question = lessonFormStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonFormStore.getComponentFieldValues(props.componentId, 'hint')

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.options);
}

init();

function init() {
  if (fields.value.options.hasOwnProperty('input')) {
    inputValue.value = fields.value.options.input;
  } else {
    inputValue.value = (fields.value.options.maxValue / 2);
  }
}

watch(inputValue, (newInput) => {
  fields.value.options = {
    steps: fields.value.options.steps,
    minValue: fields.value.options.minValue,
    maxValue: fields.value.options.maxValue,
    input: newInput
  };
  updateStoreData(fields.value)
}, {deep: true});
</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-row>
            <v-col class="d-flex justify-start align-center">
              <div class="text-h6 text-md-h5 mr-2">Slider</div>
              <Help title="Slider Aufgabe: Erklärung" :text="sliderExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-h6">{{ question }}</div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <Hint v-if="hint" :hint="hint"></Hint>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-slider
              v-model="inputValue"
              :min="fields.options.minValue"
              :max="fields.options.maxValue"
              :step="fields.options.steps"
              color="orange"
              track-color="warning"
              thumb-label>
          </v-slider>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
