<script setup lang="ts">
import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue";

interface Props {
  componentId: number,
  question: string | any,
  options: { minValue: number, maxValue: number, steps: number } | any,
  hint: string | any
}

const props = defineProps<Props>();

const inputValue = ref<number>(0);

onBeforeMount(() => {
  inputValue.value = (props.options.maxValue / 2);
})
</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <div class="text-h6 text-md-h5">Slider</div>
          <div class="text-h6">{{ question }}</div>
        </v-col>
        <v-col cols="2">
          <Hint v-if="hint" :hint="hint"></Hint>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form>
            <v-slider
                v-model="inputValue"
                :min="options.minValue"
                :max="options.maxValue"
                :step="options.steps"
                color="orange"
                track-color="warning"
                thumb-label>
            </v-slider>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>