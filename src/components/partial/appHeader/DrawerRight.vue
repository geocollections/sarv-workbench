<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    color="blue-grey"
    dark
    right
    disable-resize-watcher
    @input="changeDrawerState"
  >
    <v-list dense>
      <v-list-group
        color="black"
        append-icon="fas fa-angle-down"
        v-if="
          $route.meta.isEdit &&
            activeSearchParams &&
            activeSearchParams.title &&
            sidebarList &&
            sidebarList.results &&
            sidebarList.results.length > 0
        "
      >
        <template v-slot:activator>
          <v-list-item-title
            v-text="$t(activeSearchParams.title)"
          ></v-list-item-title>
        </template>

        <v-list-item
          v-for="entity in sidebarList.results"
          :key="$route.meta.table !== 'library' ? entity.id : entity.library"
          :to="{ path: $route.meta.table !== 'library' ? `/${$route.meta.table}/${entity.id}` : `/${$route.meta.table}/${entity.library}` }"
          color="black"
          :title="entity[activeSearchParams.field]"
          dense
          exact
        >
          <v-list-item-content>
            <!-- Todo: Remove nowrap from both drawers -->
            <v-list-item-title>
              {{
              $route.meta.table !== "library"
              ? `${entity.id} - ${entity[activeSearchParams.field]}`
              : `${entity.library} - ${entity[activeSearchParams.field]}`
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "DrawerRight",
  props: {
    drawerState: {
      required: true
    }
  },
  computed: {
    activeSearchParams() {
      return this.$store.state["activeSearchParams"];
    },

    sidebarList() {
      return this.$store.state["sidebarList"];
    },

    activeLibrary() {
      if (this.$store.state["activeLibrary"] !== null)
        return this.$store.state["activeLibrary"];
      else return "";
    }
  },
  created() {
    if (this.$store.state["activeSearchParams"] !== null) {
      this.$store.dispatch(this.$store.state["activeSearchParams"].request);
    }
  },
  watch: {
    "activeSearchParams.search.page": {
      handler: function(newVal) {
        if (
          newVal &&
          this.activeSearchParams &&
          this.activeSearchParams.request
        ) {
          this.$store.dispatch(this.activeSearchParams.request);
        }
      },
      deep: true
    }
  },
  methods: {
    changeDrawerState(drawerState) {
      this.$emit("update:drawerState", drawerState);
    },

    nextPage() {
      this.$store.state.activeSearchParams.search.page += 1;
    },

    previousPage() {
      this.$store.state.activeSearchParams.search.page -= 1;
    },

    setAction(action, choice) {
      this.$store.dispatch("SIDEBAR_USER_ACTION", {
        userAction: { action: action, choice: choice }
      });
    },

    makeActive(library) {
      if (this.activeLibrary.id === library.id) {
        this.$store.dispatch("ACTIVE_LIBRARY", null);
      } else {
        this.$store.dispatch("ACTIVE_LIBRARY", library);
      }
    }
  }
};
</script>

<style scoped></style>
