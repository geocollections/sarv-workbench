<template>
  <div>
    <span class="d-flex pa-2 align-center">
      <h1>
        {{ $tc("modules.reference", 2) }}
      </h1>
      <v-btn
        class="ml-3"
        color="green"
        :to="{ path: '/reference/add' }"
        rounded
        outlined
      >
        <v-icon left>fas fa-plus</v-icon>
        {{ $t("add.new") }}
      </v-btn>
      <v-btn
        class="ml-2"
        text
        elevation="0"
        color="warning"
        small
        to="/reference"
      >
        {{ $t("buttons.goToOldSearch") }}

        <v-icon right>fas fa-arrow-left</v-icon>
      </v-btn>
    </span>
    <data-table-reference
      :filters="filters"
      :items="references"
      :count="totalReferences"
      :loading="loading"
      :init-view="view"
      :init-citation-style="citationStyle"
      :init-options="tableOptions"
      :init-headers="headers"
      @change:view="view = $event"
      @change:options="tableOptions = $event"
      @change:filters="filters = $event"
      @change:headers="headers = $event"
      @change:citation-style="citationStyle = $event"
      @export="handleExport"
    />
  </div>
</template>

<script>
import DataTableReference from "../components/DataTableReference.vue";
import { rwapiClient } from "../helpers/httpClients";
import { mapWritableState } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { useReferenceStore } from "@/stores/reference";

export default {
  name: "ReferenceList",
  components: {
    DataTableReference,
  },
  data() {
    return {
      references: [],
      loading: true,
      totalReferences: 0,
    };
  },
  computed: {
    ...mapWritableState(useReferenceStore, [
      "citationStyle",
      "filters",
      "headers",
      "tableOptions",
      "view",
    ]),
    sortFieldMap() {
      return {
        journal: "journal__journal_name",
      };
    },
    ordering() {
      if (this.tableOptions?.sortBy?.length > 0) {
        return this.tableOptions.sortBy
          .map((value, index) => {
            const sortField = this.sortFieldMap[value] ?? value;

            if (this.tableOptions.sortDesc[index]) {
              return `-${sortField}`;
            }
            return sortField;
          })
          .join(",");
      }
      return null;
    },
    queryFilters() {
      const result = {};
      for (const filter of this.filters) {
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
    tableOptions: {
      handler(val) {
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
    cloneDeep,
    handleChangeFilters(newFilters) {
      this.setFilters(newFilters);
    },
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
          limit: this.tableOptions?.itemsPerPage,
          offset:
            this.tableOptions?.itemsPerPage * (this.tableOptions?.page - 1),
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
