<template>
  <div
    :class="[
      'dashboard',
      appSettings.bodyDark ? 'white--text' : 'black--text',
      appSettings.bodyColor
    ]"
  >
    <app-header />

    <v-content>
      <v-container fluid>
        <breadcrumbs
          class="d-print-none"
          v-if="recentUrlsState"
          :items="recentUrls"
          :body-active-color="appSettings.bodyActiveColor"
        />

        <router-view />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AppHeader from "../components/partial/appHeader/AppHeader";
import { mapState } from "vuex";
import Breadcrumbs from "../components/partial/Breadcrumbs";

export default {
  components: {
    Breadcrumbs,
    AppHeader
  },
  name: "Dashboard",
  metaInfo() {
    return {
      title: this.$t("titles.dashboard")
    };
  },
  computed: {
    ...mapState(["appSettings", "recentUrls", "recentUrlsState"])
  },
  beforeCreate() {
    this.$store.dispatch("INITIALISE_ACTIVE_OBJECTS");
    this.$store.dispatch("INITIALISE_USER_DATA");
    this.$store.dispatch("initialiseRecentUrls");
    this.$store.dispatch("initialiseMapSettings");
    this.$store.dispatch("initialiseAppSettings");
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch("appendRecentUrls", {
      text: from.path,
      href: from.path
    });
    next();
  }
};
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.container {
  margin-bottom: 44px;
}

/* BOOTSTRAP OVERRIDE, remove after integration */
.container--fluid {
  max-width: 100%;
}

/* Custom override for xl screens */
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}
</style>
