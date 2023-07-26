<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h2">Sign Up</h1>
      </v-col>
    </v-row>

    <v-form v-model="isFormValid" @submit.prevent="submit" ref="signUpForm" fast-fail>
      <v-row>
        <v-col>
          <v-text-field
            v-model="username"
            label="Username"
            prepend-inner-icon="mdi-account"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
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
          <v-text-field
            v-model="confirmPassword"
            label="Passwort wiederholen"
            :rules="[rules.required, rules.matchingPasswords]"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block type="submit" :disabled="!isFormValid"> Submit </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col>
        <v-btn variant="plain" key="login" to="/login">Bereits registriert?</v-btn>
        <v-btn variant="plain" key="resetPassword" to="/resetPassword">Passwort vergessen?</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { addErrorAlert } from "@/services/alert.service";
import { requiredRule, matchingPasswordsRule, emailRule } from "@/utils/validationRules";

import router from "@/router";

const authStore = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {
    try {
      await authStore.signUp(email.value, password.value, username.value).then(() => {
        if (authStore.session) {
          router.push({ name: "Profile" });
        }
      })
    } catch (error: any) {
      console.error(error);
      addErrorAlert(error.message);
    }
  }
};

const rules = {
  required: requiredRule,
  matchingPasswords: (value: string) => matchingPasswordsRule(value, password.value),
  email: emailRule,
};
</script>

<style>
</style>