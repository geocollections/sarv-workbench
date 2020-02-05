<template>
  <div class="settings">
    <div class="row mt-4">
      <div class="col">
        <p class="h3 mb-2">{{ $t("header.settings") }}</p>
      </div>
    </div>

    <!-- COLORS -->
    <v-card
      class="mt-2"
      id="block-colors"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.colors = !block.colors"
        >
          <span>{{ $t("settings.colors") }}</span>
          <v-icon right>fas fa-paint-roller</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.colors = !block.colors"
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.colors ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.colors" class="px-1 pt-1 pb-2">
          <Colors />
        </div>
      </transition>
    </v-card>

    <!-- ACCESSIBILITY -->
    <v-card
      class="mt-2"
      id="block-accessibility"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.accessibility = !block.accessibility"
        >
          <span>{{ $t("settings.accessibility") }}</span>
          <v-icon right>fas fa-wrench</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.accessibility = !block.accessibility"
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.accessibility ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.accessibility" class="px-1 pt-1 pb-2">
          <Accessibility
            :body-active-color="appSettings.bodyActiveColor"
            :body-dark="appSettings.bodyDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- SHORTCUTS -->
    <v-card
      class="mt-2"
      id="block-shortcuts"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.shortcuts = !block.shortcuts"
        >
          <span>{{ $t("settings.shortcuts") }}</span>
          <v-icon right>fas fa-share-square</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.shortcuts = !block.shortcuts"
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.shortcuts ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.shortcuts" class="px-1 pt-1 pb-2">
          <shortcuts
            :bodyActiveColor="appSettings.bodyActiveColor"
            :bodyActiveColorDark="appSettings.bodyActiveColorDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- PERMISSIONS -->
    <v-card
      class="mt-2"
      id="block-permissions"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.permissions = !block.permissions"
        >
          <span>{{ $t("settings.permissions") }}</span>
          <v-icon right>fas fa-user-lock</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.permissions = !block.permissions"
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.permissions ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-if="block.permissions">
          <PermissionsTable
            :perms="permissions"
            :body-color="appSettings.bodyColor"
          />
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Shortcuts from "../components/partial/settings/Shortcuts";
import Accessibility from "../components/partial/settings/Accessibility";
import formSectionsMixin from "../mixins/formSectionsMixin";
import { mapState } from "vuex";
import Colors from "../components/partial/settings/Colors";
import PermissionsTable from "../components/partial/settings/PermissionsTable";

export default {
  name: "Settings",

  components: { PermissionsTable, Colors, Shortcuts, Accessibility },

  mixins: [formSectionsMixin],

  data() {
    return {
      block: {
        shortcuts: true,
        permissions: true,
        accessibility: true,
        colors: false
      }
    };
  },

  computed: {
    ...mapState(["permissions", "appSettings", "showRecentUrls"])
  }
};
</script>

<style scoped>
.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
