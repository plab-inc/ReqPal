<script setup lang="ts">
interface Props {
  componentId: number,
  question: string | any,
  options: any,
  hint: string | any,
}

const props = defineProps<Props>();

const textInput = ref<string[]>([]);
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title>
        Notizen
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-container>
          <v-row>
            <v-col v-for="(label, index) in options" :key="index" :cols="12/options.length">
              <v-textarea v-model="textInput[index]"
                          class="mt-4"
                          :label="label"
                          variant="outlined"
                          auto-grow></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>