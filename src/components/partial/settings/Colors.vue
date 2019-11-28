<template>
  <div class="colors">
    <!-- BODY -->
    <v-row no-gutters>
      <v-col cols="12" class="px-1">
        <p class="font-weight-bold mb-0">Body</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.bodyColor"
          row
          hide-details
          class="mt-1 mx-3"
        >
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
        <p class="font-weight-bold mb-0">Body active color</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="settings.bodyActiveColorDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="settings.bodyActiveColorDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{ settings.bodyActiveColorDark ? "Dark" : "Light" }}</b>
              text
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.bodyActiveColor"
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
        <p class="font-weight-bold mb-0">Navbar</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="settings.navbarDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="settings.navbarDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{ settings.navbarDark ? "Dark" : "Light" }}</b>
              navbar
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.navbarColor"
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
        <p class="font-weight-bold mb-0">Drawer left</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="settings.drawerLeftDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="settings.drawerLeftDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{ settings.drawerLeftDark ? "Dark" : "Light" }}</b>
              drawer
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.drawerLeftColor"
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
        <p class="font-weight-bold mb-0">Drawer left active color</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.drawerLeftActiveColor"
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
        <p class="font-weight-bold mb-0">Drawer right</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-switch
          v-model="settings.drawerRightDark"
          class="mt-2 mx-3"
          hide-details
          inset
          :color="settings.drawerRightDark ? 'black' : 'white'"
        >
          <template v-slot:label>
            <span>
              <b>{{ settings.drawerRightDark ? "Dark" : "Light" }}</b>
              drawer
            </span>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.drawerRightColor"
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
        <p class="font-weight-bold mb-0">Drawer right active color</p>
      </v-col>

      <v-col cols="12" class="px-1">
        <v-radio-group
          v-model="settings.drawerRightActiveColor"
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
  </div>
</template>

<script>
export default {
  name: "Colors",
  data: () => ({
    settings: {
      bodyColor: "grey lighten-4",
      bodyDark: false,
      bodyActiveColor: "deep-orange",
      bodyActiveColorDark: true,
      navbarColor: "blue-grey",
      navbarDark: true,
      drawerLeftColor: "white",
      drawerLeftDark: false,
      drawerLeftActiveColor: "black",
      drawerRightColor: "white",
      drawerRightDark: false,
      drawerRightActiveColor: "deep-orange"
    },
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
      "white"
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
      "grey lighten-4"
    ]
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

  created() {
    let settings = this.$localStorage.get("SARV_APP_SETTINGS");
    if (
      settings &&
      Object.entries(settings).length > 0 &&
      settings.constructor === Object
    ) {
      this.settings = settings;
    }
  },

  watch: {
    settings: {
      handler(newVal) {
        this.$store.dispatch("updateSettings", newVal);
      },
      deep: true
    }
  }
};
</script>

<style scoped></style>
