<template>
  <div class="edit-form">
    <div class="d-flex flex-wrap mt-2 mb-1 page-title justify-space-between">
      <div class="table-title float-left mb-1 mr-2 d-print-none">
        <span>
          {{ $t($route.meta.heading) }} ID: <b>{{ $route.params.id }}</b>
        </span>

        <span v-if="data && data.egf">
          <v-btn
            style="margin-top: -4px"
            class="ml-1"
            icon
            :href="`https://fond.egt.ee/fond/egf/${data.egf}`"
            :title="`https://fond.egt.ee/fond/egf/${data.egf}`"
            :color="bodyActiveColor"
            target="FondWindow"
          >
            <v-icon>fas fa-link</v-icon>
          </v-btn>
        </span>
      </div>

      <div class="flex-grow-1"></div>

      <div class="mr-2 d-print-none">
        <v-btn
          :to="{ path: `/${$route.meta.object}/add` }"
          :color="bodyActiveColor"
          :dark="bodyActiveColorDark"
        >
          {{ $t("buttons.add_new") }}
        </v-btn>
      </div>

      <div class="text-right d-print-none">
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
      class="d-print-none"
      :table="$route.meta.table"
      :object-data="data"
      :key="permissionsComponentKey"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
    />

    <!-- LOGS -->
    <log
      v-if="typeof data === 'object' && data !== null && objectExists"
      class="d-print-none"
      :table="$route.meta.table"
      :object-data="data"
      :key="logComponentKey"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
    />

    <bottom-options
      class="d-print-none"
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
    Log,
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
      reject: null,
    };
  },

  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyActiveColor",
      "bodyActiveColorDark",
      "navbarDark",
      "navbarColor",
    ]),

    ...mapState("detail", ["initialEditViewDataHasChangedState"]),

    enablePermissions() {
      let table = this.$route.meta.table;
      let availableTables = [
        "analysis",
        "attachment",
        "sample",
        "specimen",
        "sample_series",
        "project",
        "site",
        "drillcore",
        "drillcore_box",
        "dataset",
        "collection",
        "location",
        "selection_series",
        "library",
        "doi",
        "selection",
      ];

      return availableTables.includes(table);
    },
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
          currentData: newVal,
        });
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions("detail", ["updateInitialEditViewDataHasChangedState"]),

    openConfirmationDialog() {
      this.confirmationDialog = true;
      return new Promise((resolve) => {
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
    },
  },
};
</script>
<style scoped>
.table-title {
  font-size: 2rem;
  font-weight: 600;
}
</style>
