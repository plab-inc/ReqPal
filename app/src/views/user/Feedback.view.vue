<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Feedback
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <v-col>
        <v-form v-model="isFormValid" @submit.prevent="submitFeedback" fast-fail>
          <v-textarea
              label="Feedback"
              v-model="feedback"
              variant="outlined"
              :rules="[requiredRule, minMaxWords]"
          ></v-textarea>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn :disabled="!isFormValid" @click="submitFeedback" block>Abschicken</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {minMaxWords, requiredRule} from "@/utils/validationRules";
import feedbackService from "@/services/database/feedback.service.ts";
import router from "@/router";
import {useUtilStore} from "@/stores/util.store.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";

const feedback = ref('');
const isFormValid = ref(false);
const utilStore = useUtilStore();

const submitFeedback = async () => {
  try {
    await feedbackService.push.postFeedback(feedback.value).then(() => {
      router.push({name: "Home"}).then(() => {
        utilStore.addAlert("Feedback gesendet, wir kommen demnächst auf Sie zurück", "success");
      });
    })
  } catch (error: any) {
    throw new DatabaseError(error.message, error.code);
  }
};
</script>
  