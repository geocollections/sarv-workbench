<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    right
    disable-resize-watcher
    @input="changeDrawerState"
  >
    <v-list expand dense>
      <!-- SEARCH -->
      <v-list-group
        class="mb-1"
        :value="$route.meta.isTableView"
        color="black"
        append-icon="fas fa-angle-down"
        v-if="
          tableSearchParameters &&
            tableSearchParameters.filters &&
            tableSearchParameters.filters.length > 0
        "
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("edit.search") }}
            <v-icon small>fas fa-search</v-icon>
          </v-list-item-title>
        </template>

        <!-- SEARCH BUTTON -->
        <v-list-item v-if="$route.meta.isEdit" class="justify-center">
          <v-btn color="deep-orange" dark small @click="searchRecords">
            {{ $t("buttons.search") }}
          </v-btn>
        </v-list-item>

        <v-list-item
          class="d-flex flex-column justify-content-end"
          v-for="(field, index) in tableSearchParameters.filters"
          :key="index"
        >
          <!-- DATEPICKER -->
          <v-menu
            z-index="50050"
            v-if="field.isDate"
            v-model="field.calendarStateDrawer"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                hide-details
                v-model="tableSearchParameters.searchParameters[field.id]"
                :label="$t(field.title)"
                prepend-inner-icon="far fa-calendar-alt"
                color="deep-orange"
                clearable
                clear-icon="fas fa-times"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="tableSearchParameters.searchParameters[field.id]"
              @input="field.calendarStateDrawer = false"
              color="deep-orange"
              header-color="blue"
              scrollable
            ></v-date-picker>
          </v-menu>

          <!-- REGULAR SEARCH FIELD -->
          <v-text-field
            v-else
            class="w-100"
            :label="$t(field.title)"
            v-model="tableSearchParameters.searchParameters[field.id]"
            color="deep-orange"
            :type="field.type"
            hide-details
          ></v-text-field>
        </v-list-item>

        <!-- CHECKBOXES START -->
        <!-- PHOTO_ARCHIVE -->
        <v-list-item class="mt-2" v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              tableSearchParameters.searchParameters.specimen_image_attachment
            "
            :label="$t('attachment.photoArchive')"
            value="2"
            class="mt-0 pr-6"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- SPECIMEN_IMAGE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              tableSearchParameters.searchParameters.specimen_image_attachment
            "
            :label="$t('attachment.specimenImage')"
            value="1"
            class="mt-0 pr-6"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- OTHER_FILE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              tableSearchParameters.searchParameters.specimen_image_attachment
            "
            :label="$t('attachment.otherFiles')"
            value="3"
            class="mt-0 pr-6"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- DIGITISED_REFERENCE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              tableSearchParameters.searchParameters.specimen_image_attachment
            "
            :label="$t('attachment.digitisedReference')"
            value="4"
            class="mt-0"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- IS_ESTONIAN_REFERENCE -->
        <v-list-item class="mt-2" v-if="$route.meta.object === 'reference'">
          <v-checkbox
            v-model="tableSearchParameters.searchParameters.isEstonianReference"
            :label="$t('reference.is_estonian_reference')"
            class="mt-0 pr-6"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- IS_ESTONIAN_AUTHOR -->
        <v-list-item v-if="$route.meta.object === 'reference'">
          <v-checkbox
            v-model="tableSearchParameters.searchParameters.isEstonianAuthor"
            :label="$t('reference.is_estonian_author')"
            class="mt-0"
            color="deep-orange"
            hide-details
          ></v-checkbox>
        </v-list-item>
        <!-- CHECKBOXES END -->
      </v-list-group>

      <!-- LIST OF OBJECTS -->
      <v-list-group
        :value="true"
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
          <v-list-item-title class="text-uppercase">
            {{ $t(activeSearchParams.title) }}
            <v-icon small>far fa-list-alt</v-icon>
          </v-list-item-title>
        </template>

        <!-- PAGINATION -->
        <v-list-item
          class="d-flex flex-row flex-nowrap justify-space-between"
          v-if="sidebarList.totalPages"
        >
          <div>
            <v-btn
              icon
              color="deep-orange"
              @click="previousPage"
              v-if="activeSearchParams.search.page > 1"
            >
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
          </div>

          <div class="align-self-center">
            {{ sidebarList.page }}
          </div>

          <div>
            <v-btn
              icon
              color="deep-orange"
              @click="nextPage"
              v-if="activeSearchParams.search.page < sidebarList.totalPages"
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
        </v-list-item>

        <!-- LIST ITEMS -->
        <v-list-item
          v-for="entity in sidebarList.results"
          :key="$route.meta.table !== 'library' ? entity.id : entity.library"
          :to="{
            path:
              $route.meta.table !== 'library'
                ? `/${$route.meta.table}/${entity.id}`
                : `/${$route.meta.table}/${entity.library}`
          }"
          color="deep-orange"
          :title="entity[activeSearchParams.field]"
          dense
          exact
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{
                $route.meta.table !== "library" ? entity.id : entity.library
              }}</span>
              <span> - {{ entity[activeSearchParams.field] }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- PAGINATION -->
        <v-list-item class="d-flex flex-row flex-nowrap justify-space-between">
          <div>
            <v-btn
              icon
              color="deep-orange"
              @click="previousPage"
              v-if="
                sidebarList.totalPages && activeSearchParams.search.page > 1
              "
            >
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
          </div>

          <div class="align-self-center">
            {{ sidebarList.page }}
          </div>

          <div>
            <v-btn
              icon
              color="deep-orange"
              @click="nextPage"
              v-if="
                sidebarList.totalPages &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
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

    tableSearchParameters() {
      return this.$store.state["tableSearchParameters"][
        this.$route.meta.object
      ];
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

    if (this.$route.meta.isEdit) {
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
    },

    searchRecords() {
      this.$localStorage.set(
        `${this.$route.meta.object}SearchHistory`,
        this.tableSearchParameters.searchParameters
      );
      this.$router.push({ path: "/" + this.$route.meta.object });
    }
  }
};
</script>

<style scoped></style>
