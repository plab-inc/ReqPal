<template>
  <div v-if="stepperStore.scenario">
    <div class="text-h3">
      Ergebnisse Szenario: {{ stepperStore.scenario?.title }}
    </div>
    <v-divider opacity="1" class="my-2" />
  </div>
  <div v-else>
    <div class="text-h3">
      Kein Szenario geladen.
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStepperStore } from "@/stores/stepper.ts";

const stepperStore = useStepperStore();
</script>