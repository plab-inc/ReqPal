<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h3">
      Registrieren als <span class="text-info">{{ isTeacher ? 'Dozent' : 'Student' }}</span>
    </v-col>
    <v-col v-if="isTeacher" cols="auto" class="text-subtitle-1">
      <v-alert color="info" icon="mdi-school" title="Hinweis zur Registrierung" text="Wenn Sie sich als Dozent registrieren, muss Ihre Registrierung zunächst von den Moderatoren auf ReqPal validiert und anschließend freigegeben werden.
      Bis dahin werden Sie noch nicht als Dozent auf ReqPal erkannt. Sobald sich Ihr Status ändert, können Sie als Dozent loslegen!"></v-alert>
    </v-col>
  </v-row>
  <v-divider/>
  <v-form v-model="isFormValid" @submit.prevent="submit" ref="signUpForm" fast-fail class="mt-10">
    <v-row no-gutters justify="space-between">
      <v-col cols="10">
        <v-text-field
            v-model="username"
            label="Username"
            prepend-inner-icon="mdi-account"
            :rules="[requiredRule, requiredUsernameRule, requiredUniqueUsernameRule]"
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
            variant="outlined"
            prepend-inner-icon="mdi-school"
            v-model="selectedTeacher"
            :rules="[requiredRule]"
            :items="teachers"
            :item-title="(item: any) => item.username"
            :item-value="(item: any) => item.id"
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
import { useAuthStore } from "@/stores/auth.ts";
import {
  matchingPasswordsRule,
  requiredAtLeast6CharsRule,
  requiredEmailRule,
  requiredRule,
  requiredUniqueUsernameRule,
  requiredUsernameRule
} from "@/utils/validationRules";

import router from "@/router";
import { AuthenticationError, UserAlreadyRegisteredError } from "@/errors/custom.ts";
import { useUtilStore } from "@/stores/util.ts";
import { useProfileStore } from "@/stores/profile.ts";
import { onBeforeMount, ref } from "vue";

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

const submit = async () => {
  if (isFormValid.value) {

    try {
      const role = isTeacher.value ? 'pending' : 'student';
      const teacher = isTeacher.value ? undefined : selectedTeacher.value;
      await authStore.signUp(email.value, password.value, username.value, role, teacher)
          .then(() => {
            router.push({name: "Home"})
                .then(() => {
                  utilStore.addAlert("Bitte Bestätigen Sie Ihre Email", "info");
                });
          })
    } catch (error: any) {
      if (error instanceof UserAlreadyRegisteredError) {
        throw error;
      }
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