<template>
  <div>
    <v-chip
      v-for="(filter, index) in filters"
      color="warning"
      class="mr-1 mb-1"
      outlined
      close
      :key="index"
      @click="handleValueClick(filter)"
      @click:close="handleValueRemove(filter)"
    >
      <v-avatar left>
        <v-icon small>
          {{ filterTypeIconMap[filter.lookup.type] }}
        </v-icon>
      </v-avatar>
      <span class="grey--text text--darken-2"> {{ filter.field.name }} </span>
      <span class="ml-1 font-weight-bold black--text">
        {{ filter.lookup.summaryFunc(filter) }}
      </span>
    </v-chip>
    <v-chip
      v-if="filters.length > 0"
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
        datetimeRange: "fas fa-clock",
      };
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
