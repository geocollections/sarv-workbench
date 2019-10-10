<template>
  <div class="dashboard">
    <app-header />

    <v-content>
      <v-container>
        <router-view />
      </v-container>
    </v-content>

    <app-footer />
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
  data() {
    return {
      sidebarState: true,
      buttonPressed: false,
      hideBackground: true,
      thumbstackState: false
    };
  },

  beforeCreate() {
    this.$store.dispatch("INITIALISE_ACTIVE_OBJECTS");
    this.$store.dispatch("INITIALISE_USER_DATA");
  }
};
</script>

<style scoped>
.dashboard {
  /*display: flex;*/
  /*min-height: 100vh;*/
  /*flex-direction: column;*/
}

.main {
  /*margin: 0 auto;*/
  /*flex: 1;*/
}

/* Custom override for xl screens */
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}
</style>
