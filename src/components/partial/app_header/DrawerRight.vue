<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    right
    @input="changeDrawerState"
    :dark="isDrawerDark"
    :color="drawerColor"
    disable-resize-watcher
    style="z-index: 1100"
  >
    <!-- CURRENT SEARCH (shown on detail views) -->
    <v-list expand dense>
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
        v-if="$route.meta.isEdit && sidebarList.items.length > 0"
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("sidebar.current_search") }}
            <v-icon small>far fa-list-alt</v-icon>
          </v-list-item-title>
        </template>

        <v-list-item
          v-for="(entity, key) in sidebarList.items"
          :key="key"
          :to="{
            path: `/${$route.meta.object}/${entity.id}`,
          }"
          :color="drawerActiveColor"
          :title="entity[sidebarList.mainField]"
          dense
          exact
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{ entity.id }}</span>
              <span> - {{ entity[sidebarList.mainField] }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <!-- LIBRARIES -->
    <v-list v-if="isLibraryAvailable && userLibraries.count > 0" expand dense>
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("sidebar.library.active") }}
            <v-icon small>far fa-list-alt</v-icon>
          </v-list-item-title>
        </template>

        <!-- LIST ITEMS -->
        <v-list-item
          v-for="(entity, key) in userLibraries.items"
          :key="key"
          :color="drawerActiveColor"
          :title="entity[userLibraries.mainField]"
          dense
          exact
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{ entity.id }}</span>
              <span> - {{ entity[userLibraries.mainField] }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <!-- SELECTION SERIES -->
    <v-list
      v-if="isSelectionSeriesAvailable && userSelectionSeries.count > 0"
      expand
      dense
    >
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("sidebar.selection_series.active") }}
            <v-icon small>far fa-list-alt</v-icon>
          </v-list-item-title>
        </template>

        <!-- LIST ITEMS -->
        <v-list-item
          v-for="(entity, key) in userSelectionSeries.items"
          :key="key"
          :color="drawerActiveColor"
          :title="entity[userSelectionSeries.mainField]"
          dense
          exact
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{ entity.id }}</span>
              <span> - {{ entity[userSelectionSeries.mainField] }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import searchParametersMixin from "../../../mixins/searchParametersMixin";
import toastMixin from "../../../mixins/toastMixin";

export default {
  name: "DrawerRight",

  props: {
    drawerState: {
      required: true,
    },
    isDrawerDark: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawerColor: {
      type: String,
      required: false,
      default: "white",
    },
    drawerActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [searchParametersMixin, toastMixin],

  data: () => ({
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"],
  }),

  created() {
    if (this.userLibraries.count === 0)
      this.getUserLibraries({ agent: this.getCurrentAgent });
    if (this.userSelectionSeries.count === 0)
      this.getUserSelectionSeries({ username: this.getUserName });
  },

  computed: {
    ...mapState({
      sidebarList(state) {
        return {
          count: state[this.$route.meta.object].count,
          items: state[this.$route.meta.object].items,
          mainField: state[this.$route.meta.object].mainField,
        };
      },
    }),
    ...mapState("search", ["userLibraries", "userSelectionSeries"]),

    ...mapState("search", {
      searchParameters: function (state) {
        return state[`${this.$route.meta.object}SearchParameters`];
      },
    }),

    ...mapGetters("user", ["getCurrentAgent", "getUserName"]),

    isLibraryAvailable() {
      return (
        this.$route.meta.isTableView && this.$route.meta.object === "reference"
      );
    },

    isSelectionSeriesAvailable() {
      const AVAILABLE_OBJECTS_IN_SELECTION_SERIES = [
        "specimen",
        "sample",
        "attachment",
        "locality",
        // "reference",
        "taxon",
        "analysis",
      ];
      return (
        this.$route.meta.isTableView &&
        AVAILABLE_OBJECTS_IN_SELECTION_SERIES.includes(this.$route.meta.object)
      );
    },
  },

  methods: {
    ...mapActions("search", [
      "activeSearchParamsNextPage",
      "activeSearchParamsPreviousPage",
      "setSidebarUserAction",
      "getActiveSelectionSeriesList",
      "getActiveLibraryList",
      "resetActiveSelectionSeriesList",
      "resetActiveLibraryList",
      "getUserLibraries",
      "getUserSelectionSeries",
    ]),

    changeDrawerState(drawerState) {
      this.$emit("update:drawerState", drawerState);
    },

    nextPage() {
      this.activeSearchParamsNextPage();
    },

    previousPage() {
      this.activeSearchParamsPreviousPage();
    },

    toggleActive(entity, activeObject) {
      let makeActive = true;

      if (
        activeObject === "setActiveLibrary" &&
        this.activeLibrary &&
        this.activeLibrary.id === entity.id
      ) {
        makeActive = false;
      } else if (
        activeObject === "setActiveSelectionSeries" &&
        this.activeSelectionSeries &&
        this.activeSelectionSeries.id === entity.id
      ) {
        makeActive = false;
      }

      if (makeActive) {
        this.$store.dispatch(`search/${activeObject}`, entity);
        if (activeObject === "setActiveLibrary") {
          this.getActiveLibraryList({ libraryId: entity.id });
          this.toastInfo({
            text: `Library ${entity.id} is active!`,
            timeout: 1000,
          });
        } else if (activeObject === "setActiveSelectionSeries") {
          this.getActiveSelectionSeriesList({
            routeObject: this.$route.meta.object,
            selectionSeriesId: entity.id,
          });
          this.toastInfo({
            text: `Selection series ${entity.id} is active!`,
            timeout: 1000,
          });
        } else this.toastInfo({ text: "Object is active!", timeout: 1000 });
      } else {
        this.$store.dispatch(`search/${activeObject}`, null);
        if (activeObject === "setActiveLibrary") {
          this.resetActiveLibraryList();
          this.toastInfo({
            text: `Library ${entity.id} is inactive!`,
            timeout: 1000,
          });
        } else if (activeObject === "setActiveSelectionSeries") {
          this.resetActiveSelectionSeriesList();
          this.toastInfo({
            text: `Selection series ${entity.id} is inactive!`,
            timeout: 1000,
          });
        } else this.toastInfo({ text: "Object is inactive!", timeout: 1000 });
      }
    },

    searchRecords() {
      this.$router.push({ path: "/" + this.$route.meta.object });
    },
  },
};
</script>

<style scoped>
/* Have to use class instead of prop */
.replaces-inactive-prop {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Have to use class instead of prop */
.replaces-inactive-prop:before {
  opacity: 0;
}
</style>
