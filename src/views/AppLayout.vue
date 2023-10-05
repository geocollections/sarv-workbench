<template>
  <div
    :class="['dashboard', bodyDark ? 'white--text' : 'black--text', bodyColor]"
  >
    <app-header />

    <v-main>
      <v-container fluid class="px-0 w-100">
        <GlobalAlertNotification class="d-print-none" />

        <breadcrumbs
          class="d-print-none px-2"
          v-if="recentUrlsState"
          :items="recentUrls"
          :body-active-color="bodyActiveColor"
        />

        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/partial/app_header/AppHeader";
import { mapActions, mapGetters, mapState } from "vuex";
import Breadcrumbs from "../components/partial/Breadcrumbs";
import GlobalAlertNotification from "@/components/partial/GlobalAlertNotification";

export default {
  components: {
    GlobalAlertNotification,
    Breadcrumbs,
    AppHeader,
  },
  name: "Dashboard",
  computed: {
    ...mapState("settings", [
      "bodyDark",
      "bodyColor",
      "bodyActiveColor",
      "recentUrls",
      "recentUrlsState",
    ]),
    ...mapGetters("tableHeaders", ["getListOfAllTables"]),
  },
  beforeRouteUpdate(to, from, next) {
    this.updateRecentUrls({
      text: from.path,
      href: from.path,
    });
    next();
  },
  created() {
    this.fetchActiveSarvIssues();
    this.fetchLastLoggedInDate();
    // Filling all dynamic fields
    this.getListOfAllTables().forEach((table) => this.getDynamicFields(table));
  },
  methods: {
    ...mapActions("settings", ["updateRecentUrls"]),
    ...mapActions("search", ["fetchActiveSarvIssues"]),
    ...mapActions("user", ["fetchLastLoggedInDate"]),
    ...mapActions("tableHeaders", ["getDynamicFields"]),
  },
};
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.container {
  margin-bottom: 44px;
}
</style>
