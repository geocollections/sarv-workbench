<template>
  <div class="edit-form">
    <div class="d-flex flex-wrap mt-2 mb-1 page-title justify-space-between">
      <div class="">
        <p class="h2 float-left mb-1 mr-2">
          {{ $t($route.meta.heading) }}: <b>{{ $route.params.id }}</b>
        </p>
      </div>
      <div class=" text-right">
        <v-btn
          :to="{ path: '/' + $route.meta.object }"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
        >
          {{ $t("buttons.listView") }}
        </v-btn>
      </div>
    </div>

    <object-does-not-exist v-if="!objectExists" />

    <scroll-to-links
      v-show="objectExists && $vuetify.breakpoint.xsOnly"
      v-if="$route.meta.object !== 'attachment'"
    />

    <router-view
      v-show="objectExists"
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
      :is-body-active-color-dark="appSettings.bodyActiveColorDark"
      v-on:data-loaded="setData"
      v-on:object-exists="toggleObjectState"
    />

    <object-permissions
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
    />

    <bottom-options
      :body-color="appSettings.bodyColor"
      :is-navbar-dark="appSettings.navbarDark"
      :navbar-color="appSettings.navbarColor"
    />

    <!-- LOGS -->
    <log
      v-if="typeof data === 'object' && data !== null && objectExists"
      :table="$route.meta.table"
      :object-data="data"
      :key="logComponentKey"
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
    />
  </div>
</template>

<script>
import BottomOptions from "../components/partial/BottomOptions";
import Log from "@/components/partial/Log.vue";
import ScrollToLinks from "../components/partial/ScrollToLinks";
import ObjectDoesNotExist from "../components/partial/errors/ObjectDoesNotExist";
import { mapState } from "vuex";
import ObjectPermissions from "../components/partial/ObjectPermissions";

export default {
  name: "EditForm",
  components: {
    ObjectPermissions,
    ObjectDoesNotExist,
    ScrollToLinks,
    BottomOptions,
    Log
  },
  data() {
    return {
      data: null,
      logComponentKey: 0,
      objectExists: true
    };
  },

  computed: {
    ...mapState(["appSettings"])
  },

  methods: {
    setData(data) {
      this.data = data;
      this.forceRerender();
    },

    forceRerender() {
      this.logComponentKey += 1;
    },

    toggleObjectState(state) {
      this.objectExists = state;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", null);
    next();
  }
};
</script>
<style scoped></style>
