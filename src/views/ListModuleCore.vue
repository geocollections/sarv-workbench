<template>
  <div class="list-module-core mt-2">
    <ScrollToTop
      class="d-print-none"
      v-if="$route.meta.isTableView"
      :body-active-color="bodyActiveColor"
    />

    <!-- DATA TABLE -->
    <v-row no-gutters align="center" justify="start" class="d-print-none">
      <span id="table-title" class="mr-2" style="font-size: 1.25rem">
        <span>{{ $t("main.found") }}</span>
        <span class="font-weight-bold">{{ ` ${response.count} ` }}</span>
        <span>{{ $t("main.records") }}</span>
      </span>
    </v-row>
    <v-card
      :color="bodyColor.split('n-')[0] + 'n-5'"
      class="table-card my-1"
      :loading="isLoading"
    >
      <template v-slot:progress>
        <v-progress-linear
          indeterminate
          :color="bodyColor.split('n-')[0] + 'n-1'"
        ></v-progress-linear>
      </template>
      <v-card-title class="d-print-none py-0 pr-0">
        <v-btn-toggle
          v-if="useListView || useImageView"
          class="mr-2"
          v-model="currentViewType"
          :color="bodyActiveColor"
          dense
        >
          <v-btn value="table" :title="$t('references.tableView')">
            <v-icon>fas fa-list</v-icon>
          </v-btn>
          <v-btn
            v-if="useListView"
            :title="
              module === 'sample' ||
              module === 'specimen' ||
              module === 'location'
                ? $t('references.labelView')
                : $t('references.listView')
            "
            value="list"
          >
            <v-icon>fas fa-tag</v-icon>
          </v-btn>
          <v-btn
            v-if="useImageView"
            :title="$t('buttons.imageView')"
            value="image"
          >
            <v-icon>fas fa-image</v-icon>
          </v-btn>
        </v-btn-toggle>
        <data-table-headers-menu
          :headers="$_tableHeaderMixin_allHeaders"
          :visible-headers="$_tableHeaderMixin_shownHeaders"
          @change="
            $_tableHeaderMixin_updateTableHeaders({
              event: $event,
              table: $route.meta.object,
            })
          "
          @reset="$_tableHeaderMixin_setDefaultTableHeaders($route.meta.object)"
        />
        <export-buttons
          v-if="exportButtons"
          :filename="module"
          :table-data="response.results"
          :body-active-color="bodyActiveColor"
        />
        <data-table-pagination
          class="ml-auto"
          :count="response.count"
          :paginate-by="searchParameters.paginateBy"
          :page="searchParameters.page"
          :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
          v-on:update:page="$emit('update:searchParameters', $event, 'page')"
          v-on:update:paginateBy="
            $emit('update:searchParameters', $event, 'paginateBy')
          "
        />
      </v-card-title>

      <!-- LIST VIEW -->
      <list-view
        v-if="isCurrentViewTypeList && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
      />

      <!-- IMAGE VIEW -->
      <image-view
        v-if="isCurrentViewTypeImage && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
      />

      <router-view
        ref="table"
        :response="response"
        :filter="filterTable"
        :search-parameters="searchParameters"
        v-if="isCurrentViewTypeTable && response.count > 0"
        v-on:toggle-privacy-state="changeObjectsPrivacyState"
        v-on:toggle-reference-in-active-library="toggleReferenceInActiveLibrary"
        v-on:toggle-item-in-selection-series="toggleItemInSelectionSeries"
        v-on:toggle-select-all="toggleSelectAll"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
        v-on:update:sorting="
          $emit('update:searchParameters', $event.value, $event.key)
        "
      />
      <div class="text-right d-print-none">
        <data-table-pagination
          class="ml-auto"
          :count="response.count"
          :paginate-by="searchParameters.paginateBy"
          :page="searchParameters.page"
          :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
          v-on:update:page="$emit('update:searchParameters', $event, 'page')"
          v-on:update:paginateBy="
            $emit('update:searchParameters', $event, 'paginateBy')
          "
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/partial/export/ExportButtons";
import ListView from "../components/partial/ListView";
import debounce from "lodash/debounce";
import ImageView from "../components/partial/ImageView";
import { mapActions, mapState } from "vuex";
import ScrollToTop from "../components/partial/ScrollToTop";
import toastMixin from "../mixins/toastMixin";
import activeListMixin from "../mixins/activeListMixin";
import DataTablePagination from "@/components/partial/DataTablePagination";
import DataTableHeadersMenu from "@/components/partial/DataTableHeadersMenu";
import { fetchChangeRecordState } from "@/assets/js/api/apiCalls";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ScrollToTop,
    ExportButtons,
    ListView,
    ImageView,
    DataTablePagination,
    DataTableHeadersMenu,
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
    searchParameters: {
      type: Object,
    },
    dynamicSearchFields: {
      type: Array,
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
  mixins: [toastMixin, activeListMixin, tableHeaderMixin],
  name: "ListModuleCore",
  data() {
    return {
      paginateByOptions: [
        { text: "main.pagination", value: 10 },
        { text: "main.pagination", value: 25 },
        { text: "main.pagination", value: 50 },
        { text: "main.pagination", value: 100 },
        { text: "main.pagination", value: 250 },
        { text: "main.pagination", value: 500 },
        { text: "main.pagination", value: 1000 },
      ],
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
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),

    currentViewType: {
      get() {
        return this.$store.state.search[`${this.module}ViewType`];
      },

      set(value) {
        this.updateViewType({ module: this.module, type: value });
      },
    },

    isCurrentViewTypeTable() {
      return this.currentViewType === "table";
    },

    isCurrentViewTypeImage() {
      return this.currentViewType === "image";
    },

    isCurrentViewTypeList() {
      return this.currentViewType === "list";
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },
  watch: {
    searchParameters: {
      handler() {
        this.search();
      },
      immediate: true,
      deep: true,
    },
    dynamicSearchFields: {
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
    ...mapActions("search", ["updateViewType"]),

    search: debounce(async function () {
      this.isLoading = true;

      const response = await this.apiCall();

      this.isLoading = false;

      if (response?.status === 200) {
        if (response?.data?.count === 0) this.noResults = true;
        if (response?.data?.count > 0) this.noResults = false;
        this.response.count = response.data.count ?? 0;
        this.response.results = response.data.results ?? [];
      }
    }, 500),

    changeObjectsPrivacyState(state, id) {
      let formData = new FormData();
      formData.append("data", JSON.stringify({ is_private: state }));

      // const response = await fetchChangeRecordState(this.module, id, formData);
      //
      // if (response?.data) {
      //   if (response?.data?.message)
      //     this.toastSuccess({
      //       text: `${response?.data?.message}${
      //         this.$i18n.locale === "ee" ? "_et" : ""
      //       }`
      //     });
      //   else if (response?.data?.error)
      //     this.toastSuccess({
      //       text: `${response?.data?.error}${
      //         this.$i18n.locale === "ee" ? "_et" : ""
      //       }`
      //     });
      // } else
      //   this.toastError({
      //     text: response?.data?.error ?? this.$t("messages.uploadError")
      //   });

      fetchChangeRecordState(this.module, id, formData).then(
        (response) => {
          if (response && response.data) {
            if (this.$i18n.locale === "ee") {
              if (response.data.message_et)
                this.toastSuccess({ text: response.data.message_et });
              else if (response.data.error_et)
                this.toastError({ text: response.data.error_et });
            } else {
              if (response.data.message)
                this.toastSuccess({ text: response.data.message });
              else if (response.data.error)
                this.toastError({ text: response.data.error });
            }
          }
        },
        (errResponse) => {
          if (errResponse && errResponse.data && errResponse.data.error)
            this.toastError({ text: errResponse.data.error });
          this.toastError({ text: this.$t("messages.uploadError") });
        }
      );
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
