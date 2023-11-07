<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h2">Log in</h1>
      </v-col>
    </v-row>
    <v-form v-model="isFormValid" @submit.prevent="submit" ref="signInForm" fast-fail class="mt-10">
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
          <v-btn block type="submit" :disabled="!isFormValid"> Einloggen </v-btn>
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

import {useAuthStore} from "@/stores/auth.store";
import {requiredEmailRule, requiredRule} from "@/utils/validationRules";

import {AuthenticationError} from "@/errors/custom.errors.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import {useUtilStore} from "@/stores/util.store.ts";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const utilStore = useUtilStore();

const email = ref("");
const password = ref("");
const isFormValid = ref(false);

const submit = async () => {
  if (isFormValid.value) {
    utilStore.startLoadingBar();
    try {
      await authStore.signIn(email.value, password.value)
          .then(() => {
            if (authStore.session) {
              profileStore.fetchProfile(authStore.session.user.id);
              router.push({ name: 'Home' }).then(() => {
                utilStore.addAlert("Erfolgreich angemeldet", "success");
              });
            }})
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

<style>
</style>