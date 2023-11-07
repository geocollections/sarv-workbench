<template>
  <div>
    <v-chip
      v-for="(filter, index) in filters"
      color="deep-orange"
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
        {{ summaryFns[filter.lookup.type][filter.lookup.id](filter) }}
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
    summaryFns() {
      return {
        string: {
          contains: (filter) => `..${filter.value}..`,
          startsWith: (filter) => `${filter.value}..`,
          endsWith: (filter) => `..${filter.value}`,
          isNull: this.isNullSummary,
        },
        number: {
          equal: (filter) => `= ${filter.value}`,
          notEqual: (filter) => `!= ${filter.value}`,
          lessThan: (filter) => `< ${filter.value}`,
          lessThanEqual: (filter) => `<= ${filter.value}`,
          greaterThan: (filter) => `> ${filter.value}`,
          greaterThanEqual: (filter) => `>= ${filter.value}`,
          range: (filter) => this.$t("filterSummary.between", filter.value),
          isNull: this.isNullSummary,
        },
        autocomplete: {
          in: (filter) => {
            if (filter.value.length > 3)
              return this.$t("filterSummary.inNumberic", {
                count: filter.value.length,
              });
            return this.$t("filterSummary.in", {
              value: filter.value
                .map((value) => `"${value[filter.field.itemText]}"`)
                .join(", "),
            });
          },
          isNull: this.isNullSummary,
        },
        autocompleteList: {
          in: (filter) => {
            if (filter.value.length > 3)
              return this.$t("filterSummary.inNumberic", {
                count: filter.value.length,
              });
            return this.$t("filterSummary.in", {
              value: filter.value
                .map((value) => `"${value[filter.field.itemText]}"`)
                .join(", "),
            });
          },
          superset: (filter) => {
            if (filter.value.length > 3)
              return this.$t("filterSummary.includesNumberic", {
                count: filter.value.length,
              });
            return this.$t("filterSummary.includes", {
              value: filter.value
                .map((value) => `"${value[filter.field.itemText]}"`)
                .join(", "),
            });
          },
          isNull: this.isNullSummary,
        },
        boolean: {
          equal: (filter) => {
            if (filter.value) return this.$t("boolean.true");
            return this.$t("boolean.false");
          },
          isNull: this.isNullSummary,
        },
        datetime: {
          greaterThanEqual: (filter) =>
            this.$t("filterSummary.after", {
              date: new Date(filter.value).toLocaleString(),
            }),
          lessThanEqual: (filter) =>
            this.$t("filterSummary.before", {
              date: new Date(filter.value).toLocaleString(),
            }),
          range: (filter) => {
            return this.$t(
              "filterSummary.between",
              filter.value.map((value) => new Date(value).toLocaleString())
            );
          },
        },
      };
    },
  },
  methods: {
    isNullSummary(filter) {
      if (filter.value) return this.$t("exists.true");
      return this.$t("exists.false");
    },
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
