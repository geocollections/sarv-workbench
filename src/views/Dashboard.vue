<template>
  <div class="dashboard">
    <app-header />

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>

      <app-footer />
    </v-content>
  </div>
</template>

<script>
import AppFooter from "@/components/partial/appFooter/AppFooter";
import AppHeader from "../components/partial/appHeader/AppHeader";

export default {
  components: {
    AppHeader,
    AppFooter
  },
  name: "Dashboard",
  metaInfo() {
    return {
      title: this.$t("titles.dashboard")
    };
  },

  beforeCreate() {
    this.$store.dispatch("INITIALISE_ACTIVE_OBJECTS");
    this.$store.dispatch("INITIALISE_USER_DATA");
  }
};
</script>

<style scoped>
main {
  min-height: 100vh;
}

.container {
  min-height: calc(100% - 82px);
}

/* TODO: BOOTSTRAP OVERRIDE, remove after integration */
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
