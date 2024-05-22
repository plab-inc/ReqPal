<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h3">
      Willkommen Zurück!
    </v-col>
  </v-row>
  <v-divider/>
  <v-form v-model="isFormValid" @submit.prevent="submit" ref="signInForm" fast-fail class="mt-10">
    <v-row no-gutters>
      <v-col>
        <v-text-field
            v-model="email"
            label="E-Mail"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            type="email"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="password"
            label="Passwort"
            prepend-inner-icon="mdi-lock-outline"
            :rules="[rules.required]"
            type="password"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block type="submit" :disabled="!isFormValid"> Einloggen</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-row>
    <v-col>
      <v-btn variant="plain" key="signup" to="/signup"> Noch nicht registriert?</v-btn>
      <v-btn variant="plain" key="resetPassword" to="/resetPassword"> Passwort vergessen?</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import router from "@/router";
import {useAuthStore} from "@/stores/auth.ts";
import {requiredEmailRule, requiredRule} from "@/utils/validationRules";
import {useProfileStore} from "@/stores/profile.ts";
import {useUtilStore} from "@/stores/util.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import { ref } from "vue";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const utilStore = useUtilStore();

const email = ref("");
const password = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {
    await authStore.signIn(email.value, password.value)
        .then(() => {
          if (authStore.session) {
            profileStore.fetchProfile(authStore.session.user.id);
            router.push({name: 'Home'}).then(() => {
              utilStore.addAlert("Erfolgreich angemeldet", "success");
            });
          }
        })
        .catch((error) => {
          throw new AuthenticationError(error.message, error.code);
        });
  }
}

const rules = {
  required: requiredRule,
  email: requiredEmailRule,
};
</script>

<style>
</style>