<template>
  <div class="list-module-core">
    <ScrollToTop
      class="d-print-none"
      v-if="$route.meta.isTableView"
      :body-active-color="bodyActiveColor"
    />

    <!-- EXPORT and OPTIONS -->
    <v-row align="center" justify="start" class="px-4 mt-4 mb-1 d-print-none">
      <!-- EXPORT -->
      <div class="mr-4 mb-2" v-if="exportButtons">
        <export-buttons
          :filename="module"
          :table-data="response.results"
          :body-active-color="bodyActiveColor"
        />
      </div>

      <!-- OPTIONS -->
      <div v-if="useListView || useImageView" class="mb-2">
        <v-radio-group
          class="radio-buttons mt-0"
          :value="$_tableViewMixin_viewType"
          @change="$_tableViewMixin_updateViewType({ value: $event })"
          row
          hide-details
        >
          <v-radio
            value="table"
            class="mb-2"
            :label="$t('references.tableView')"
            :color="bodyActiveColor"
          />
          <v-radio
            v-if="useListView"
            class="mb-2"
            value="list"
            :label="
              module === 'sample' ||
              module === 'specimen' ||
              module === 'location'
                ? $t('references.labelView')
                : $t('references.listView')
            "
            :color="bodyActiveColor"
          />
          <v-radio
            v-if="useImageView"
            class="mb-2"
            value="image"
            :label="$t('buttons.imageView')"
            :color="bodyActiveColor"
          />
        </v-radio-group>
      </div>
    </v-row>

    <pagination
      class="pb-2"
      :body-active-color="bodyActiveColor"
      :count="response.count"
      :paginate-by="$_tableViewMixin_options.paginateBy"
      :options="paginateByOptionsTranslated"
      :page="$_tableViewMixin_options.page"
      v-on:update:page="
        $_tableViewMixin_updateOptions({ value: $event, key: 'page' })
      "
      v-on:update:paginateBy="
        $_tableViewMixin_updateOptions({ value: $event, key: 'paginateBy' })
      "
    />

    <!-- DATA TABLE -->
    <v-card
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-3'"
      class="table-card my-1"
      :loading="isLoading"
    >
      <template v-slot:progress>
        <v-progress-linear
          indeterminate
          :color="bodyColor.split('n-')[0] + 'n-1'"
        ></v-progress-linear>
      </template>

      <v-card-title class="d-print-none">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("main.found") }}</span>
          <span class="font-weight-bold">{{ ` ${response.count} ` }}</span>
          <span>{{ $t("main.records") }}</span>
        </span>
        <div class="flex-grow-1"></div>
      </v-card-title>

      <!-- LIST VIEW -->
      <list-view
        v-if="isListView && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
      />

      <!-- IMAGE VIEW -->
      <image-view
        v-if="isImageView && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
      />

      <router-view
        ref="table"
        :response="response"
        :filter="filterTable"
        :search-parameters="$_tableViewMixin_options"
        v-if="isTableView && response.count > 0"
        v-on:toggle-privacy-state="changeObjectsPrivacyState"
        v-on:toggle-reference-in-active-library="toggleReferenceInActiveLibrary"
        v-on:toggle-item-in-selection-series="toggleItemInSelectionSeries"
        v-on:toggle-select-all="toggleSelectAll"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
        v-on:update:sorting="
          $_tableViewMixin_updateOptions({
            value: $event.value,
            key: $event.key,
          })
        "
      />
    </v-card>

    <pagination
      class="pt-2 pt-md-0 pb-0 pb-md-5"
      :body-active-color="bodyActiveColor"
      :count="response.count"
      :paginate-by="$_tableViewMixin_options.paginateBy"
      :options="paginateByOptionsTranslated"
      :page="$_tableViewMixin_options.page"
      v-on:update:page="
        $_tableViewMixin_updateOptions({ value: $event, key: 'page' })
      "
      v-on:update:paginateBy="
        $_tableViewMixin_updateOptions({ value: $event, key: 'paginateBy' })
      "
    />
  </div>
</template>

<script>
import ExportButtons from "./partial/export/ExportButtons";
import ListView from "./partial/ListView";
import debounce from "lodash/debounce";
import ImageView from "./partial/ImageView";
import { mapActions, mapState } from "vuex";
import ScrollToTop from "./partial/ScrollToTop";
import toastMixin from "../mixins/toastMixin";
import activeListMixin from "../mixins/activeListMixin";
import Pagination from "@/components/partial/Pagination";
import { fetchChangeRecordState } from "@/assets/js/api/apiCalls";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    Pagination,
    ScrollToTop,
    ExportButtons,
    ListView,
    ImageView,
  },
  props: {
    apiCall: {
      type: Function,
      required: true,
    },
    module: {
      type: String,
      default: null,
    },
    exportButtons: {
      type: Boolean,
      default: true,
    },
    useListView: {
      type: Boolean,
      default: false,
    },
    useImageView: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [toastMixin, activeListMixin, tableViewMixin],
  name: "ListModuleCore",
  data() {
    return {
      filterTable: "",
      noResults: null,
      isLoading: false,
      response: {
        count: 0,
        results: [],
      },
    };
  },

  computed: {
    ...mapState("search", ["paginateByOptions"]),
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },

    isTableView() {
      return this.$_tableViewMixin_viewType === "table";
    },

    isImageView() {
      return this.$_tableViewMixin_viewType === "image";
    },

    isListView() {
      return this.$_tableViewMixin_viewType === "list";
    },
  },
  watch: {
    $_tableViewMixin_options: {
      handler() {
        this.search();
      },
      immediate: true,
      deep: true,
    },
    $_tableViewMixin_searchFields: {
      handler() {
        this.search();
      },
      deep: true,
    },
    currentViewType(newVal, oldVal) {
      // Because specimen image and table use different search url
      if (
        (this.module === "specimen" || this.module === "location") &&
        newVal === "image"
      ) {
        this.response = { count: 0, results: [] };
        this.$emit("search:images", true);
      } else if (
        (this.module === "specimen" || this.module === "location") &&
        oldVal === "image"
      ) {
        this.response = { count: 0, results: [] };
        this.$emit("search:images", false);
      } else if (this.module === "drillcore_box") {
        if (oldVal === "table") this.$emit("search:images", false);
        else this.$emit("search:images", true);
      }
    },
  },

  methods: {
    ...mapActions("search", ["setSidebarList"]),

    search: debounce(async function () {
      this.isLoading = true;

      const response = await this.apiCall();
      console.log(response);

      this.isLoading = false;

      this.noResults = response?.count === 0;

      if (response?.status === 200) {
        // Todo: Old rwapi (should be replaced)
        if (response?.data?.count === 0) this.noResults = true;
        if (response?.data?.count > 0) this.noResults = false;
        this.response.count = response.data.count ?? 0;
        this.response.results = response.data.results ?? [];
      } else {
        // Todo: New rwapi, this should be the only one (for now)
        this.response.count = response?.count ?? 0;
        this.response.results = response?.results ?? [];
        this.noResults = this.response.count === 0;

        this.setSidebarList({
          module: this.module,
          response,
          page: this.$_tableViewMixin_options.page,
          paginateBy: this.$_tableViewMixin_options.paginateBy,
        });
      }
    }, 500),

    changeObjectsPrivacyState(state, id) {
      let formData = new FormData();
      formData.set("is_private", state);

      this.$api.rw.put(this.module, id, formData);
    },
  },
};
</script>
<style scoped>
.radio-buttons >>> .form-group {
  margin-bottom: unset;
}

.radio-buttons >>> .v-label {
  margin-bottom: 0;
}
</style>
