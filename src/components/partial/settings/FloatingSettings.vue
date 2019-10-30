<template>
  <v-menu
    max-width="304px"
    min-width="304px"
    max-height="50vh"
    v-model="showSettings"
    offset-x
    left
    nudge-top="15"
    nudge-left="15"
    z-index="50000"
    :close-on-click="false"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        fixed
        top
        right
        direction="left"
        style="top: 96px"
        fab
        color="red darken-2"
        dark
      >
        <v-icon v-if="showSettings">fas fa-times</v-icon>
        <v-icon v-else>fas fa-cog</v-icon>
      </v-btn>
    </template>

    <v-card>
      <!-- NAVBAR -->
      <v-row>
        <v-col>
          <v-card flat tile color="red lighten-4">
            <v-card-title class="font-weight-bold py-2" style="font-size: 1rem;">
              <span>NAVBAR</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showNavbarSettings = !showNavbarSettings"
                color="black"
              >
                <v-icon>{{
                  showNavbarSettings ? "fas fa-angle-up" : "fas fa-angle-down"
                }}</v-icon>
              </v-btn>
            </v-card-title>

            <transition
              enter-active-class="animated fadeInLeft faster"
              leave-active-class="animated fadeOutRight faster"
            >
              <div v-show="showNavbarSettings">
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

                <v-radio-group
                  v-model="settings.navbarColor"
                  row
                  hide-details
                  class="mt-1 mx-3"
                >
                  <v-radio
                    v-for="entity in colors"
                    :key="entity.name"
                    :value="entity"
                    :color="entity.name"
                    :off-icon="`far fa-circle ${entity.name}--text`"
                    on-icon="fas fa-circle"
                    class="mx-1 my-2"
                  ></v-radio>
                </v-radio-group>
              </div>
            </transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- NAVBAR -->
      <v-row>
        <v-col>
          <v-card flat tile color="red lighten-4">
            <v-card-title class="font-weight-bold py-2" style="font-size: 1rem;">
              <span>NAVBAR</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showNavbarSettings = !showNavbarSettings"
                color="black"
              >
                <v-icon>{{
                  showNavbarSettings ? "fas fa-angle-up" : "fas fa-angle-down"
                  }}</v-icon>
              </v-btn>
            </v-card-title>

            <transition
              enter-active-class="animated fadeInLeft faster"
              leave-active-class="animated fadeOutRight faster"
            >
              <div v-show="showNavbarSettings">
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

                <v-radio-group
                  v-model="settings.navbarColor"
                  row
                  hide-details
                  class="mt-1 mx-3"
                >
                  <v-radio
                    v-for="entity in colors"
                    :key="entity.name"
                    :value="entity"
                    :color="entity.name"
                    :off-icon="`far fa-circle ${entity.name}--text`"
                    on-icon="fas fa-circle"
                    class="mx-1 my-2"
                  ></v-radio>
                </v-radio-group>
              </div>
            </transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- NAVBAR -->
      <v-row>
        <v-col>
          <v-card flat tile color="red lighten-4">
            <v-card-title class="font-weight-bold py-2" style="font-size: 1rem;">
              <span>NAVBAR</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showNavbarSettings = !showNavbarSettings"
                color="black"
              >
                <v-icon>{{
                  showNavbarSettings ? "fas fa-angle-up" : "fas fa-angle-down"
                  }}</v-icon>
              </v-btn>
            </v-card-title>

            <transition
              enter-active-class="animated fadeInLeft faster"
              leave-active-class="animated fadeOutRight faster"
            >
              <div v-show="showNavbarSettings">
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

                <v-radio-group
                  v-model="settings.navbarColor"
                  row
                  hide-details
                  class="mt-1 mx-3"
                >
                  <v-radio
                    v-for="entity in colors"
                    :key="entity.name"
                    :value="entity"
                    :color="entity.name"
                    :off-icon="`far fa-circle ${entity.name}--text`"
                    on-icon="fas fa-circle"
                    class="mx-1 my-2"
                  ></v-radio>
                </v-radio-group>
              </div>
            </transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- NAVBAR -->
      <v-row>
        <v-col>
          <v-card flat tile color="red lighten-4">
            <v-card-title class="font-weight-bold py-2" style="font-size: 1rem;">
              <span>NAVBAR</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showNavbarSettings = !showNavbarSettings"
                color="black"
              >
                <v-icon>{{
                  showNavbarSettings ? "fas fa-angle-up" : "fas fa-angle-down"
                  }}</v-icon>
              </v-btn>
            </v-card-title>

            <transition
              enter-active-class="animated fadeInLeft faster"
              leave-active-class="animated fadeOutRight faster"
            >
              <div v-show="showNavbarSettings">
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

                <v-radio-group
                  v-model="settings.navbarColor"
                  row
                  hide-details
                  class="mt-1 mx-3"
                >
                  <v-radio
                    v-for="entity in colors"
                    :key="entity.name"
                    :value="entity"
                    :color="entity.name"
                    :off-icon="`far fa-circle ${entity.name}--text`"
                    on-icon="fas fa-circle"
                    class="mx-1 my-2"
                  ></v-radio>
                </v-radio-group>
              </div>
            </transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- SIDEBAR RIGHT -->
      <v-row>
        <v-col>
          <v-card flat tile color="red lighten-4">
            <v-card-title class="font-weight-bold py-2" style="font-size: 1rem;">
              <span>SIDEBAR RIGHT</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showSidebarRightSettings = !showSidebarRightSettings"
                color="black"
              >
                <v-icon>{{
                  showSidebarRightSettings
                    ? "fas fa-angle-up"
                    : "fas fa-angle-down"
                }}</v-icon>
              </v-btn>
            </v-card-title>

            <transition
              enter-active-class="animated fadeInLeft faster"
              leave-active-class="animated fadeOutRight faster"
            >
              <div v-show="showSidebarRightSettings">
                <v-switch
                  v-model="settings.navbarDark"
                  class="mt-2 mx-3"
                  hide-details
                  inset
                  :color="settings.sidebarRightDark ? 'black' : 'white'"
                >
                  <template v-slot:label>
                    <span>
                      <b>{{ settings.sidebarRightDark ? "Dark" : "Light" }}</b>
                      sidebar
                    </span>
                  </template>
                </v-switch>

                <v-radio-group
                  v-model="settings.sidebarRightColor"
                  row
                  hide-details
                  class="mt-1 mx-3"
                >
                  <v-radio
                    v-for="entity in colors"
                    :key="entity.name"
                    :value="entity"
                    :color="entity.name"
                    :off-icon="`far fa-circle ${entity.name}--text`"
                    on-icon="fas fa-circle"
                    class="mx-1 my-2"
                  ></v-radio>
                </v-radio-group>
              </div>
            </transition>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "FloatingSettings",
  data: () => ({
    showSettings: false,
    showNavbarSettings: true,
    showSidebarRightSettings: false,
    settings: {
      navbarColor: "blue-grey",
      navbarDark: true,
      sidebarRightColor: "white",
      sidebarRightDark: false
    },
    colors: [
      { name: "red", hex: "#F44336" },
      { name: "pink", hex: "#E91E63" },
      { name: "purple", hex: "#9C27B0" },
      { name: "deep-purple", hex: "#673AB7" },
      { name: "indigo", hex: "#3F51B5" },
      { name: "blue", hex: "#2196F3" },
      { name: "light-blue", hex: "#03A9F4" },
      { name: "cyan", hex: "#00BCD4" },
      { name: "teal", hex: "#009688" },
      { name: "green", hex: "#4CAF50" },
      { name: "light-green", hex: "#8BC34A" },
      { name: "lime", hex: "#CDDC39" },
      { name: "yellow", hex: "#FFEB3B" },
      { name: "amber", hex: "#FFC107" },
      { name: "orange", hex: "#FF9800" },
      { name: "deep-orange", hex: "#FF5722" },
      { name: "brown", hex: "#795548" },
      { name: "blue-grey", hex: "#607D8B" },
      { name: "grey", hex: "#9E9E9E" },
      { name: "black", hex: "#000000" },
      { name: "white", hex: "#FFFFFF" }
    ]
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
        this.$localStorage.set("SARV_APP_SETTINGS", newVal);
        this.$store.dispatch("updateSettings", newVal);
      },
      deep: true
    }
  }
};
</script>

<style>
.green-button {
  color: green !important;
}

.blue-grey-button {
  color: lightslategrey !important;
}

.red-button {
  color: red !important;
}
</style>
