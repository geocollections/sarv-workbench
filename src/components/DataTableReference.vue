<template>
  <div>
    <v-data-table
      style="overflow-y: auto; margin-bottom: 100px"
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
      <template #top>
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
          />
          <data-table-headers-menu
            :headers="headers"
            :visible-headers="visibleHeaders"
            @change="handleHeaderChange"
            @reset="handleHeadersReset"
          >
            <template #activator="menu">
              <v-btn
                class="ml-2 text-capitalize"
                outlined
                text
                v-bind="{ ...menu.attrs }"
                v-on="{ ...menu.on }"
              >
                <v-icon left>fas fa-table</v-icon>
                Columns
              </v-btn>
            </template>
          </data-table-headers-menu>
          <v-menu offset-y bottom :close-on-content-click="false">
            <template #activator="{ on, attrs }">
              <v-btn
                class="ml-2 text-capitalize"
                outlined
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left>fas fa-file-export</v-icon>
                Export
              </v-btn>
            </template>
            <v-card class="pa-2">
              <v-btn-toggle dense v-model="exportOptions.format">
                <v-btn value="json">JSON</v-btn>
                <v-btn value="xlsx">XLSX</v-btn>
                <v-btn value="csv">CSV</v-btn>
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
              <v-btn outlined color="warning" @click="handleExport"
                >Export</v-btn
              >
            </v-card>
          </v-menu>
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
          v-if="filters.length > 0"
          class="px-2 py-1 d-flex align-center"
          style="border-bottom: 1px solid lightgray"
        >
          <filter-summary :filters="filters" @click:value="handleValueClick" />
        </div>
      </template>
      <template #footer>
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
      </template>
    </v-data-table>
    <!-- <v-card -->
    <!--   style=" -->
    <!--     min-width: 100px; -->
    <!--     background: white; -->
    <!--     position: fixed; -->
    <!--     right: 1em; -->
    <!--     bottom: 1em; -->
    <!--     z-index: 5000; -->
    <!--   " -->
    <!-- > -->
    <!--   <v-data-footer -->
    <!--     :options.sync="options" -->
    <!--     :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]" -->
    <!--     :pagination="{ -->
    <!--       page: options.page - 1 ?? 0, -->
    <!--       itemsPerPage: options.itemsPerPage, -->
    <!--       itemsLength: count, -->
    <!--       pageStart: (options.page - 1 ?? 0) * options.itemsPerPage, -->
    <!--       pageStop: (options.page ?? 0) * options.itemsPerPage, -->
    <!--       pageCount: Math.ceil(count / options.itemsPerPage), -->
    <!--     }" -->
    <!--   /> -->
    <!-- </v-card> -->
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";
import FilterMenu from "./FilterMenu.vue";
import DataTableHeadersMenu from "@/components/partial/DataTableHeadersMenu.vue";
import DataTablePagination from "@/components/partial/DataTablePagination.vue";
import FilterSummary from "./FilterSummary.vue";
const axiosInstance = axios.create({
  baseURL: "https://rwapi-dev.geoloogia.info",
  headers: {
    Authorization: `Token ${store?.state?.user?.authUser?.token}`,
  },
});

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
  },
  data() {
    return {
      options: { itemsPerPage: 25 },
      headers: defaultHeaders(),
      exportOptions: {
        filename: "export",
        format: "json",
        count: 25,
      },
    };
  },
  computed: {
    filterMap() {
      return {
        id: { field: "id", name: "Id", type: "number" },
        title: { field: "title", name: "Title", type: "string" },
        author: { field: "author", name: "Authors", type: "string" },
        titleOriginal: {
          field: "title_original",
          name: "Original title",
          type: "string",
        },
        titleTranslated: {
          field: "title_translated",
          name: "Translated title",
          type: "string",
        },
        year: { field: "year", name: "Year", type: "string" },
        journal: {
          field: "journal",
          name: "Journal",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/journals", {
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
          name: "Parent reference",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/references", {
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
          name: "Translated reference",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/references", {
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
          name: "Language",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/languages", {
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
          name: "Translated title language",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/languages", {
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
          name: "Licence",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/licences", {
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
          name: "Type",
          type: "autocomplete",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/reference-types", {
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
          field: "reference_libraries",
          name: "Libraries",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/libraries", {
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
          name: "Keywords",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/keywords", {
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
          name: "Taxa",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/taxa", {
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
          field: "reference_areas",
          name: "Areas",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/areas", {
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
          name: "Localities",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/localities", {
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
          field: "reference_stratigraphies",
          name: "Stratigraphies",
          type: "autocompleteList",
          queryFunc: ({ search, limit, offset }) =>
            axiosInstance.get("/api/v1/private/stratigraphies", {
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
        book: { field: "book", name: "Book", type: "string" },
        bookEditor: {
          field: "book_editor",
          name: "Book editor",
          type: "string",
        },
        bookOriginal: {
          field: "book_original",
          name: "Original book title",
          type: "string",
        },
        bookTranslated: {
          field: "book_translated",
          name: "Translated book title",
          type: "string",
        },
        bookTranslatedLanguage: {
          field: "book_translated_language",
          name: "Translated book title language",
          type: "string",
        },
        abstract: { field: "abstract", name: "Abstract", type: "string" },
        remarks: { field: "remarks", name: "Remarks", type: "string" },
        reference: { field: "reference", name: "Reference", type: "string" },
        doi: { field: "doi", name: "Doi", type: "string" },
        isEstonian: {
          field: "is_estonian",
          name: "Estonian",
          type: "boolean",
        },
        isEstonianAuthor: {
          field: "is_estonian_author",
          name: "Estonian author",
          type: "boolean",
        },
        isPrivate: {
          field: "is_private",
          name: "Private",
          type: "boolean",
        },
        isOA: {
          field: "is_oa",
          name: "OpenAccess",
          type: "boolean",
        },
        isbn: {
          field: "isbn",
          name: "ISBN",
          type: "string",
        },
        issn: {
          field: "issn",
          name: "ISSN",
          type: "string",
        },
        publisher: {
          field: "publisher",
          name: "Publisher",
          type: "string",
        },
        publisherPlace: {
          field: "publisher_place",
          name: "Publisher place",
          type: "string",
        },
        userAdded: {
          field: "user_added",
          name: "User added",
          type: "string",
        },
        dateAdded: {
          field: "date_added",
          name: "Date added",
          type: "datetime",
        },
        userChanged: {
          field: "user_changed",
          name: "User changed",
          type: "string",
        },
      };
    },
    visibleHeaders() {
      return this.headers.filter((header) => header.show);
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
