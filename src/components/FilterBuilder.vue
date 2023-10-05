<template>
  <div class="pa-2">
    <i18n
      :path="
        totalResults === 1 ? 'dataTable.foundSingle' : 'dataTable.foundPlural'
      "
      class="mb-5 text--secondary"
      tag="div"
    >
      <template #count>
        <span class="font-weight-bold black--text">{{ totalResults }}</span>
      </template>
    </i18n>
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
        :value="filter.field"
        :items="filterOptions ?? []"
        item-text="id"
        hide-details
        outlined
        dense
        placeholder="-"
        return-object
        :menu-props="{ bottom: true, offsetY: true }"
        :filter="fieldFilter"
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
    <v-btn
      class="mt-2 text-none"
      outlined
      dense
      color="primary"
      @click="addFilter"
    >
      <v-icon left>fas fa-plus</v-icon>
      {{ $t("filterBuilder.addFilter") }}
    </v-btn>
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
    totalResults: {
      type: Number,
      default: 0,
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
          {
            id: "contains",
            value: "__icontains",
            name: this.$t("lookups.contains"),
            type: "string",
          },
          {
            id: "equal",
            value: "",
            name: this.$t("lookups.equal"),
            type: "string",
          },
          {
            id: "startsWith",
            value: "__istartswith",
            name: this.$t("lookups.startsWith"),
            type: "string",
          },
          {
            id: "endswith",
            value: "__iendswith",
            name: this.$t("lookups.endsWith"),
            type: "string",
          },
          {
            id: "isNull",
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        number: [
          {
            id: "equal",
            value: "",
            name: "=",
            type: "number",
          },
          {
            id: "notEqual",
            value: "!",
            name: "!=",
            type: "number",
          },
          {
            id: "lessThan",
            value: "__lt",
            name: "<",
            type: "number",
          },
          {
            id: "lessThanEqual",
            value: "__lte",
            name: "<=",
            type: "number",
          },
          {
            id: "greaterThan",
            value: "__gt",
            name: ">",
            type: "number",
          },
          {
            id: "greaterThanEqual",
            value: "__gte",
            name: ">=",
            type: "number",
          },
          {
            id: "range",
            value: "__range",
            name: this.$t("lookups.range"),
            type: "range",
          },
          {
            id: "isNull",
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        autocomplete: [
          {
            id: "in",
            value: "__in",
            name: this.$t("lookups.in"),
            type: "autocompleteList",
          },
          {
            id: "isNull",
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        autocompleteList: [
          {
            id: "in",
            value: "__in",
            name: this.$t("lookups.in"),
            type: "autocompleteList",
          },
          {
            id: "superset",
            value: "__superset_of",
            name: this.$t("lookups.superset"),
            type: "autocompleteList",
          },
          {
            id: "isNull",
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        boolean: [
          {
            id: "equal",
            value: "",
            name: "=",
            type: "boolean",
          },
          {
            id: "isNull",
            value: "__isnull",
            name: this.$t("lookups.isNull"),
            type: "boolean",
          },
        ],
        datetime: [
          {
            id: "greaterThanEqual",
            value: "__gte",
            name: this.$t("lookups.after"),
            type: "datetime",
          },
          {
            id: "lessThanEqual",
            value: "__lte",
            name: this.$t("lookups.before"),
            type: "datetime",
          },
          {
            id: "range",
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
    fieldFilter(item, queryText, itemText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
        -1
      );
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
      if (this.filters[index].lookup.type === "autocompleteList") {
        this.filters[index].value = [];
      } else if (
        ["range", "datetimeRange"].includes(this.filters[index].lookup.type)
      ) {
        this.filters[index].value = [null, null];
      } else {
        this.filters[index].value = null;
      }
    },
    handleLookupChange(index, newLookup) {
      const isSameLookupType =
        this.filters[index].lookup.type === newLookup.type;
      this.filters[index].lookup = newLookup;

      if (isSameLookupType) return;

      if (newLookup.type === "autocompleteList") {
        this.filters[index].value = [];
      } else if (["range", "datetimeRange"].includes(newLookup.type)) {
        this.filters[index].value = [null, null];
      } else {
        this.filters[index].value = null;
      }
    },
    isNullSummary(filter) {
      if (filter.value) return this.$t("exists.true");
      return this.$t("exists.false");
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
