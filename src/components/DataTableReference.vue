<template>
  <div>
    <div
      class="px-2 py-1 d-flex align-center"
      style="
        border-bottom: 1px solid lightgray;
        border-top: 1px solid lightgray;
      "
    >
      <filter-menu
        ref="filterMenu"
        :filters="filters"
        :filter-map="filterMap"
        :total-active-filters="activeFilters.length"
      />
      <v-menu offset-y bottom :close-on-content-click="false">
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-2 text-capitalize"
            outlined
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>fas fa-file-export</v-icon>
            {{ $t("dataTable.export") }}
          </v-btn>
        </template>
        <v-card class="pa-2">
          <v-btn-toggle dense v-model="exportOptions.format">
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
          <v-btn outlined color="warning" @click="handleExport">Export</v-btn>
        </v-card>
      </v-menu>
      <v-btn-toggle class="mr-2" dense v-model="view">
        <v-btn icon value="table">
          <v-icon>fas fa-table</v-icon>
        </v-btn>
        <v-btn value="bibliography">
          <v-icon small>fas fa-book-open</v-icon>
        </v-btn>
      </v-btn-toggle>
      <data-table-headers-menu
        v-if="view === 'table'"
        :headers="headers"
        :visible-headers="visibleHeaders"
        @change="handleHeaderChange"
        @reset="handleHeadersReset"
      >
        <template #activator="menu">
          <v-btn
            class="text-capitalize"
            outlined
            text
            v-bind="{ ...menu.attrs }"
            v-on="{ ...menu.on }"
          >
            <v-icon left>fas fa-table</v-icon>
            {{ $t("dataTable.columns") }}
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
      <data-table-pagination
        class="ml-auto"
        :count="count"
        :paginate-by="options.itemsPerPage"
        :page="options.page ?? 1"
        :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
        v-on:update:page="options.page = $event"
        v-on:update:paginateBy="options.itemsPerPage = $event"
      />
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
      :options.sync="options"
      :server-items-length="count"
      :loading="loading"
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, 500, 1000] }"
    >
      <template #item.record="{ item }">
        <v-btn color="blue" icon :to="{ path: `/reference/${item.id}` }">
          <v-icon>fas fa-eye</v-icon>
        </v-btn>
      </template>
      <template #item.is_estonian="{ item }">
        <v-icon v-if="item.is_estonian">fas fa-check</v-icon>
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
      <template #item.doi="{ item }">
        <a v-if="item.doi" :href="`https://doi.org/${item.doi}`">DOI</a>
      </template>
      <template #item.pdf="{ item }">
        <a
          v-if="item.attachment[0]?.uuid_filename"
          :href="`https://files-dev.geoloogia.info/${item.attachment[0].uuid_filename}`"
          >pdf</a
        >
      </template>
      <template #item.url="{ item }">
        <a v-if="item.url" :href="item.url"> URL </a>
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
      :options.sync="options"
      :server-items-length="count"
      :loading="loading"
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, 500, 1000] }"
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
          class="ml-1"
          outlined
          color="blue"
          link
          small
          :href="`https://doi.org/${item.doi}`"
        >
          DOI
        </v-chip>
        <v-chip v-if="item.pdf" class="ml-1" outlined color="red" link small>
          PDF
        </v-chip>
        <v-chip
          v-if="item.url"
          class="ml-1"
          outlined
          color="green"
          link
          small
          :href="item.url"
        >
          URL
        </v-chip>
      </template>
    </v-data-table>
    <div
      style="
        border-bottom: 1px solid lightgray;
        border-top: 1px solid lightgray;
      "
      class="d-flex justify-end px-2 py-1"
    >
      <data-table-pagination
        class="ml-auto"
        :count="count"
        :paginate-by="options.itemsPerPage"
        :page="options.page ?? 1"
        :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
        v-on:update:page="options.page = $event"
        v-on:update:paginateBy="options.itemsPerPage = $event"
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

function defaultHeaders() {
  return [
    { text: "", value: "record", sortable: false, show: true },
    { text: "Id", value: "id", show: true },
    { text: "Authors", value: "author", show: true },
    { text: "Year", value: "year", show: true },
    { text: "Title", value: "title", show: true },
    { text: "Journal", value: "journal", show: true },
    { text: "Volume", value: "volume", show: true },
    { text: "Pages", value: "pages", show: true },
    { text: "Estonian", value: "is_estonian", show: true },
    { text: "DOI", value: "doi", show: true },
    { text: "PDF", value: "pdf", show: true },
    { text: "URL", value: "url", show: true },
  ];
}
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
  },
  data() {
    return {
      view: this.initView,
      citationStyle: this.initCitationStyle,
      options: { itemsPerPage: 25 },
      headers: defaultHeaders(),
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
    sortFieldMap() {
      return {
        journal: "journal__journal_name",
      };
    },
    ordering() {
      if (this.options?.sortBy?.length > 0) {
        return this.options.sortBy
          .map((value, index) => {
            const sortField = this.sortFieldMap[value] ?? value;

            if (this.options.sortDesc[index]) {
              return `-${sortField}`;
            }
            return sortField;
          })
          .join(",");
      }
      return null;
    },
  },

  watch: {
    options: {
      handler(value) {
        this.$emit("options:change", value);
      },
      deep: true,
    },
    filters: {
      handler(value) {
        this.$emit("filters:change", value);
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
    handleExport() {
      this.$emit("export", this.exportOptions);
    },
    addFilter() {
      this.filters.push({
        field: null,
        lookup: null,
        value: null,
        enabled: true,
      });
    },
    removeFilter(index) {
      this.filters.splice(index, 1);
    },
    handleFieldChange(index, newField) {
      this.filters[index].field = newField;
      this.filters[index].lookup = this.lookupMap[newField.type][0];
      this.filters[index].value = null;
    },
    handleLookupChange(index, newLookup) {
      this.filters[index].lookup = newLookup;
      if (["__in", "__superset_of"].includes(newLookup.value)) {
        this.filters[index].value = [];
      } else if (newLookup.value === "__range") {
        this.filters[index].value = [null, null];
      } else {
        this.filters[index].value = null;
      }
    },
    handleHeaderChange(event) {
      const index = this.headers.findIndex(
        (header) => header.value === event.value
      );
      this.headers[index].show = !this.headers[index].show;
    },
    handleHeadersReset() {
      this.headers = defaultHeaders();
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
</style>