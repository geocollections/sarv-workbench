<template>
  <div>
    <v-chip
      v-for="(value, index) in activeFilterValues"
      color="warning"
      class="mr-1 mb-1"
      outlined
      close
      :key="index"
      @click="handleValueClick(value)"
      @click:close="handleValueRemove(value)"
    >
      <v-avatar left>
        <v-icon small>
          {{ filterTypeIconMap[value.filter.lookup.type] }}
        </v-icon>
      </v-avatar>
      {{ value.filter.field.name }}:
      <span class="ml-1 font-weight-bold">{{ value.value }}</span>
    </v-chip>
    <v-chip
      v-if="activeFilterValues.length > 0"
      text
      rounded
      color="transparent"
      class="mb-1 text-capitalize"
      @click="handleClear"
    >
      Clear
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "FilterSummary",
  props: {
    filters: {
      type: Array,
      required: true,
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
    activeFilterValues() {
      return this.filters.reduce((acc, filter, index) => {
        if (
          !filter.enabled ||
          filter.field === null ||
          filter.lookup === null ||
          filter.value === null ||
          filter.value.length < 1 ||
          (Array.isArray(filter.value) && filter.value.includes(null))
        ) {
          return acc;
        }
        if (filter.lookup.type === "autocomplete") {
          if (Array.isArray(filter.value)) {
            acc.push({
              filter,
              filterIndex: index,
              value: filter.value
                .map((value) => value[filter.field.itemText])
                .join(", "),
            });
          } else if (filter.value !== null) {
            acc.push({
              filter,
              filterIndex: index,
              value: filter.value[filter.field.itemText],
            });
          }
          return acc;
        }
        if (filter.lookup.type === "autocompleteList") {
          if (Array.isArray(filter.value)) {
            acc.push({
              filter,
              filterIndex: index,
              value: filter.value
                .map((value) => `"${value[filter.field.itemText]}"`)
                .join(filter.lookup.value === "__in" ? " | " : " & "),
            });
          } else if (filter.value !== null) {
            acc.push({
              filter,
              filterIndex: index,
              value: filter.value[filter.field.itemText],
            });
          }
          return acc;
        }
        if (filter.lookup.type === "range") {
          acc.push({
            filter,
            filterIndex: index,
            value: `${filter.value[0] ?? "*"} - ${filter.value[1] ?? "*"}`,
          });
          return acc;
        }
        acc.push({ filter, filterIndex: index, value: filter.value });
        return acc;
      }, []);
    },
  },
  methods: {
    handleValueRemove(removableValue) {
      this.$emit("remove:filter", { filterIndex: removableValue.filterIndex });
    },
    handleValueClick(value) {
      this.$emit("click:value", value);
    },
    handleClear() {
      this.$emit("clear");
    },
  },
};
</script>
