<template>
  <div class="edit-form">
    <v-divider />

    <div>
      HAS CHANGED:
      <b>
        {{ initialEditViewDataHasChangedState }}
      </b>
    </div>

    <br />

    <div>
      DATA
    </div>

    <br />

    <div>
      {{ data }}
    </div>

    <br />

    <div>
      INITIAL DATA
    </div>

    <br />

    <div>
      {{ initialData }}
    </div>
    <v-divider />

    <div class="d-flex flex-wrap mt-2 mb-1 page-title justify-space-between">
      <div class="">
        <p class="h2 float-left mb-1 mr-2">
          {{ $t($route.meta.heading) }}: <b>{{ $route.params.id }}</b>
        </p>
      </div>
      <div class=" text-right">
        <v-btn
          :to="{ path: '/' + $route.meta.object }"
          :color="bodyActiveColor"
          :dark="bodyActiveColorDark"
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

    <SpinnerWrapper />

    <router-view
      v-show="objectExists"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
      :is-body-active-color-dark="bodyActiveColorDark"
      v-on:data-loaded="setData"
      v-on:object-exists="toggleObjectState"
    />

    <!-- PERMISSIONS -->
    <object-permissions
      v-if="
        typeof data === 'object' &&
          data !== null &&
          objectExists &&
          enablePermissions
      "
      :table="$route.meta.table"
      :object-data="data"
      :key="permissionsComponentKey"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
    />

    <!-- LOGS -->
    <log
      v-if="typeof data === 'object' && data !== null && objectExists"
      :table="$route.meta.table"
      :object-data="data"
      :key="logComponentKey"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
    />

    <bottom-options
      :body-color="bodyColor"
      :is-navbar-dark="navbarDark"
      :navbar-color="navbarColor"
    />
  </div>
</template>

<script>
import BottomOptions from "../components/partial/BottomOptions";
import Log from "@/components/partial/Log.vue";
import ScrollToLinks from "../components/partial/ScrollToLinks";
import ObjectDoesNotExist from "../components/partial/errors/ObjectDoesNotExist";
import { mapActions, mapState } from "vuex";
import ObjectPermissions from "../components/partial/ObjectPermissions";
import SpinnerWrapper from "../components/partial/SpinnerWrapper";
import { cloneDeep } from "lodash";

export default {
  name: "EditForm",
  components: {
    SpinnerWrapper,
    ObjectPermissions,
    ObjectDoesNotExist,
    ScrollToLinks,
    BottomOptions,
    Log
  },
  data() {
    return {
      initialData: null,
      data: null,
      logComponentKey: 0,
      permissionsComponentKey: 2,
      objectExists: true
    };
  },

  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyActiveColor",
      "bodyActiveColorDark",
      "navbarDark",
      "navbarColor"
    ]),

    ...mapState("detail", ["initialEditViewDataHasChangedState"]),

    // Todo: In the future perms should be available on every view
    enablePermissions() {
      let table = this.$route.meta.table;
      let availableTables = [
        "sample",
        "analysis",
        "project",
        "site",
        "drillcore",
        "drillcore_box",
        "dataset",
        "sample_series"
        // "attachment",
        // "collection",
        // "specimen",
        // "doi",
        // "selection"
      ];

      return availableTables.includes(table);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.initialEditViewDataHasChangedState) {
      // Todo: Ask "Yes, leave" / "Continue editing" / "Save the record".

      const answer = window.confirm(
        'Are you sure you want to leave without saving the edits?" / "Kas olete kindel, et soovite lahkuda ilma muudatusi salvestamata'
      );
      if (answer) next();
      else next(false);
    } else next();
  },
  beforeRouteLeave(to, from, next) {
    if (this.initialEditViewDataHasChangedState) {
      // Todo: Ask "Yes, leave" / "Continue editing" / "Save the record".
      const answer = window.confirm(
        'Are you sure you want to leave without saving the edits?" / "Kas olete kindel, et soovite lahkuda ilma muudatusi salvestamata'
      );
      if (answer) next();
      else next(false);
    } else next();
  },

  watch: {
    data: {
      handler(newVal) {
        this.updateInitialEditViewDataHasChangedState({
          initialData: this.initialData,
          currentData: newVal
        });
      },
      deep: true
    },

    "$route.params.id"(newVal) {
      // Todo fix data change issue on next and previous buttons
      console.log(newVal);
      console.log(this.data)
      this.initialData = cloneDeep(this.data);
    }
  },

  methods: {
    ...mapActions("detail", ["updateInitialEditViewDataHasChangedState"]),

    setData(data) {
      if (this.data === null) this.initialData = cloneDeep(data);
      this.data = data;
      this.forceRerender();
    },

    forceRerender() {
      this.logComponentKey += 1;
      this.permissionsComponentKey += 2;
    },

    toggleObjectState(state) {
      this.objectExists = state;
    }
  }
};
</script>
<style scoped></style>
