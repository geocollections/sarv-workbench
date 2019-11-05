<template>
  <v-card tile id="app-bar" class="d-print-none">
    <drawer-left
      :current-user="currentUser"
      :user-shortcuts="userShortcuts"
      :drawerState="drawer"
      :drawer-color="appSettings.drawerLeftColor"
      :is-drawer-dark="appSettings.drawerLeftDark"
      :drawer-active-color="appSettings.drawerLeftActiveColor"
      v-on:update:drawerState="drawer = $event"
    />

    <v-app-bar
      app
      clipped-left
      clipped-right
      fixed
      :color="appSettings.navbarColor"
      :dark="appSettings.navbarDark"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-items>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          exct
          :to="{ path: '/dashboard' }"
        >
          <v-icon>fas fa-home</v-icon>
        </v-btn>
        <v-btn text :to="{ path: '/dashboard' }" exact v-else>
          <span>{{ $t("header.title") }}</span>
          <span v-if="isBeta">-beta</span>
          <span v-else-if="isLocal">-development</span>
        </v-btn>
      </v-toolbar-items>

      <v-toolbar-items v-if="userShortcuts.length > 0">
        <v-btn
          text
          v-for="(entity, index) in userShortcuts"
          :class="{ 'd-none d-md-flex': !entity.isAlwaysVisible }"
          :key="index"
          :to="{ path: entity.path }"
          exact
          class="text-none"
        >
          {{ entity.title }}
        </v-btn>
      </v-toolbar-items>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <v-btn
          text
          @click="changeLang('ee')"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span>
        </v-btn>
        <v-btn
          text
          @click="changeLang('en')"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span>
        </v-btn>

        <v-menu v-model="showDropdown" offset-y z-index="50100">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              {{ currentUser.forename }}&nbsp;
              <v-icon>{{
                showDropdown ? "fas fa-caret-up" : "fas fa-caret-down"
              }}</v-icon>
            </v-btn>
          </template>

          <v-list
            :color="appSettings.navbarColor"
            :dark="appSettings.navbarDark"
            dense
            style="border-radius: 0;"
          >
            <v-list-item
              @click="changeLang('ee')"
              v-if="$vuetify.breakpoint.smAndDown"
            >
              <v-list-item-icon>
                <span class="flag flag-ee flag-circle"></span>
              </v-list-item-icon>
              <v-list-item-title>EST</v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="changeLang('en')"
              v-if="$vuetify.breakpoint.smAndDown"
            >
              <v-list-item-icon>
                <span class="flag flag-en flag-circle"></span>
              </v-list-item-icon>
              <v-list-item-title>ENG</v-list-item-title>
            </v-list-item>

            <v-list-item :to="{ path: '/settings' }">
              <v-list-item-icon><v-icon>fa fa-cog</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $t("header.settings") }}</v-list-item-title>
            </v-list-item>

            <v-list-item @click="logOut()">
              <v-list-item-icon
                ><v-icon>fas fa-sign-out-alt</v-icon></v-list-item-icon
              >
              <v-list-item-title>{{ $t("header.logOut") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-app-bar-nav-icon
        @click.stop="drawerRight = !drawerRight"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <drawer-right
      :drawerState="drawerRight"
      :drawer-color="appSettings.drawerRightColor"
      :is-drawer-dark="appSettings.drawerRightDark"
      :drawer-active-color="appSettings.drawerRightActiveColor"
      v-on:update:drawerState="drawerRight = $event"
    />
  </v-card>
</template>

<script>
import authenticationMixin from "../../../mixins/authenticationMixin";
import { mapState } from "vuex";
import DrawerLeft from "./DrawerLeft";
import DrawerRight from "./DrawerRight";
import { toastInfo } from "../../../assets/js/iziToast/iziToast";

export default {
  name: "AppBar",
  components: {
    DrawerLeft,
    DrawerRight
  },
  mixins: [authenticationMixin],
  data: () => ({
    drawer: null,
    drawerRight: false,
    showDropdown: false
  }),
  computed: {
    isBeta() {
      return document.location.origin.includes("edit2");
    },

    isLocal() {
      return document.location.origin.includes("localhost");
    },

    userShortcuts() {
      return this.$store.state["shortcuts"];
    },

    ...mapState(["currentUser", "appSettings"])
  },
  beforeCreate: function() {
    this.$store.dispatch("initialiseAppSettings");
    this.$store.dispatch("GET_SHORTCUTS");
  },
  watch: {
    drawer(newVal) {
      this.$store.dispatch("updateDrawerState", newVal);
    },
    drawerRight(newVal) {
      this.$store.dispatch("updateDrawerRightState", newVal);
    }
  },
  methods: {
    changeLang(lang) {
      if (this.$localStorage.get("geocollectionsFileUploadLang") === lang)
        return;
      this.$i18n.locale = lang;
      this.$localStorage.set("geocollectionsFileUploadLang", lang);
      toastInfo({ text: this.$t("messages.langChange") });
    }
  }
};
</script>

<style scoped>
#app-bar {
  z-index: 50000;
}
.v-menu__content {
  border-radius: 0 !important;
}
.flag {
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  /*line-height: 1em;*/
  line-height: 1.33333333em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.flag:before {
  content: "\A0";
}

.flag-ee {
  background-image: url("../../../assets/ee.svg");
}

.flag-en {
  background-image: url("../../../assets/en.svg");
}

.flag-squared {
  width: 1em;
  line-height: 1em;
}

.flag-circle {
  border-radius: 100%;
}
</style>
