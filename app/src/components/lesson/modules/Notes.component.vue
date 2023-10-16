<script setup lang="ts">

interface Props {
  textLabel: string,
  modelValue: string
}

const props = defineProps<Props>();

</script>

<template>
  <v-textarea :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              :label="textLabel"
              variant="outlined"
              auto-grow></v-textarea>
</template>