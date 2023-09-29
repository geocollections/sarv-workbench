<template>
  <div>
    <h1 class="pa-2">{{ $tc("modules.reference", 2) }}</h1>
    <data-table-reference
      :filters="filters"
      :items="references"
      :count="totalReferences"
      :loading="loading"
      :init-view="view"
      :init-citation-style="citationStyle"
      @options:change="options = $event"
      @filters:change="filters = $event"
      @change:view="view = $event"
      @change:citation-style="citationStyle = $event"
      @export="handleExport"
    />
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";
import DataTableReference from "../components/DataTableReference.vue";
import { rwapiClient } from "../helpers/httpClients";

export default {
  name: "ReferenceList",
  components: {
    DataTableReference,
    // FilterBuilder,
    // FilterBuilderVertical,
    // FilterSummary,
    // ExpandableCard,
  },
  data() {
    return {
      references: [],
      options: { itemsPerPage: 25 },
      loading: true,
      totalReferences: 0,
      filters: [],
      view: "table",
      citationStyle: "apa",
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
          name: "Parent reference",
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
          name: "Translated reference",
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
          name: "Language",
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
          name: "Translated title language",
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
          name: "Licence",
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
          name: "Type",
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
          field: "reference_libraries",
          name: "Libraries",
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
          name: "Keywords",
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
          name: "Taxa",
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
          field: "reference_areas",
          name: "Areas",
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
          name: "Localities",
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
          field: "reference_stratigraphies",
          name: "Stratigraphies",
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
    queryFilters() {
      const result = {};
      for (const filter of this.filters) {
        console.log(filter);
        if (
          !filter.enabled ||
          filter.field === null ||
          filter.lookup === null ||
          filter.value === null ||
          filter.value.length < 1 ||
          (Array.isArray(filter.value) && filter.value.includes(null))
        ) {
          continue;
        }
        if (filter.lookup.type === "string") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueString(filter);
        } else if (filter.lookup.type === "number") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueString(filter);
        } else if (filter.lookup.type === "range") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueRange(filter);
        } else if (filter.lookup.type === "autocomplete") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueAutocomplete(filter);
        } else if (filter.lookup.type === "autocompleteList") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueAutocomplete(filter);
        } else if (filter.lookup.type === "boolean") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = filter.value;
        } else if (filter.lookup.type === "datetime") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = filter.value;
        } else if (filter.lookup.type === "datetimeRange") {
          const key = `${filter.field.field}${filter.lookup.value}`;
          result[key] = this.parseQueryValueRange(filter);
        }
      }
      return result;
    },
  },
  created() {
    this.getReferences({ view: this.view, citationStyle: this.citationStyle });
  },
  watch: {
    options: {
      handler() {
        this.getReferences({
          view: this.view,
          citationStyle: this.citationStyle,
        });
      },
      deep: true,
    },
    queryFilters: {
      handler() {
        this.getReferences({
          view: this.view,
          citationStyle: this.citationStyle,
        });
      },
      deep: true,
    },
    view: {
      handler() {
        this.getReferences({
          view: this.view,
          citationStyle: this.citationStyle,
        });
      },
    },
    citationStyle: {
      handler() {
        this.getReferences({
          view: this.view,
          citationStyle: this.citationStyle,
        });
      },
    },
  },
  methods: {
    async handleExport(options) {
      const res = await rwapiClient.get("/api/v1/private/references", {
        responseType: "blob",
        params: {
          ordering: this.ordering ?? "-id",
          limit: options.count,
          ...this.queryFilters,
          format: options.format,
        },
      });
      const data = options.format === "json" ? res.data.results : res.data;
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${options.filename}.${options.format}`;
      link.click();
    },
    parseQueryValueString(filter) {
      if (filter.lookup.value === "__in") {
        return filter.value.join(",");
      }
      return filter.value;
    },
    parseQueryValueRange(filter) {
      return filter.value.join(",");
    },
    parseQueryValueAutocomplete(filter) {
      if (["__in", "__superset_of"].includes(filter.lookup.value)) {
        return filter.value.map((v) => v.id).join(",");
      }
      return filter.value.id;
    },
    async getReferences({ view, citationStyle }) {
      this.loading = true;

      let viewParams = {};
      if (view === "table") {
        viewParams = {
          expand: "journal,attachment",
          ordering: this.ordering ?? "-id",
        };
      } else if (view === "bibliography") {
        viewParams = {
          view_type: "bibliography",
          citation_style: citationStyle,
          ordering: "-id",
        };
      }
      const res = await rwapiClient.get("/api/v1/private/references", {
        params: {
          ...viewParams,
          limit: this.options?.itemsPerPage,
          offset: this.options?.itemsPerPage * (this.options?.page - 1),
          ...this.queryFilters,
        },
      });
      this.references = res.data.results;
      this.totalReferences = res.data.count;
      this.loading = false;
    },
  },
};
</script>
