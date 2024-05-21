<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Mein Account
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-form v-model="isUserFormValid" @submit.prevent="saveChanges">
      <v-row>
        <v-col cols="8" class="text-h5">
          Profil
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-5">
        <v-col>
          <v-select
              v-model="selectedAvatar"
              label="Avatar auswählen"
              :items="avatarOptions"
              item-title="name"
              item-value="name"
              variant="outlined"
              prepend-icon="mdi-camera-account"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :prepend-avatar="item.raw.src" class="pa-2">
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="username"
              label="Benutzername"
              prepend-icon="mdi-account-edit"
              :rules="[requiredRule, requiredUniqueUsernameExcludingUUIDRule]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="email"
              label="E-Mail"
              :rules="[requiredEmailRule]"
              prepend-icon="mdi-email"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block color="primary" type="submit" :disabled="!isUserFormValid">Änderungen speichern</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="my-5"/>
    <v-form v-model="isPasswordFormValid" @submit.prevent="updatePassword" class="mt-5">
      <v-row>
        <v-col cols="8" class="text-h5">
          Passwort
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-5">
        <v-col>
          <v-text-field
              v-model="password"
              type="password"
              label="Neues Passwort"
              prepend-icon="mdi-lock"
              :rules="[requiredRule, requiredAtLeast6CharsRule]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block type="submit" :disabled="!isPasswordFormValid" color="primary">Passwort ändern</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useProfileStore} from "@/stores/profile.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {
  requiredAtLeast6CharsRule,
  requiredEmailRule,
  requiredRule,
  requiredUniqueUsernameExcludingUUIDRule,
} from "@/utils/validationRules.ts";
import alertService from "@/services/util/alert.ts";

const avatarOptions = [
  {name: 'Eule', src: 'avatars/eule.png'},
  {name: 'Katze', src: 'avatars/katze.png'},
  {name: 'Panda', src: 'avatars/panda.png'},
  {name: 'Pinguin', src: 'avatars/pinguin.png'},
  {name: 'FHDO', src: 'avatars/fhdo.png'},
  {name: 'Eichhörnchen', src: 'avatars/eichhoernchen.png'}
];

const profileStore = useProfileStore();
const authStore = useAuthStore();
const selectedAvatar = ref('');
const isUserFormValid = ref(false);
const isPasswordFormValid = ref(false);

const username = ref(authStore.user?.user_metadata.username);
const email = ref(authStore.user?.email);
const password = ref();

onMounted(async () => {
  if (authStore.user) await profileStore.fetchProfile(authStore.user.id);
  selectedAvatar.value = profileStore.avatar.charAt(0).toUpperCase() + profileStore.avatar.slice(1);
})

async function updatePassword() {

  password.value = password.value.trim();

  if (password.value) {
    try {
      await authStore.updatePassword(password.value);
      alertService.addSuccessAlert("Das Passwort wurde erfolgreich aktualisiert!");
    } catch (error: any) {
      alertService.addErrorAlert("Das Passwort konnte nicht aktualisiert werden: " + error.message);
    }
  }
}

async function saveChanges() {
  let userUUID: string;
  if (authStore.user) {
    userUUID = authStore.user.id;
  } else {
    alertService.addErrorAlert("Es ist ein Fehler aufgetreten.")
    return;
  }

  const originalUsername = authStore.user?.user_metadata.username;
  const originalEmail = authStore.user?.email;
  const originalAvatar = profileStore.avatar;

  selectedAvatar.value = selectedAvatar.value.toLowerCase();
  username.value = username.value.trim();
  email.value = email.value?.trim();

  if (originalUsername === username.value && originalEmail === email.value
      && originalAvatar === selectedAvatar.value) {
    alertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.");
    return;
  }

  if (username.value !== originalUsername) {
    try {
      await authStore.updateUsername(username.value);
      await profileStore.updateProfileUsername(userUUID, username.value);
    } catch (error: any) {
      alertService.addErrorAlert("Der Benutzername konnte nicht aktualisiert werden.");
      return;
    }
  }

  if (email.value && (originalEmail !== email.value)) {
    try {
      await authStore.updateEmail(email.value);
      alertService.addInfoAlert("Bitte bestätigen Sie die Änderung mit dem Link in der Email an Ihre neue Adresse.")
    } catch (error: any) {
      alertService.addErrorAlert("Die Email konnte nicht aktualisiert werden.");
      return;
    }
  }

  if (selectedAvatar.value && (originalAvatar !== selectedAvatar.value)) {
    try {
      await profileStore.updateProfileAvatar(userUUID, selectedAvatar.value);
    } catch (error: any) {
      alertService.addErrorAlert("Der Avatar konnte nicht aktualisiert werden.");
      return;
    }
  }

  alertService.addSuccessAlert("Die Daten wurden erfolgreich aktualisiert!");
}

</script>
