<template>
  <v-menu
    :close-on-content-click="false"
    bottom
    offset-y
    ref="menu"
    content-class="elevation-1"
    style="z-index: 1 !important"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        ref="menuButton"
        class="text-capitalize"
        text
        outlined
        :color="totalActiveFilters > 0 ? 'warning' : 'grey darken-3'"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small left>fas fa-filter</v-icon>
        {{ $t("dataTable.filters", { count: totalActiveFilters }) }}
      </v-btn>
    </template>
    <v-card class="pa-2" style="min-width: 14em">
      <filter-builder
        ref="filterBuilder"
        :filters="filters"
        :filter-map="filterMap"
      />
    </v-card>
  </v-menu>
</template>
<script>
import FilterBuilder from "./FilterBuilder.vue";
import sortBy from "lodash/sortBy";

export default {
  name: "FilterMenu",
  components: { FilterBuilder },
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    filterMap: {
      type: Object,
      default: () => ({}),
    },
    totalActiveFilters: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    filterTypeIconMap() {
      return {
        string: "fas fa-font",
        number: "fas fa-chart-bar",
        autocomplete: "fas fa-tag",
        autocompleteList: "fas fa-tags",
        boolean: "fas fa-check",
        datetime: "fas fa-clock",
      };
    },
    lookupMap() {
      return {
        string: [
          { value: "", name: "equals", type: "string" },
          { value: "!", name: "doesn't equal", type: "string" },
          { value: "__icontains", name: "contains", type: "string" },
          { value: "__icontains!", name: "doesn't contain", type: "string" },
          { value: "__istartswith", name: "starts with", type: "string" },
          { value: "__iendswith", name: "ends with", type: "string" },
          { value: "__isnull", name: "is null", type: "boolean" },
        ],
        number: [
          { value: "", name: "=", type: "string" },
          { value: "!", name: "!=", type: "string" },
          { value: "__lt", name: "<", type: "string" },
          { value: "__lte", name: "<=", type: "string" },
          { value: "__gt", name: ">", type: "string" },
          { value: "__gte", name: ">=", type: "string" },
          { value: "__range", name: "between", type: "range" },
          { value: "__isnull", name: "is null", type: "boolean" },
        ],
        autocomplete: [
          { value: "", name: "=", type: "autocomplete" },
          { value: "__in", name: "in", type: "autocomplete" },
          { value: "__isnull", name: "is null", type: "boolean" },
        ],
        autocompleteList: [
          { value: "", name: "=", type: "autocomplete" },
          { value: "__in", name: "in", type: "autocomplete" },
          { value: "__superset_of", name: "superset of", type: "autocomplete" },
          { value: "__isnull", name: "is null", type: "boolean" },
        ],
        boolean: [
          { value: "", name: "=", type: "boolean" },
          { value: "!", name: "!=", type: "boolean" },
          { value: "__isnull", name: "is null", type: "boolean" },
        ],
        datetime: [
          { value: "__gt", name: ">", type: "datetime" },
          { value: "__gte", name: ">=", type: "datetime" },
          { value: "__lt", name: "<", type: "datetime" },
          { value: "__lte", name: "<=", type: "datetime" },
          { value: "__range", name: "between", type: "datetimeRange" },
        ],
      };
    },
    booleanOptions() {
      return [
        { name: "True", value: true },
        { name: "False", value: false },
      ];
    },
    filterOptions() {
      return sortBy(
        Object.entries(this.filterMap).map(([k, v]) => ({ id: k, ...v })),
        ["name"]
      );
    },
  },
  methods: {
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
    openAndFocusInput(index) {
      this.$refs.menuButton.$el.click();
      this.$nextTick(() => {
        console.log(this.$refs.filterBuilder.$refs[`value${index}`]);
        setTimeout(
          () => this.$refs.filterBuilder.$refs[`value${index}`][0].focus(),
          100
        );
      });
    },
  },
};
</script>

<style scoped>
.v-select >>> .v-select__selection {
  max-width: 100%;
}
.v-select >>> .v-select__selections input {
  width: 0 !important;
  min-width: 0 !important;
}
</style>
