<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h3">
      Registrieren als als <span class="text-info">{{ isTeacher ? 'Dozent' : 'Student' }}</span>
    </v-col>
  </v-row>
  <v-divider></v-divider>

  <v-form v-model="isFormValid" @submit.prevent="submit" ref="signUpForm" fast-fail class="mt-10">
    <v-row no-gutters justify="space-between">
      <v-col cols="10">
        <v-text-field
            v-model="username"
            @blur="checkUsernameExists"
            label="Username"
            prepend-inner-icon="mdi-account"
            :rules="[requiredRule, requiredUsernameRule]"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
          <v-switch color="primary" v-model="isTeacher" class="ml-10" inset label="Ich bin Dozent"></v-switch>
      </v-col>
      <v-col>
        <v-text-field
            v-model="email"
            label="E-Mail"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredRule, requiredEmailRule]"
            type="email"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters class="my-3">
      <v-col>
        <v-text-field
            v-model="password"
            label="Passwort"
            prepend-inner-icon="mdi-lock-outline"
            :rules="[requiredRule, requiredAtLeast6CharsRule]"
            type="password"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="confirmPassword"
            label="Passwort wiederholen"
            :rules="[requiredRule,  (value: string) => matchingPasswordsRule(value, password)]"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>

    </v-row>
    <v-row v-if="!isTeacher" no-gutters>
      <v-col>
        <v-select
            label="Mein Dozent"
            prepend-inner-icon="mdi-school"
            v-model="selectedTeacher"
            :rules="[requiredRule]"
            :items="teachers"
            :item-title="item => item.username"
            :item-value="item => item.id"
        ></v-select>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-checkbox :rules="[requiredRule]">
          <template v-slot:label>
            <p> Ich habe die <a href="/legal" target="_blank">Nutzungsbedingungen</a> gelesen und akzeptiere diese.</p>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-btn block type="submit" :disabled="!isFormValid"> Registrieren</v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-row>
    <v-col>
      <v-btn variant="plain" key="login" to="/login">Bereits registriert?</v-btn>
      <v-btn variant="plain" key="resetPassword" to="/resetPassword">Passwort vergessen?</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {
  matchingPasswordsRule,
  requiredAtLeast6CharsRule,
  requiredEmailRule,
  requiredRule,
  requiredUsernameRule
} from "@/utils/validationRules";

import router from "@/router";
import {AuthenticationError} from "@/errors/custom.errors.ts";
import {useUtilStore} from "@/stores/util.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const utilStore = useUtilStore();


const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isFormValid = ref(false);
const isTeacher = ref<boolean>(false);
const teachers = ref<{ id: string, username: string }[]>([]);
const selectedTeacher = ref<string>();

async function checkUsernameExists() {
  return await profileStore.checkIfUsernameExists(username.value);
}


const submit = async () => {
  if (isFormValid.value) {

    if(await checkUsernameExists()){
      utilStore.addAlert("Nutzername existiert bereits", "error");
      return;
    }

    try {
      const role = isTeacher.value ? 'teacher' : 'student';
      const teacher = isTeacher.value ? undefined : selectedTeacher.value;
      await authStore.signUp(email.value, password.value, username.value, role, teacher)
          .then(() => {
            router.push({name: "Home"})
                .then(() => {
                  utilStore.addAlert("Bitte Bestätigen Sie Ihre Email", "info");
                });
          })
    } catch (error: any) {
      throw new AuthenticationError(error.message, error.code);
    }
  }
}

onBeforeMount(async () => {
  const data = await profileStore.getTeachers();
  if (data) teachers.value = data;
})
</script>

<style>
</style>