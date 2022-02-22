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
            {{ $t("sidebar.currentSearch") }}
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

        <v-list-item
          v-for="(entity, key) in userLibraries.items"
          :key="key"
          :color="drawerActiveColor"
          :title="entity[userLibraries.mainField]"
          dense
          exact
          @click="handleToggleActive(entity)"
          :class="{
            'v-list-item--active':
              activeLibrary && activeLibrary.id === entity.id,
          }"
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

        <v-list-item
          v-for="(entity, key) in userSelectionSeries.items"
          :key="key"
          :color="drawerActiveColor"
          :title="entity[userSelectionSeries.mainField]"
          dense
          exact
          @click="handleToggleActive(entity)"
          :class="{
            'v-list-item--active':
              activeSelectionSeries && activeSelectionSeries.id === entity.id,
          }"
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
import toastMixin from "@/mixins/toastMixin";

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

  mixins: [toastMixin],

  data() {
    return {
      availableObjectsInSelectionSeries: [
        "specimen",
        "sample",
        "attachment",
        "locality",
        // "reference",
        "taxon",
        "analysis",
      ],
    };
  },

  // Fetching all available libraries and selections for user
  // after that if library or selection is active then fetch all the active records
  created() {
    this.getUserLibraries({ agent: this.getCurrentAgent });
    this.getUserSelectionSeries({ username: this.getUserName });

    if (this.$route.meta.object === "reference" && this.activeLibrary)
      this.getActiveList({
        table: "library_reference",
        connectionField: "library",
        id: this.activeLibrary.id,
        module: this.$route.meta.object,
      });
    else if (
      this.availableObjectsInSelectionSeries.includes(
        this.$route.meta.object
      ) &&
      this.activeSelectionSeries
    )
      this.getActiveList({
        table: "selection",
        connectionField: "selection",
        id: this.activeSelectionSeries.id,
        module: this.$route.meta.object,
      });
  },

  watch: {
    "$route.meta.object"(newVal) {
      if (newVal === "reference" && this.activeLibrary)
        this.getActiveList({
          table: "library_reference",
          connectionField: "library",
          id: this.activeLibrary.id,
          module: newVal,
        });
      else if (
        this.availableObjectsInSelectionSeries.includes(newVal) &&
        this.activeSelectionSeries
      )
        this.getActiveList({
          table: "selection",
          connectionField: "selection",
          id: this.activeSelectionSeries.id,
          module: this.$route.meta.object,
        });
    },
  },

  computed: {
    ...mapState({
      sidebarList(state) {
        return {
          count: state[this.$route.meta.object].count,
          items: state[this.$route.meta.object].items,
          mainField: state[this.$route.meta.object]?.mainField ?? "id",
        };
      },
    }),
    ...mapState("search", [
      "userLibraries",
      "userSelectionSeries",
      "activeLibrary",
      "activeSelectionSeries",
    ]),

    ...mapGetters("user", ["getCurrentAgent", "getUserName"]),

    isLibraryAvailable() {
      return (
        this.$route.meta.isTableView && this.$route.meta.object === "reference"
      );
    },

    isSelectionSeriesAvailable() {
      return (
        this.$route.meta.isTableView &&
        this.availableObjectsInSelectionSeries.includes(this.$route.meta.object)
      );
    },
  },

  methods: {
    ...mapActions("search", [
      "getUserLibraries",
      "getUserSelectionSeries",
      "toggleActive",
      "getActiveList",
    ]),

    changeDrawerState(drawerState) {
      this.$emit("update:drawerState", drawerState);
    },

    // Toggles active library / selection on and off, after each toggle active records are updated
    handleToggleActive(item) {
      const module = this.$route.meta.object;
      this.toggleActive({ module, active: item });

      if (module === "reference") {
        this.toastInfo({
          text: `Library ${item.id} is ${
            this.activeLibrary ? "active" : "inactive"
          }`,
          timeout: 1000,
        });
        if (this.activeLibrary)
          this.getActiveList({
            table: "library_reference",
            connectionField: "library",
            id: item.id,
            module,
          });
      } else {
        this.toastInfo({
          text: `Selection ${item.id} is ${
            this.activeSelectionSeries ? "active" : "inactive"
          }`,
          timeout: 1000,
        });

        if (this.activeSelectionSeries)
          this.getActiveList({
            table: "selection",
            connectionField: "selection",
            id: item.id,
            module,
          });
      }
    },
  },
};
</script>
