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

    <ConfirmationDialog
      :dialog="confirmationDialog"
      :body-color="bodyColor"
      v-on:action:dialog="actionConfirmationDialog"
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
import ConfirmationDialog from "../components/partial/ConfirmationDialog";

export default {
  name: "EditForm",
  components: {
    ConfirmationDialog,
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
      objectExists: true,
      confirmationDialog: false,
      resolve: null,
      reject: null
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
        "sample_series",
        "location",
        "attachment"
        // "collection",
        // "specimen",
        // "doi",
        // "selection"
      ];

      return availableTables.includes(table);
    }
  },

  async beforeRouteUpdate(to, from, next) {
    if (this.initialEditViewDataHasChangedState) {
      const dialogResponse = await this.openConfirmationDialog();

      if (dialogResponse === "close") next();
      else if (dialogResponse === "continue") next(false);
      else if (dialogResponse === "save") {
        await this.$emit("button-clicked", "SAVE", this.$route.meta.object);
        next();
      } else next();
    } else next();
  },

  async beforeRouteLeave(to, from, next) {
    if (this.initialEditViewDataHasChangedState) {
      const dialogResponse = await this.openConfirmationDialog();

      if (dialogResponse === "close") next();
      else if (dialogResponse === "continue") next(false);
      else if (dialogResponse === "save") {
        await this.$emit(
          "button-clicked",
          "SAVE_AND_LEAVE",
          this.$route.meta.object
        );
        next();
      } else next();
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
    }
  },

  methods: {
    ...mapActions("detail", ["updateInitialEditViewDataHasChangedState"]),

    openConfirmationDialog() {
      this.confirmationDialog = true;
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },

    actionConfirmationDialog(action) {
      this.confirmationDialog = false;
      this.resolve(action);
    },

    setData(data) {
      this.data = data;
      if (this.data === null || this.data?.id !== this.initialData?.id)
        this.initialData = cloneDeep(data);
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
