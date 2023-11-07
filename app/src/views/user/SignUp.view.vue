<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h2">Sign Up als <span class="text-info">{{ isTeacher ? 'Dozent' : 'Student' }}</span></h1>
      </v-col>
    </v-row>

    <v-form v-model="isFormValid" @submit.prevent="submit" ref="signUpForm" fast-fail class="mt-10">
      <v-row>
        <v-col cols="11">
          <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-switch color="primary" v-model="isTeacher" inset label="Dozent"></v-switch>
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
      <v-row v-if="!isTeacher">
        <v-col>
          <v-select
              label="Dozent"
              prepend-inner-icon="mdi-school"
              v-model="selectedTeacher"
              :rules="[rules.required]"
              :items="teachers"
              :item-title="item => item.username"
              :item-value="item => item.id"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block type="submit" :disabled="!isFormValid"> Registrieren </v-btn>
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
import {useAuthStore} from "@/stores/auth.store";
import {matchingPasswordsRule, requiredEmailRule, requiredRule} from "@/utils/validationRules";

import router from "@/router";
import {AuthenticationError} from "@/errors/custom.errors.ts";
import {useUtilStore} from "@/stores/util.store.ts";

const authStore = useAuthStore();
const utilStore = useUtilStore();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isFormValid = ref(false);
const isTeacher = ref<boolean>(false);
const teachers = ref<{ id: string, username: string }[]>([]);
const selectedTeacher = ref<string>();

const submit = async () => {
  if (isFormValid.value) {
    try {
      const role = isTeacher.value ? 'teacher' : 'student';
      const teacher = isTeacher.value ? undefined : selectedTeacher.value;
      utilStore.startLoadingBar();
      await authStore.signUp(email.value, password.value, username.value, role, teacher)
          .then(() => {
            router.push({name: "Home"})
                .then(() => {
                  utilStore.addAlert("Bitte Bestätigen Sie noch Ihre Email", "info");
                });
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
  matchingPasswords: (value: string) => matchingPasswordsRule(value, password.value),
  email: requiredEmailRule,
};

onBeforeMount(async () => {
  const data = await authStore.getTeachers();
  if (data) teachers.value = data;
})
</script>

<style>
</style>