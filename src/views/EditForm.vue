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

    <scroll-to-links
      v-show="objectExists && $vuetify.breakpoint.xsOnly"
      v-if="object !== 'attachment'"
    />

    <router-view
      v-show="objectExists"
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
      :is-body-active-color-dark="appSettings.bodyActiveColorDark"
      v-on:data-loaded="setData"
      v-on:set-object="setObject"
      v-on:related-data-info="setRelatedData"
      v-on:object-exists="toggleObjectState"
    />

    <object-does-not-exist v-if="!objectExists" />

    <bottom-options
      :body-color="appSettings.bodyColor"
      :is-navbar-dark="appSettings.navbarDark"
      :navbar-color="appSettings.navbarColor"
      :object="object"
    />

    <!-- LOGS -->
    <log
      v-if="data && objectExists"
      :table="$route.meta.table"
      :data="data"
      :formatted-data="formattedData"
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

export default {
  name: "EditForm",
  components: {
    ObjectDoesNotExist,
    ScrollToLinks,
    BottomOptions,
    Log
  },
  data() {
    return {
      data: null,
      agent: null,
      object: null,
      relatedData: [],
      formattedData: null,
      isConfirmation: false,
      logComponentKey: 0,
      objectExists: true
    };
  },

  metaInfo() {
    return {
      title: this.$t(this.$route.meta.title) + " " + this.$route.params.id
    };
  },

  computed: {
    ...mapState(["appSettings"])
  },

  methods: {
    setData(data) {
      this.data = data;
      if (this.data !== null) this.formattedData = data;
      this.forceRerender();
    },
    setObject(object) {
      this.object = object;
    },

    setRelatedData(data) {
      this.relatedData = data;
    },

    toggleObjectState(state) {
      this.objectExists = state;
    },

    forceRerender() {
      this.logComponentKey += 1;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", null);
    next();
  }
};
</script>
<style scoped></style>
