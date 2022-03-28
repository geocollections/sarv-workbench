<template>
  <div class="bottom-options-new" :class="bodyColor.split('n-')[0] + 'n-5'">
    <div
      class="d-flex align-center justify-space-around"
      :class="{
        'drawer-left-margin': drawerState,
        'drawer-left-margin-0': !drawerState,
        'drawer-right-margin': drawerRightState,
        'drawer-right-margin-0': !drawerRightState,
      }"
    >
      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        :color="navbarColor"
        :dark="!previousId ? false : isNavbarDark"
        :disabled="!previousId"
        title="Go to previous record"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
        @click="previousPage"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >fas fa-angle-double-left</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >&nbsp;{{ $t("buttons.previous") }}</span
        >
      </v-btn>

      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        color="blue"
        dark
        :loading="loadingState"
        @click="handleClick('FINISH')"
        title="Finish record"
        v-if="$route.meta.object === 'site' && !$route.meta.isEdit"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >fas fa-check-double</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >&nbsp;{{ $t("edit.buttons.finish") }}</span
        >
      </v-btn>

      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        color="green"
        dark
        :loading="loadingState"
        @click="handleClick('SAVE_AND_LEAVE')"
        title="Save record and go back to list view"
        v-else
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >fas fa-door-open</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >&nbsp;{{ $t("edit.buttons.saveAndLeave") }}</span
        >
      </v-btn>

      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        color="green"
        dark
        :loading="loadingState"
        @click="handleClick('SAVE')"
        title="Save record"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >fas fa-save</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >&nbsp;{{ $t("edit.buttons.save") }}</span
        >
      </v-btn>

      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        color="red"
        dark
        :loading="loadingState"
        @click="
          $route.meta.isEdit ? handleClick('CANCEL') : handleClick('CLEAR')
        "
        :title="$route.meta.isEdit ? 'Go back to list view' : 'Clear fields'"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >fas fa-ban</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp">
          &nbsp;{{
            $route.meta.isEdit ? $t("buttons.cancel") : $t("buttons.clear")
          }}
        </span>
      </v-btn>

      <v-btn
        v-if="$route.meta.isEdit"
        :icon="$vuetify.breakpoint.smAndDown"
        color="orange"
        dark
        :loading="loadingState"
        @click="handleClick('SAVE_AS_NEW')"
        title="Save record as new"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
      >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :left="$vuetify.breakpoint.mdAndUp"
          >far fa-plus-square</v-icon
        >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >&nbsp;{{ $t("edit.buttons.saveAsNew") }}</span
        >
      </v-btn>

      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        :color="navbarColor"
        :dark="!nextId ? false : isNavbarDark"
        :disabled="!nextId"
        title="Go to next record"
        retain-focus-on-click
        :small="$vuetify.breakpoint.mdAndUp"
        class="text-none"
        @click="nextPage"
      >
        <span v-show="$vuetify.breakpoint.mdAndUp"
          >{{ $t("buttons.next") }}&nbsp;</span
        >
        <v-icon
          :small="$vuetify.breakpoint.mdAndUp"
          :right="$vuetify.breakpoint.mdAndUp"
          >fas fa-angle-double-right</v-icon
        >
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BottomOptions",
  props: {
    isNavbarDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    navbarColor: {
      type: String,
      required: false,
      default: "blue-grey",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    objectData: {
      type: Object,
    },
  },
  data() {
    return {
      listOfIDs: [],
      bottomNav: "recent",
    };
  },
  computed: {
    ...mapState("search", ["sidebarList", "loadingState"]),

    ...mapState("settings", ["drawerState", "drawerRightState"]),

    previousId() {
      return this?.objectData?.ids?.prev_id ?? null;
    },

    nextId() {
      return this?.objectData?.ids?.next_id ?? null;
    },
  },
  methods: {
    async handleClick(action) {
      await this.$parent.$emit("button-clicked", action);
    },

    nextPage() {
      this.$router.push({ path: `/${this.$route.meta.object}/${this.nextId}` });
    },

    previousPage() {
      this.$router.push({
        path: `/${this.$route.meta.object}/${this.previousId}`,
      });
    },
  },
};
</script>

<style scoped>
.bottom-options-new {
  background-color: #fff !important;
  color: #000;
  overflow: hidden;
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 0 4px 10px #000;
  z-index: 39000;
  height: 44px;
}

.bottom-options-new > div {
  height: 44px;
}

.drawer-right-margin-0 {
  margin-right: 0;
  transition: all 200ms ease-out;
}

@media (min-width: 1264px) {
  .drawer-right-margin {
    margin-right: 256px;
    transition: all 200ms ease;
  }
}

@media (min-width: 992px) {
  .drawer-left-margin {
    margin-left: 256px;
    transition: all 200ms ease;
  }

  .drawer-left-margin-0 {
    margin-left: 0;
    transition: all 200ms ease-out;
  }
}
</style>
