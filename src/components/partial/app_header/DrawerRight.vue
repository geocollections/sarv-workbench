<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    right
    @input="changeDrawerState"
    :dark="isDrawerDark"
    :color="drawerColor"
  >
    <v-list expand dense>
      <!-- SEARCH -->
      <v-list-group
        class="mb-1"
        :value="$route.meta.isTableView"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
        v-if="
          computedTableSearchParameters &&
            computedTableSearchParameters.filters &&
            computedTableSearchParameters.filters.length > 0
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
          <v-btn :color="drawerActiveColor" dark small @click="searchRecords">
            {{ $t("buttons.search") }}
          </v-btn>
        </v-list-item>

        <v-list-item
          class="d-flex flex-column justify-content-end"
          v-for="(field, index) in computedTableSearchParameters.filters"
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
                v-model="
                  computedTableSearchParameters.searchParameters[field.id]
                "
                :label="$t(field.title)"
                prepend-inner-icon="far fa-calendar-alt"
                :color="drawerActiveColor"
                clearable
                clear-icon="fas fa-times"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="computedTableSearchParameters.searchParameters[field.id]"
              @input="field.calendarStateDrawer = false"
              :color="drawerActiveColor"
              :header-color="drawerActiveColor"
              scrollable
            ></v-date-picker>
          </v-menu>

          <!-- REGULAR SEARCH FIELD -->
          <v-text-field
            v-else
            class="w-100"
            :label="$t(field.title)"
            v-model="computedTableSearchParameters.searchParameters[field.id]"
            :color="drawerActiveColor"
            :type="field.type"
            hide-details
          ></v-text-field>
        </v-list-item>

        <!-- CHECKBOXES START -->
        <!-- PHOTO_ARCHIVE -->
        <v-list-item class="mt-2" v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters
                .specimen_image_attachment
            "
            :label="$t('attachment.photoArchive')"
            value="2"
            class="mt-0 pr-6"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- SPECIMEN_IMAGE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters
                .specimen_image_attachment
            "
            :label="$t('attachment.specimenImage')"
            value="1"
            class="mt-0 pr-6"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- OTHER_FILE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters
                .specimen_image_attachment
            "
            :label="$t('attachment.otherFiles')"
            value="3"
            class="mt-0 pr-6"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- DIGITISED_REFERENCE -->
        <v-list-item v-if="$route.meta.object === 'attachment'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters
                .specimen_image_attachment
            "
            :label="$t('attachment.digitisedReference')"
            value="4"
            class="mt-0"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- IS_ESTONIAN_REFERENCE -->
        <v-list-item class="mt-2" v-if="$route.meta.object === 'reference'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters.isEstonianReference
            "
            :label="$t('reference.is_estonian_reference')"
            class="mt-0 pr-6"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>

        <!-- IS_ESTONIAN_AUTHOR -->
        <v-list-item v-if="$route.meta.object === 'reference'">
          <v-checkbox
            v-model="
              computedTableSearchParameters.searchParameters.isEstonianAuthor
            "
            :label="$t('reference.is_estonian_author')"
            class="mt-0"
            :color="drawerActiveColor"
            hide-details
          ></v-checkbox>
        </v-list-item>
        <!-- CHECKBOXES END -->
      </v-list-group>

      <!-- LIST OF OBJECTS -->
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
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
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                activeSearchParams.search && activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                activeSearchParams.search &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
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
          :color="drawerActiveColor"
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
        <v-list-item
          class="d-flex flex-row flex-nowrap justify-space-between"
          v-if="sidebarList.totalPages"
        >
          <div>
            <v-btn
              icon
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                sidebarList.totalPages &&
                  activeSearchParams.search &&
                  activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                sidebarList.totalPages &&
                  activeSearchParams.search &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
        </v-list-item>
      </v-list-group>

      <!-- SITES only for Project -->
      <v-list-item
        v-if="$route.meta.isEdit && $route.meta.table === 'project'"
        @click="setAction('add', 'Site')"
        dense
      >
        <v-list-item-title class="text-uppercase">
          {{ $t("header.addSite") }}
          <v-icon small>far fa-plus-square</v-icon>
        </v-list-item-title>
      </v-list-item>

      <!-- SAMPLES only for Site -->
      <v-list-item
        v-if="$route.meta.isEdit && $route.meta.table === 'site'"
        @click="setAction('add', 'Sample')"
        dense
      >
        <v-list-item-title class="text-uppercase">
          {{ $t("header.addSample") }}
          <v-icon small>far fa-plus-square</v-icon>
        </v-list-item-title>
      </v-list-item>

      <!-- LIBRARIES only for Reference -->
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
        v-if="
          $route.meta.isTableView &&
            $route.meta.object === 'reference' &&
            activeSearchParams &&
            activeSearchParams.search
        "
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("sidebar.library.active") }}
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
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                activeSearchParams.search && activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                activeSearchParams.search &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
        </v-list-item>

        <!-- LIST ITEMS -->
        <v-list-item
          v-for="entity in sidebarList.results"
          :key="entity.library"
          :color="drawerActiveColor"
          :title="
            activeLibrary && activeLibrary.library === entity.library
              ? $t('sidebar.library.inactiveTitle')
              : $t('sidebar.library.activeTitle')
          "
          dense
          @click="toggleActive(entity, 'setActiveLibrary')"
          :class="{
            'v-list-item--active':
              activeLibrary && activeLibrary.library === entity.library
          }"
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{ entity.library }}</span>
              <span> - {{ entity[activeSearchParams.field] }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- PAGINATION -->
        <v-list-item class="d-flex flex-row flex-nowrap justify-space-between">
          <div>
            <v-btn
              icon
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                activeSearchParams.search &&
                  sidebarList.totalPages &&
                  activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                sidebarList.totalPages &&
                  activeSearchParams.search &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
        </v-list-item>
      </v-list-group>

      <!-- SELECTION SERIES -->
      <v-list-group
        :value="true"
        :color="drawerActiveColor"
        append-icon="fas fa-angle-down"
        v-if="
          $route.meta.isTableView &&
            ($route.meta.object === 'specimen' ||
              $route.meta.object === 'sample' ||
              $route.meta.object === 'attachment' ||
              $route.meta.object === 'locality' ||
              $route.meta.object === 'taxon' ||
              $route.meta.object === 'analysis') &&
            activeSearchParams &&
            activeSearchParams.search
        "
      >
        <template v-slot:activator>
          <v-list-item-title class="text-uppercase">
            {{ $t("sidebar.selection_series.active") }}
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
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                activeSearchParams.search && activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                activeSearchParams.search &&
                  activeSearchParams.search.page < sidebarList.totalPages
              "
            >
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </div>
        </v-list-item>

        <!-- LIST ITEMS -->
        <v-list-item
          v-for="entity in sidebarList.results"
          :key="entity.id"
          :color="drawerActiveColor"
          :title="
            activeSelectionSeries && activeSelectionSeries.id === entity.id
              ? $t('sidebar.selection_series.inactiveTitle')
              : $t('sidebar.selection_series.activeTitle')
          "
          dense
          @click="toggleActive(entity, 'setActiveSelectionSeries')"
          :class="{
            'v-list-item--active':
              activeSelectionSeries && activeSelectionSeries.id === entity.id
          }"
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: unset">
              <span class="font-weight-bold">{{ entity.id }}</span>
              <span>
                -
                {{ entity[activeSearchParams.field] }}</span
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- PAGINATION -->
        <v-list-item class="d-flex flex-row flex-nowrap justify-space-between">
          <div>
            <v-btn
              icon
              :color="drawerActiveColor"
              @click="previousPage"
              v-if="
                activeSearchParams.search &&
                  sidebarList.totalPages &&
                  activeSearchParams.search.page > 1
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
              :color="drawerActiveColor"
              @click="nextPage"
              v-if="
                sidebarList.totalPages &&
                  activeSearchParams.search &&
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
import { mapActions, mapState } from "vuex";

export default {
  name: "DrawerRight",
  props: {
    drawerState: {
      required: true
    },
    isDrawerDark: {
      type: Boolean,
      required: false,
      default: false
    },
    drawerColor: {
      type: String,
      required: false,
      default: "white"
    },
    drawerActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },
  computed: {
    ...mapState("search", [
      "activeSearchParams",
      "sidebarList",
      "activeLibrary",
      "activeSelectionSeries",
      "tableSearchParameters"
    ]),

    computedTableSearchParameters() {
      return this.tableSearchParameters[this.$route.meta.object];
    }
  },
  created() {
    if (this?.activeSearchParams?.request) {
      this.$store.dispatch(`search/${this.activeSearchParams.request}`);
    }
  },
  watch: {
    "activeSearchParams.search.page"(newVal) {
      if (newVal && this?.activeSearchParams?.request) {
        this.$store.dispatch(`search/${this.activeSearchParams.request}`);
      }
    }
  },
  methods: {
    ...mapActions("search", [
      "activeSearchParamsNextPage",
      "activeSearchParamsPreviousPage",
      "setSidebarUserAction"
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

    setAction(action, choice) {
      this.setSidebarUserAction({
        userAction: { action: action, choice: choice }
      });
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
        this.$store.dispatch(activeObject, entity);
        if (activeObject === "setActiveLibrary") {
          this.toastInfo({
            text: `Library ${entity.library} is active!`,
            timeout: 1000
          });
        } else if (activeObject === "setActiveSelectionSeries") {
          this.toastInfo({
            text: `Selection series ${entity.id} is active!`,
            timeout: 1000
          });
        } else this.toastInfo({ text: "Object is active!", timeout: 1000 });
      } else {
        this.$store.dispatch(activeObject, null);
        if (activeObject === "setActiveLibrary") {
          this.toastInfo({
            text: `Library ${entity.library} is inactive!`,
            timeout: 1000
          });
        } else if (activeObject === "setActiveSelectionSeries") {
          this.toastInfo({
            text: `Selection series ${entity.id} is inactive!`,
            timeout: 1000
          });
        } else this.toastInfo({ text: "Object is inactive!", timeout: 1000 });
      }
    },

    searchRecords() {
      this.$localStorage.set(
        `${this.$route.meta.object}SearchHistory`,
        this.computedTableSearchParameters.searchParameters
      );
      this.$router.push({ path: "/" + this.$route.meta.object });
    }
  }
};
</script>

<style scoped></style>
