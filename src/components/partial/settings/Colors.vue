<template>
  <div class="colors">
    <!-- BODY -->
    <v-row no-gutters>
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">{{ $t("settings.body") }}</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group v-model="myBodyColor" row hide-details class="mt-1 mx-3">
          <v-radio
            v-for="(entity, index) in colorsLight"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- BODY ACTIVE COLOR -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">{{ $t("settings.bodyActive") }}</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="myBodyActiveColorDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="myBodyActiveColorDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{
                myBodyActiveColorDark
                  ? $t("settings.dark")
                  : $t("settings.light")
              }}</b>
              {{ $t("settings.text") }}
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myBodyActiveColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- NAVBAR -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">{{ $t("settings.navbar") }}</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="myNavbarDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="myNavbarDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{
                myNavbarDark ? $t("settings.dark") : $t("settings.light")
              }}</b>
              {{ $t("settings.navbarText") }}
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myNavbarColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- DRAWER LEFT -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">{{ $t("settings.drawerLeft") }}</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="myDrawerLeftDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="myDrawerLeftDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{
                myDrawerLeftDark ? $t("settings.dark") : $t("settings.light")
              }}</b>
              {{ $t("settings.drawer") }}
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myDrawerLeftColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- DRAWER LEFT ACTIVE COLOR -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">
          {{ $t("settings.drawerLeftActive") }}
        </p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myDrawerLeftActiveColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- DRAWER RIGHT -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">{{ $t("settings.drawerRight") }}</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="myDrawerRightDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="myDrawerRightDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{
                myDrawerRightDark ? $t("settings.dark") : $t("settings.light")
              }}</b>
              {{ $t("settings.drawer") }}
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myDrawerRightColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- DRAWER RIGHT ACTIVE COLOR -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">
          {{ $t("settings.drawerRightActive") }}
        </p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="myDrawerRightActiveColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
          <v-radio
            v-for="(entity, index) in colors"
            :key="index"
            :value="entity"
            :color="entity.split(' ')[0]"
            :off-icon="`far fa-circle ${entity.split(' ')[0]}--text`"
            on-icon="fas fa-circle"
            class="mx-1 my-2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider class="ma-1"></v-divider>
    <v-row no-gutters>
      <v-col>
        <v-btn
          class="ma-1"
          :color="myBodyActiveColor"
          :dark="bodyActiveColorDark"
          v-on:click="resetColors"
        >
          Reset colors
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Colors",
  data: () => ({
    colors: [
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
      "grey",
      "black",
      "white",
    ],
    colorsLight: [
      "red lighten-4",
      "pink lighten-4",
      "purple lighten-4",
      "deep-purple lighten-4",
      "indigo lighten-4",
      "blue lighten-4",
      "light-blue lighten-4",
      "cyan lighten-4",
      "teal lighten-4",
      "green lighten-4",
      "light-green lighten-4",
      "lime lighten-4",
      "yellow lighten-4",
      "amber lighten-4",
      "orange lighten-4",
      "deep-orange lighten-4",
      "brown lighten-4",
      "blue-grey lighten-4",
      "grey lighten-4",
    ],
    // { name: "red", hex: "#F44336" },
    // { name: "pink", hex: "#E91E63" },
    // { name: "purple", hex: "#9C27B0" },
    // { name: "deep-purple", hex: "#673AB7" },
    // { name: "indigo", hex: "#3F51B5" },
    // { name: "blue", hex: "#2196F3" },
    // { name: "light-blue", hex: "#03A9F4" },
    // { name: "cyan", hex: "#00BCD4" },
    // { name: "teal", hex: "#009688" },
    // { name: "green", hex: "#4CAF50" },
    // { name: "light-green", hex: "#8BC34A" },
    // { name: "lime", hex: "#CDDC39" },
    // { name: "yellow", hex: "#FFEB3B" },
    // { name: "amber", hex: "#FFC107" },
    // { name: "orange", hex: "#FF9800" },
    // { name: "deep-orange", hex: "#FF5722" },
    // { name: "brown", hex: "#795548" },
    // { name: "blue-grey", hex: "#607D8B" },
    // { name: "grey", hex: "#9E9E9E" },
    // { name: "black", hex: "#000000" },
    // { name: "white", hex: "#FFFFFF" }
  }),
  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyDark",
      "bodyActiveColor",
      "bodyActiveColorDark",
      "navbarColor",
      "navbarDark",
      "drawerLeftColor",
      "drawerLeftDark",
      "drawerLeftActiveColor",
      "drawerRightColor",
      "drawerRightDark",
      "drawerRightActiveColor",
    ]),

    myBodyColor: {
      get() {
        return this.bodyColor;
      },

      set(value) {
        this.updateBodyColor(value);
      },
    },

    myBodyDark: {
      get() {
        return this.bodyDark;
      },

      set(value) {
        this.updateBodyDark(value);
      },
    },

    myBodyActiveColor: {
      get() {
        return this.bodyActiveColor;
      },

      set(value) {
        this.updateBodyActiveColor(value);
      },
    },

    myBodyActiveColorDark: {
      get() {
        return this.bodyActiveColorDark;
      },

      set(value) {
        this.updateBodyActiveColorDark(value);
      },
    },

    myNavbarColor: {
      get() {
        return this.navbarColor;
      },

      set(value) {
        this.updateNavbarColor(value);
      },
    },

    myNavbarDark: {
      get() {
        return this.navbarDark;
      },

      set(value) {
        this.updateNavbarDark(value);
      },
    },

    myDrawerLeftColor: {
      get() {
        return this.drawerLeftColor;
      },

      set(value) {
        this.updateDrawerLeftColor(value);
      },
    },

    myDrawerLeftDark: {
      get() {
        return this.drawerLeftDark;
      },

      set(value) {
        this.updateDrawerLeftDark(value);
      },
    },

    myDrawerLeftActiveColor: {
      get() {
        return this.drawerLeftActiveColor;
      },

      set(value) {
        this.updateDrawerLeftActiveColor(value);
      },
    },

    myDrawerRightColor: {
      get() {
        return this.drawerRightColor;
      },

      set(value) {
        this.updateDrawerRightColor(value);
      },
    },

    myDrawerRightDark: {
      get() {
        return this.drawerRightDark;
      },

      set(value) {
        this.updateDrawerRightDark(value);
      },
    },

    myDrawerRightActiveColor: {
      get() {
        return this.drawerRightActiveColor;
      },

      set(value) {
        this.updateDrawerLeftRightColor(value);
      },
    },
  },

  methods: {
    ...mapActions("settings", [
      "updateBodyColor",
      "updateBodyDark",
      "updateBodyActiveColor",
      "updateBodyActiveColorDark",
      "updateNavbarColor",
      "updateNavbarDark",
      "updateDrawerLeftColor",
      "updateDrawerLeftDark",
      "updateDrawerLeftActiveColor",
      "updateDrawerRightColor",
      "updateDrawerRightDark",
      "updateDrawerLeftRightColor",
      "resetColors",
    ]),
  },
};
</script>

<style scoped></style>
