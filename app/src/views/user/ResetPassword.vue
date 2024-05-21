<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h3">
      Passwort zurücksetzen
    </v-col>
  </v-row>
  <v-divider/>
  <v-form v-model="isFormValid" @submit.prevent="submit" ref="resetPasswordForm" fast-fail class="mt-10">
    <v-row>
      <v-col>
        <v-text-field
            v-model="email"
            label="E-Mail"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            type="email"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn type="submit" :disabled="!isFormValid" block> Passwort Zurücksetzen</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-row>
    <v-col>
      <v-btn variant="plain" key="login" to="/login"> Bereits registriert?</v-btn>
      <v-btn variant="plain" key="signup" to="/signup"> Noch nicht registriert?</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import {useAuthStore} from "@/stores/auth.ts";
import {requiredEmailRule, requiredRule} from "@/utils/validationRules";
import AlertService from "@/services/util/alert.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import {useUtilStore} from "@/stores/util.ts";

const authStore = useAuthStore();
const utilStore = useUtilStore();

const email = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {
    utilStore.startLoadingBar();
    try {
      await authStore.resetPassword(email.value)
          .then(() => {
            AlertService.addInfoAlert("Falls die E-Mail-Adresse in unserer Datenbank existiert, haben wir dir eine E-Mail mit weiteren Anweisungen zum Zurücksetzen deines Passworts geschickt.");
          })
          .finally(() => {
            utilStore.stopLoadingBar();
          });
    } catch (error: any) {
      throw new AuthenticationError(error.message, error.code);
    }
  }
}

const rules = {
  required: requiredRule,
  email: requiredEmailRule,
};
</script>