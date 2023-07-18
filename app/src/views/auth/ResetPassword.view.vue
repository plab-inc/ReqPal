<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h2">Passwort zurücksetzen</h1>
      </v-col>
    </v-row>
    <v-form v-model="isFormValid" @submit.prevent="submit" ref="resetPasswordForm" fast-fail>
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
          <v-btn type="submit" :disabled="!isFormValid" block> Reset </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-btn variant="plain" key="login" to="/login"> Bereits registriert? </v-btn>
        <v-btn variant="plain" key="signup" to="/signup"> Noch nicht registriert? </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { useAuthStore } from "@/stores/auth.store";
import { requiredRule, emailRule } from "@/utils/validationRules";
import { addErrorAlert, addInfoAlert } from "@/services/alert.service";

const authStore = useAuthStore();

const email = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {

    try {
      await authStore.resetPassword(email.value).then(() => {
        addInfoAlert("Falls die E-Mail-Adresse in unserer Datenbank existiert, haben wir dir eine E-Mail mit weiteren Anweisungen zum Zurücksetzen deines Passworts geschickt.");
      })
    } catch (error: any) {
      console.error(error);
      addErrorAlert(error.message);
    }
  }
}

const rules = {
  required: requiredRule,
  email: emailRule,
};
</script>