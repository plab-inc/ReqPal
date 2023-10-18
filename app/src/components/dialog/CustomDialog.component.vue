<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: "Warning"
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed?"
  },
  confirmLabel: {
    type: String,
    default: "Confirm"
  },
  cancelLabel: {
    type: String,
    default: "Cancel"
  },
  modelValue: {
    type: Boolean
  }
});
const emit = defineEmits();

function cancel() {
  openDialog.value = false;
  emit('cancel');
}

function confirm() {
  openDialog.value = false;
  emit('confirm');
}

const openDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
openDialog.value = props.modelValue;
</script>

<template>
  <v-dialog v-model="openDialog" max-width="800px">
    <v-card variant="elevated" class="pa-4">
      <v-row>
        <v-col cols="1" class="d-flex align-center">
          <v-icon class="ml-2" icon="mdi-information" size="60"></v-icon>
        </v-col>
        <v-col cols="11" class="d-flex align-center">
          <v-card-title>{{ title }}</v-card-title>
        </v-col>
      </v-row>

      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="cancel">{{ cancelLabel }}</v-btn>
        <v-btn color="warning" @click="confirm">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

