<template>
  <div>
    <div
      class="px-2 py-1 d-sm-flex align-center"
      style="
        border-bottom: 1px solid lightgray;
        border-top: 1px solid lightgray;
      "
    >
      <div class="d-flex align-center">
        <filter-menu
          ref="filterMenu"
          :filters="filters"
          :filter-map="filterMap"
          :total-active-filters="activeFilters.length"
          :total-results="count"
        />
        <v-menu offset-y bottom :close-on-content-click="false">
          <template #activator="{ on, attrs }">
            <v-btn
              :tile="$vuetify.breakpoint.mdAndDown"
              :icon="$vuetify.breakpoint.mdAndDown"
              class="mx-2 text-capitalize"
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                :left="!$vuetify.breakpoint.mdAndDown"
                color="grey darken-3"
              >
                fas fa-file-export
              </v-icon>
              <span v-show="!$vuetify.breakpoint.mdAndDown">
                {{ $t("dataTable.export") }}
              </span>
            </v-btn>
          </template>
          <v-card class="pa-2">
            <v-btn-toggle mandatory dense v-model="exportOptions.format">
              <v-btn value="json">JSON</v-btn>
              <v-btn value="xlsx">XLSX</v-btn>
              <v-btn value="csv">CSV</v-btn>
              <v-btn value="ris">RIS</v-btn>
            </v-btn-toggle>
            <v-divider class="my-2" />
            <v-text-field
              v-model="exportOptions.filename"
              outlined
              dense
              :suffix="`.${exportOptions.format}`"
              label="Filename"
            ></v-text-field>
            <v-text-field
              v-model="exportOptions.count"
              outlined
              dense
              type="number"
              :min="1"
              :max="count"
              label="Rows to export"
            ></v-text-field>
            <v-btn outlined color="deep-orange" @click="handleExport">
              Export
            </v-btn>
          </v-card>
        </v-menu>
        <v-divider vertical class="mr-2" />
        <v-btn-toggle
          class="mr-2"
          borderless
          color="deep-orange"
          background-color="transparent"
          mandatory
          dense
          v-model="view"
        >
          <v-btn value="table">
            <v-icon :color="view === 'table' ? 'deep-orange' : 'grey darken-3'">
              fas fa-table
            </v-icon>
          </v-btn>
          <v-btn value="bibliography">
            <v-icon
              :color="view === 'bibliography' ? 'deep-orange' : 'grey darken-3'"
              small
              >fas fa-book-open</v-icon
            >
          </v-btn>
        </v-btn-toggle>
        <v-divider vertical class="mr-2" />
        <data-table-headers-menu
          v-if="view === 'table'"
          :headers="headers"
          :visible-headers="visibleHeaders"
          @change="handleHeaderChange"
          @reset="handleHeadersReset"
        >
          <template #activator="menu">
            <v-btn
              class="text-capitalize mr-2"
              text
              :tile="$vuetify.breakpoint.mdAndDown"
              :icon="$vuetify.breakpoint.mdAndDown"
              v-bind="{ ...menu.attrs }"
              v-on="{ ...menu.on }"
            >
              <v-icon
                color="grey darken-3"
                :left="!$vuetify.breakpoint.mdAndDown"
              >
                fas fa-table-columns
              </v-icon>
              <span v-show="!$vuetify.breakpoint.mdAndDown">
                {{ $t("dataTable.columns") }}
              </span>
            </v-btn>
          </template>
        </data-table-headers-menu>
        <v-select
          v-if="view === 'bibliography'"
          class="mr-2"
          style="max-width: 12em"
          dense
          outlined
          hide-details
          label="Style"
          v-model="citationStyle"
          :menu-props="{ bottom: true, offsetY: true }"
          :items="citationStyles"
        />
      </div>
      <div
        class="d-flex flex-column align-center mt-2 mt-sm-0 flex-sm-row align-sm-center text-sm-left ml-sm-auto"
      >
        <i18n
          :path="
            count === 1 ? 'dataTable.foundSingle' : 'dataTable.foundPlural'
          "
          class="body-2 text--secondary mr-sm-3"
        >
          <template #count>
            <span class="font-weight-bold black--text">{{ count }}</span>
          </template>
        </i18n>
        <data-table-pagination
          :count="count"
          :paginate-by="options.itemsPerPage"
          :page="options.page ?? 1"
          :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
          v-on:update:page="handleUpdatePage"
          v-on:update:paginateBy="handleUpdatePaginateBy"
        />
      </div>
    </div>
    <div
      v-if="activeFilters.length > 0"
      class="px-2 pt-1 d-flex align-center"
      style="border-bottom: 1px solid lightgray"
    >
      <filter-summary
        :filters="activeFilters"
        @click:value="handleValueClick"
        @remove:filter="handleRemoveFilter"
        @clear="handleClear"
      />
    </div>
    <v-data-table
      v-if="view === 'table'"
      class="rounded-0"
      dense
      hide-default-footer
      mobile-breakpoint="0"
      :headers="visibleHeaders"
      :items="items"
      :options="options"
      :server-items-length="count"
      :loading="loading"
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, 500, 1000] }"
      @update:options="handleUpdateOptions"
    >
      <template #item.record="{ item }">
        <div class="d-flex">
          <v-btn color="blue" icon :to="{ path: `/reference/${item.id}` }">
            <v-icon>fas fa-eye</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.is_estonian="{ item }">
        <v-icon v-if="item.is_estonian" color="green">fas fa-check</v-icon>
      </template>
      <template #item.journal="{ item }">
        <router-link
          :to="{ path: `/journal/${item.journal.id}` }"
          :title="$t('editJournal.editMessage')"
          class="sarv-link"
          v-if="item.journal"
        >
          <span>{{ item.journal.name }}</span>
        </router-link>
      </template>
      <template #item.author="{ item }">
        <div style="min-width: 8rem">
          {{ item.author }}
        </div>
      </template>
      <template #item.title="{ item }">
        <div style="min-width: 16rem">
          {{ item.title }}
        </div>
      </template>
      <template #item.links="{ item }">
        <div class="d-flex">
          <v-btn
            icon
            v-if="!item.is_private"
            :href="`https://kirjandus.geoloogia.info/reference/${item.id}`"
          >
            <v-icon>fas fa-arrow-up-right-from-square</v-icon>
          </v-btn>
          <v-btn v-if="item.doi" icon :href="`https://doi.org/${item.doi}`">
            <v-icon color="#fab608">ai ai-doi</v-icon>
          </v-btn>
          <v-btn
            v-if="item.attachment?.[0]?.uuid_filename"
            icon
            :href="`/files/${item.attachment[0].uuid_filename}`"
          >
            <v-icon color="red">fas fa-file-pdf</v-icon>
          </v-btn>
          <v-btn v-if="item.url" icon :href="item.url">
            <v-icon>fas fa-link</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-data-table
      class="rounded-0"
      v-else-if="view === 'bibliography'"
      dense
      hide-default-footer
      hide-default-header
      mobile-breakpoint="0"
      :headers="visibleHeadersBibliography"
      :items="items"
      :options="options"
      :server-items-length="count"
      :loading="loading"
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, 500, 1000] }"
      @update:options="handleUpdateOptions"
    >
      <template #item.record="{ item }">
        <v-btn color="blue" icon :to="{ path: `/reference/${item.id}` }">
          <v-icon>fas fa-eye</v-icon>
        </v-btn>
      </template>
      <template #item.source="{ item }">
        <span v-html="item.source" />
        <v-chip
          v-if="item.doi"
          class="ml-1 font-weight-medium black--text"
          outlined
          color="#fab608"
          link
          small
          :href="`https://doi.org/${item.doi}`"
        >
          <v-icon small left color="#fab608">ai ai-doi</v-icon>
          DOI
        </v-chip>
        <v-chip
          v-if="item.pdf"
          class="ml-1"
          outlined
          color="red"
          link
          small
          :href="`/files/${item.pdf}`"
        >
          <v-icon small left color="red">fas fa-file-pdf</v-icon>
          <span class="black--text"> PDF </span>
        </v-chip>
        <v-chip
          v-if="item.url"
          class="ml-1"
          outlined
          link
          small
          :href="item.url"
        >
          <v-icon small left>fas fa-link</v-icon>
          URL
        </v-chip>
      </template>
    </v-data-table>
    <div
      style="
        border-bottom: 1px solid lightgray;
        border-top: 1px solid lightgray;
      "
      class="d-flex justify-center justify-sm-end px-2 py-1"
    >
      <data-table-pagination
        :count="count"
        :paginate-by="options.itemsPerPage"
        :page="options.page ?? 1"
        :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
        v-on:update:page="handleUpdatePage"
        v-on:update:paginateBy="handleUpdatePaginateBy"
      />
    </div>
  </div>
</template>

<script>
import FilterMenu from "./FilterMenu.vue";
import DataTableHeadersMenu from "@/components/partial/DataTableHeadersMenu.vue";
import DataTablePagination from "@/components/partial/DataTablePagination.vue";
import FilterSummary from "./FilterSummary.vue";
import { rwapiClient } from "../helpers/httpClients";

function defaultHeadersBibliography() {
  return [
    { text: "", value: "record", sortable: false, show: true },
    { text: "Source", value: "source", show: true },
  ];
}

export default {
  name: "DataTableReference",
  components: {
    FilterMenu,
    DataTableHeadersMenu,
    DataTablePagination,
    FilterSummary,
  },
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    initView: {
      type: String,
      default: "table",
    },
    initCitationStyle: {
      type: String,
      default: "apa",
    },
    initOptions: {
      type: Object,
      default: () => ({ itemsPerPage: 25 }),
    },
    initHeaders: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      view: this.initView,
      citationStyle: this.initCitationStyle,
      options: this.initOptions,
      headers: this.initHeaders ? this.initHeaders : this.defaultHeaders(),
      headersBibliography: defaultHeadersBibliography(),
      exportOptions: {
        filename: "export",
        format: "json",
        count: 25,
      },
    };
  },
  computed: {
    activeFilters() {
      return this.filters
        .map((filter, index) => ({ ...filter, filterIndex: index }))
        .filter((filter) => {
          if (
            !filter.enabled ||
            filter.field === null ||
            filter.lookup === null ||
            filter.value === null ||
            filter.value.length < 1 ||
            (Array.isArray(filter.value) && filter.value.includes(null))
          )
            return false;

          return true;
        });
    },
    citationStyles() {
      return [
        { text: "APA", value: "apa" },
        { text: "Harvard", value: "harvard1" },
        { text: "Sedimentology", value: "sedimentology" },
      ];
    },
    testHeaders() {
      return [
        {
          text: "",
          value: "record",
          sortable: false,
          show: true,
          hideable: false,
        },
        { text: this.$t("headers.id"), value: "id", show: true },
        { text: this.$t("headers.authors"), value: "author", show: true },
        { text: this.$t("headers.year"), value: "year", show: true },
        { text: this.$t("headers.title"), value: "title", show: true },
        { text: this.$t("headers.journal"), value: "journal", show: true },
        { text: this.$t("headers.volume"), value: "volume", show: true },
        { text: this.$t("headers.pages"), value: "pages", show: true },
        { text: this.$t("headers.estonian"), value: "is_estonian", show: true },
        { text: this.$t("headers.links"), value: "links", show: true },
      ];
    },
    filterMap() {
      return {
        id: { field: "id", name: this.$t("filters.id"), type: "number" },
        title: {
          field: "title",
          name: this.$t("filters.title"),
          type: "string",
        },
        author: {
          field: "author",
          name: this.$t("filters.authors"),
          type: "string",
        },
        titleOriginal: {
          field: "title_original",
          name: this.$t("filters.originalTitle"),
          type: "string",
        },
        titleTranslated: {
          field: "title_translated",
          name: this.$t("filters.translatedTitle"),
          type: "string",
        },
        year: { field: "year", name: this.$t("filters.year"), type: "string" },
        journal: {
          field: "journal",
          name: this.$t("filters.journal"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/journals", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        parent: {
          field: "parent",
          name: this.$t("filters.parentReference"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/references", {
              params: {
                fields: "id,reference",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "reference",
          itemValue: "id",
        },
        translatedReference: {
          field: "translated_reference",
          name: this.$t("filters.translatedReference"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/references", {
              params: {
                fields: "id,reference",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "reference",
          itemValue: "id",
        },
        language: {
          field: "language",
          name: this.$t("filters.language"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/languages", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        titleTranslatedLanguage: {
          field: "title_translated_language",
          name: this.$t("filters.translatedTitleLanguage"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/languages", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        licence: {
          field: "licence",
          name: this.$t("filters.licence"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/licences", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        type: {
          field: "type",
          name: this.$t("filters.type"),
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/reference-types", {
              params: {
                fields: "id,value",
                limit,
                offset,
                value__icontains: search,
              },
            }),
          itemText: "value",
          itemValue: "id",
        },
        library: {
          field: "reference_libraries__library",
          name: this.$t("filters.libraries"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/libraries", {
              params: {
                fields: "id,title",
                limit,
                offset,
                title__icontains: search,
              },
            }),
          itemText: "title",
          itemValue: "id",
        },
        keyword: {
          field: "keywords",
          name: this.$t("filters.keywords"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/keywords", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        taxon: {
          field: "taxa",
          name: this.$t("filters.taxa"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/taxa", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        area: {
          field: "reference_areas__area",
          name: this.$t("filters.areas"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/areas", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        locality: {
          field: "reference_localities__locality",
          name: this.$t("filters.localities"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/localities", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        stratigraphy: {
          field: "reference_stratigraphies__stratigraphy",
          name: this.$t("filters.stratigraphies"),
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            rwapiClient.get("/api/v1/private/stratigraphies", {
              params: {
                fields: "id,name",
                limit,
                offset,
                name__icontains: search,
              },
            }),
          itemText: "name",
          itemValue: "id",
        },
        book: { field: "book", name: this.$t("filters.book"), type: "string" },
        bookEditor: {
          field: "book_editor",
          name: this.$t("filters.bookEditor"),
          type: "string",
        },
        bookOriginal: {
          field: "book_original",
          name: this.$t("filters.originalBookTitle"),
          type: "string",
        },
        bookTranslated: {
          field: "book_translated",
          name: this.$t("filters.translatedBookTitle"),
          type: "string",
        },
        bookTranslatedLanguage: {
          field: "book_translated_language",
          name: this.$t("filters.translatedBookTitleLanguage"),
          type: "string",
        },
        abstract: {
          field: "abstract",
          name: this.$t("filters.abstract"),
          type: "string",
        },
        remarks: {
          field: "remarks",
          name: this.$t("filters.remarks"),
          type: "string",
        },
        reference: {
          field: "reference",
          name: this.$t("filters.reference"),
          type: "string",
        },
        doi: { field: "doi", name: this.$t("filters.doi"), type: "string" },
        isEstonian: {
          field: "is_estonian",
          name: this.$t("filters.estonian"),
          type: "boolean",
        },
        isEstonianAuthor: {
          field: "is_estonian_author",
          name: this.$t("filters.estonianAuthor"),
          type: "boolean",
        },
        isPrivate: {
          field: "is_private",
          name: this.$t("filters.private"),
          type: "boolean",
        },
        isOA: {
          field: "is_oa",
          name: this.$t("filters.openAccess"),
          type: "boolean",
        },
        isbn: {
          field: "isbn",
          name: this.$t("filters.isbn"),
          type: "string",
        },
        issn: {
          field: "issn",
          name: this.$t("filters.issn"),
          type: "string",
        },
        publisher: {
          field: "publisher",
          name: this.$t("filters.publisher"),
          type: "string",
        },
        publisherPlace: {
          field: "publisher_place",
          name: this.$t("filters.publisherPlace"),
          type: "string",
        },
        userAdded: {
          field: "user_added",
          name: this.$t("filters.userAdded"),
          type: "string",
        },
        dateAdded: {
          field: "date_added",
          name: this.$t("filters.dateAdded"),
          type: "datetime",
        },
        userChanged: {
          field: "user_changed",
          name: this.$t("filters.userChanged"),
          type: "string",
        },
      };
    },
    visibleHeaders() {
      return this.headers.filter((header) => header.show);
    },
    visibleHeadersBibliography() {
      return this.headersBibliography.filter((header) => header.show);
    },
    activeHeaderIndexes() {
      return this.headers.reduce((acc, header, index) => {
        if (header.show) acc.push(index);
        return acc;
      }, []);
    },
  },
  watch: {
    "$i18n.locale": {
      handler() {
        const translatedHeaders = this.defaultHeaders();
        this.headers.forEach((header, index) => {
          header.text = translatedHeaders[index].text;
        });
      },
    },
    filters: {
      handler() {
        this.options.page = 1;
        this.$emit("change:options", structuredClone(this.options));
      },
      deep: true,
    },
    view: {
      handler(value) {
        this.$emit("change:view", value);
      },
    },
    citationStyle: {
      handler(value) {
        this.$emit("change:citation-style", value);
      },
    },
  },
  methods: {
    defaultHeaders() {
      return [
        {
          text: "",
          value: "record",
          sortable: false,
          show: true,
          hideable: false,
        },
        { text: this.$t("headers.id"), value: "id", show: true },
        { text: this.$t("headers.authors"), value: "author", show: true },
        { text: this.$t("headers.year"), value: "year", show: true },
        { text: this.$t("headers.title"), value: "title", show: true },
        { text: this.$t("headers.journal"), value: "journal", show: true },
        { text: this.$t("headers.volume"), value: "volume", show: true },
        { text: this.$t("headers.pages"), value: "pages", show: true },
        { text: this.$t("headers.estonian"), value: "is_estonian", show: true },
        { text: this.$t("headers.links"), value: "links", show: true },
      ];
    },
    handleUpdateOptions(newOptions) {
      this.options = newOptions;
      this.$emit("change:options", structuredClone(this.options));
    },
    handleUpdatePage(newPage) {
      this.options.page = newPage;
      this.$emit("change:options", structuredClone(this.options));
    },
    handleUpdatePaginateBy(newPaginateBy) {
      this.options.page = 1;
      this.options.itemsPerPage = newPaginateBy;
      this.$emit("change:options", structuredClone(this.options));
    },
    handleExport() {
      this.$emit("export", structuredClone(this.exportOptions));
    },
    handleHeaderChange(event) {
      const index = this.headers.findIndex(
        (header) => header.value === event.value
      );
      this.headers[index].show = !this.headers[index].show;
      this.$emit("change:headers", structuredClone(this.headers));
    },
    handleHeadersReset() {
      this.headers = this.defaultHeaders();
    },
    handleValueClick(value) {
      this.$refs.filterMenu.openAndFocusInput(value.filterIndex);
    },
    handleRemoveFilter({ filterIndex }) {
      const filter = this.filters[filterIndex];

      if (filter.lookup.type === "autocompleteList") {
        filter.value = [];
      } else if (["range", "dateRange"].includes(filter.lookup.type)) {
        filter.value = [null, null];
      } else {
        filter.value = null;
      }
    },
    handleClear() {
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].lookup.type === "autocomplete") {
          this.filters[i].value = null;
        } else if (this.filters[i].lookup.type === "autocompleteList") {
          this.filters[i].value = [];
        } else if (this.filters[i].lookup.typpe === "range") {
          this.filters[i].value = [null, null];
        }
        this.filters[i].value = null;
      }
    },
  },
};
</script>
<style scoped>
.v-select__selection {
  max-width: 100%;
}
.v-select__selections input {
  width: 0 !important;
  min-width: 0 !important;
}
.v-btn-toggle > .v-btn {
  opacity: 1 !important;
  background-color: transparent;
}
</style>
