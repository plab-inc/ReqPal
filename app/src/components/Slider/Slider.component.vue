<script setup lang="ts">
import {ref} from "vue";
import {sliderAnswer} from "@/interfaces/Question.interfaces.ts";

const startValue: number = 5;
const value = ref<number>(startValue);

const sliderValues = ref<sliderAnswer>({
  id: 1,
  minValue: 0,
  maxValue: 10,
  correctValue: 5,
  tolerance: 0,
  steps: 1
});

onBeforeMount(() => {

})
</script>

<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h6 text-md-h5">Slider</div>
          <div class="text-h6">Beschreibung</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form>
            <v-slider
                v-model="value"
                :min="sliderValues.minValue"
                :max="sliderValues.maxValue"
                :step="sliderValues.steps"
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