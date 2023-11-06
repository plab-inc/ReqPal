<template>
  <h1>Account</h1>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-select
            v-model="selectedAvatar"
            label="Avatar auswählen"
            :items="avatarOptions"
            item-title="name"
            item-value="name"
            prepend-icon="mdi-camera-account"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-avatar="item.raw.src" class="pa-2">
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="username"
            label="Benutzername"
            prepend-icon="mdi-account-edit"
            @blur="checkUsernameExists"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="email"
            label="E-Mail"
            prepend-icon="mdi-email"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="updateEmail" color="primary">Ändern</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="oldPassword"
            type="password"
            label="Altes Passwort"
            prepend-icon="mdi-lock-check"
        ></v-text-field>
        <v-text-field
            v-model="password"
            type="password"
            label="Neues Passwort"
            prepend-icon="mdi-lock"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useProfileStore} from "@/stores/profile.store.js";


const avatarOptions = [
  { name: 'Owl', src: 'src/assets/avatars/owl.png' },
  { name: 'Cat', src: 'src/assets/avatars/cat.png' },
  { name: 'Panda', src: 'src/assets/avatars/panda.png' },
  { name: 'Squirrel', src: 'src/assets/avatars/squirrel.png' },
];

const profileStore = useProfileStore();

const selectedAvatar = ref(profileStore.avatar);
const username = ref('InitBenutzername');
const email = ref('beispiel@domain.de');
const oldPassword = ref('');
const password = ref('');




const checkUsernameExists = async () => {

};

const updateEmail = () => {

};

const updatePassword = () => {

};

const updateSettings = () => {

};

</script>
