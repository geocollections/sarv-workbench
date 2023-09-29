<template>
  <div class="pa-2">
    <div
      class="d-flex align-start mb-1"
      v-for="(filter, index) in filters"
      :key="index"
    >
      <div class="d-flex align-center" style="height: 40px">
        <v-switch class="mt-0" dense hide-details v-model="filter.enabled" />
      </div>
      <v-autocomplete
        class="mr-1"
        style="min-width: 14em"
        :value="filter.filter"
        :items="filterOptions ?? []"
        hide-details
        outlined
        dense
        placeholder="-"
        return-object
        :menu-props="{ bottom: true, offsetY: true }"
        :value-comparator="fieldComparator"
        @input="handleFieldChange(index, $event)"
      >
        <template #item="{ item }">
          <v-icon v-if="filterTypeIconMap[item.type]" small left>
            {{ filterTypeIconMap[item.type] }}
          </v-icon>
          <div>{{ item.name }}</div>
        </template>
        <template #selection="{ item }">
          <v-icon v-if="filterTypeIconMap[item.type]" small left>
            {{ filterTypeIconMap[item.type] }}
          </v-icon>
          <div>{{ item.name }}</div>
        </template>
      </v-autocomplete>
      <v-select
        class="mr-1"
        :value="filter.lookup"
        :items="lookupMap[filter.field?.type] ?? []"
        item-text="name"
        :readonly="!filter.field"
        hide-details
        dense
        outlined
        placeholder="-"
        return-object
        :menu-props="{ bottom: true, offsetY: true }"
        @input="handleLookupChange(index, $event)"
      />
      <filter-autocomplete
        v-if="filter.lookup?.type === 'autocomplete'"
        :ref="`value${index}`"
        v-model="filter.value"
        :query="filter.field?.queryFunc"
        :item-text="filter.field?.itemText"
        :item-value="filter.field?.itemValue"
        :key="`autocomplete-${filter.field.id}-${index}`"
        :readonly="!filter.field"
        :multiple="['__in', '__superset_of'].includes(filter.lookup.value)"
      />
      <filter-autocomplete
        v-else-if="filter.lookup?.type === 'autocompleteList'"
        :ref="`value${index}`"
        v-model="filter.value"
        :query="filter.field?.queryFunc"
        :item-text="filter.field?.itemText"
        :item-value="filter.field?.itemValue"
        :key="`autocompleteList-${filter.field.id}-${index}`"
        :readonly="!filter.field"
        :multiple="true"
      />
      <v-select
        v-else-if="filter.lookup?.type === 'boolean'"
        :ref="`value${index}`"
        v-model="filter.value"
        :items="booleanOptions"
        item-text="name"
        style="max-width: 400px"
        :readonly="!filter.field"
        item-value="value"
        outlined
        hide-details
        dense
        placeholder="-"
        :menu-props="{ bottom: true, offsetY: true }"
      />
      <div
        class="d-flex align-center"
        v-else-if="filter.lookup?.type === 'range'"
      >
        <v-text-field
          :ref="`value${index}`"
          v-model="filter.value[0]"
          class="mr-1"
          style="width: 7em"
          :readonly="!filter.field"
          placeholder="-"
          dense
          outlined
          hide-details
        />
        and
        <v-text-field
          v-model="filter.value[1]"
          style="width: 7em"
          :readonly="!filter.field"
          placeholder="-"
          class="ml-1"
          dense
          outlined
          hide-details
        />
      </div>
      <filter-datetime
        v-else-if="filter.lookup?.type === 'datetime'"
        v-model="filter.value"
      >
      </filter-datetime>
      <div
        v-else-if="filter.lookup?.type === 'datetimeRange'"
        class="d-flex align-center"
      >
        <filter-datetime v-model="filter.value[0]" class="mr-1" />
        and
        <filter-datetime v-model="filter.value[1]" class="ml-1" />
      </div>
      <v-text-field
        v-else
        :ref="`value${index}`"
        v-model="filter.value"
        style="max-width: 400px"
        :readonly="!filter.field"
        placeholder="-"
        dense
        outlined
        hide-details
      />

      <v-btn icon @click="removeFilter(index)">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </div>
    <v-btn text color="primary" @click="addFilter">+ add</v-btn>
  </div>
</template>
<script>
import FilterAutocomplete from "@/components/FilterAutocomplete.vue";
import FilterDatetime from "@/components/FilterDatetime.vue";
import sortBy from "lodash/sortBy";
export default {
  name: "FilterBuilder",
  components: { FilterAutocomplete, FilterDatetime },
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    filterMap: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    totalActiveFilters() {
      return this.filters.reduce((acc, cur) => {
        if (cur.enabled) acc += 1;
        return acc;
      }, 0);
    },
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
          { value: "", name: this.$t("lookups.equal"), type: "string" },
          { value: "!", name: this.$t("lookups.notEqual"), type: "string" },
          {
            value: "__icontains",
            name: this.$t("lookups.contains"),
            type: "string",
          },
          {
            value: "__icontains!",
            name: this.$t("lookups.notContains"),
            type: "string",
          },
          {
            value: "__istartswith",
            name: this.$t("lookups.startsWith"),
            type: "string",
          },
          {
            value: "__iendswith",
            name: this.$t("lookups.endsWith"),
            type: "string",
          },
          {
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        number: [
          { value: "", name: "=", type: "string" },
          { value: "!", name: "!=", type: "string" },
          { value: "__lt", name: "<", type: "string" },
          { value: "__lte", name: "<=", type: "string" },
          { value: "__gt", name: ">", type: "string" },
          { value: "__gte", name: ">=", type: "string" },
          { value: "__range", name: this.$t("lookups.range"), type: "range" },
          {
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        autocomplete: [
          { value: "", name: "=", type: "autocomplete" },
          {
            value: "__in",
            name: this.$t("lookups.in"),
            type: "autocompleteList",
          },
          {
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        autocompleteList: [
          { value: "", name: "=", type: "autocomplete" },
          {
            value: "__in",
            name: this.$t("lookups.in"),
            type: "autocompleteList",
          },
          {
            value: "__superset_of",
            name: this.$t("lookups.superset"),
            type: "autocompleteList",
          },
          {
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        boolean: [
          { value: "", name: "=", type: "boolean" },
          { value: "!", name: "!=", type: "boolean" },
          {
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        datetime: [
          { value: "__gt", name: ">", type: "datetime" },
          { value: "__gte", name: ">=", type: "datetime" },
          { value: "__lt", name: "<", type: "datetime" },
          { value: "__lte", name: "<=", type: "datetime" },
          {
            value: "__range",
            name: this.$t("lookups.range"),
            type: "datetimeRange",
          },
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
      if (newLookup.type === "autocompleteList") {
        this.filters[index].value = [];
      } else if (["range", "datetimeRange"].includes(newLookup.type)) {
        this.filters[index].value = [null, null];
      } else {
        this.filters[index].value = null;
      }
    },
    fieldComparator(a, b) {
      return a?.id === b?.id;
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
