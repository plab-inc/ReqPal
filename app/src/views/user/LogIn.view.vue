<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h2">Log in</h1>
      </v-col>
    </v-row>
    <v-form v-model="isFormValid" @submit.prevent="submit" ref="signInForm" fast-fail>
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
          <v-btn block type="submit" :disabled="!isFormValid"> Submit </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-btn variant="plain" key="signup" to="/signup"> Noch nicht registriert? </v-btn>
        <v-btn variant="plain" key="resetPassword" to="/resetPassword"> Passwort vergessen? </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import router from "@/router";

import { useAuthStore } from "@/stores/auth.store";
import { requiredRule, emailRule } from "@/utils/validationRules";

import {AuthenticationError} from "@/errors/custom.errors.ts";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {

    try {
      await authStore.signIn(email.value, password.value).then(() => {
        if (authStore.session) {
          router.push({ name: "Profile" });
        }
      })
    } catch (error: any) {
      throw new AuthenticationError(error.message, error.code);
    }
  }
}

const rules = {
  required: requiredRule,
  email: emailRule,
};
</script>

<style>
</style>