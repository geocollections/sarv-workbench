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
        <router-view />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AppHeader from "../components/partial/appHeader/AppHeader";
import { mapState } from "vuex";

export default {
  components: {
    AppHeader
  },
  name: "Dashboard",
  metaInfo() {
    return {
      title: this.$t("titles.dashboard")
    };
  },
  computed: {
    ...mapState(["appSettings"])
  },
  beforeCreate() {
    this.$store.dispatch("INITIALISE_ACTIVE_OBJECTS");
    this.$store.dispatch("INITIALISE_USER_DATA");
  }
};
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.container {
  margin-bottom: 56px;
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
