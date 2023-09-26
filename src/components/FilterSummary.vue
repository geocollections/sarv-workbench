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
    <v-btn
      v-if="activeFilterValues.length > 0"
      text
      rounded
      class="mb-1 text-capitalize"
      @click="handleClear"
    >
      Clear
    </v-btn>
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
            for (const [valueIndex, value] of filter.value.entries()) {
              acc.push({
                filter,
                filterIndex: index,
                valueIndex,
                value: value[filter.field.itemText],
              });
            }
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
      if (removableValue.valueIndex) {
        this.filters[removableValue.filterIndex].value.splice(
          removableValue.valueIndex,
          1
        );
      } else {
        this.filters[removableValue.filterIndex].value = null;
      }
    },
    handleValueClick(value) {
      this.$emit("click:value", value);
    },
    handleClear() {
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].lookup.type === "autocomplete") {
          if (Array.isArray(this.filters[i].value)) {
            this.filters[i].value = [];
          } else {
            this.filters[i].value = null;
          }
        } else if (this.filters[i].lookup.typpe === "range") {
          this.filters[i].value = [null, null];
        }
        this.filters[i].value = null;
      }
    },
  },
};
</script>
