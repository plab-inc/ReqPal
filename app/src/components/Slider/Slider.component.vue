<script setup lang="ts">
import {ref} from "vue";

interface Props {
  componentId: number,
  question: string | any,
  options: { minValue: number, maxValue: number, steps: number } | any,
  solution: { correctValue: number, tolerance: number } | any
}

const props = defineProps<Props>();

const inputValue = ref<number>(0);

onBeforeMount(() => {
  inputValue.value = (props.options.maxValue / 2);
})
</script>

<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h6 text-md-h5">Slider</div>
          <div class="text-h6">{{ question }}</div>
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