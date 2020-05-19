<template>
  <v-card tile id="app-bar" class="d-print-none">
    <drawer-left
      :current-user="getCurrentUser"
      :user-shortcuts="shortcuts"
      :drawerState="drawer"
      :drawer-color="drawerLeftColor"
      :is-drawer-dark="drawerLeftDark"
      :drawer-active-color="drawerLeftActiveColor"
      v-on:update:drawerState="drawer = $event"
    />

    <v-app-bar
      app
      clipped-left
      clipped-right
      fixed
      :color="navbarColor"
      :dark="navbarDark"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-items>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          exact
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

      <v-toolbar-items v-if="shortcuts.length > 0">
        <v-btn
          text
          v-for="(entity, index) in shortcuts"
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
              {{ getCurrentUser.forename }}&nbsp;
              <v-icon>{{
                showDropdown ? "fas fa-caret-up" : "fas fa-caret-down"
              }}</v-icon>
            </v-btn>
          </template>

          <v-list
            :color="navbarColor"
            :dark="navbarDark"
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

        <v-btn icon to="/sarv_issue" :title="$t('sarv_issue.my_messages')">
          <v-icon>far fa-envelope</v-icon>
          <sup class="font-weight-bold" v-if="getActiveSarvIssuesCount() > 0">{{
            getActiveSarvIssuesCount()
          }}</sup>
        </v-btn>
      </v-toolbar-items>

      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
    </v-app-bar>

    <drawer-right
      :drawerState="drawerRight"
      :drawer-color="drawerRightColor"
      :is-drawer-dark="drawerRightDark"
      :drawer-active-color="drawerRightActiveColor"
      v-on:update:drawerState="drawerRight = $event"
    />
  </v-card>
</template>

<script>
import authenticationMixin from "../../../mixins/authenticationMixin";
import { mapActions, mapGetters, mapState } from "vuex";
import DrawerLeft from "./DrawerLeft";
import DrawerRight from "./DrawerRight";

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

    ...mapState("settings", [
      "drawerLeftColor",
      "drawerLeftDark",
      "drawerLeftActiveColor",
      "navbarColor",
      "navbarDark",
      "drawerRightColor",
      "drawerRightDark",
      "drawerRightActiveColor",
      "shortcuts",
      "lang"
    ]),
    ...mapGetters("user", ["getCurrentUser"])
  },
  watch: {
    drawer(newVal) {
      this.updateDrawerState(newVal);
    },
    drawerRight(newVal) {
      this.updateDrawerRightState(newVal);
    }
  },
  created() {
    this.fetchActiveSarvIssues();
  },
  methods: {
    ...mapActions("settings", [
      "updateDrawerState",
      "updateDrawerRightState",
      "updateLang"
    ]),
    ...mapGetters("search", ["getActiveSarvIssuesCount"]),

    ...mapActions("search", ["fetchActiveSarvIssues"]),

    changeLang(newLang) {
      if (this.lang === newLang) return;
      this.$i18n.locale = newLang;
      this.updateLang(newLang);
      this.toastInfo({ text: this.$t("messages.langChange") });
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
