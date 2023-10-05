<template>
  <div class="d-inline-flex justify-end">
    <div class="d-inline-flex align-center mr-2 mr-sm-3" style="flex: 0 0 0">
      <v-select
        class="mt-0 text-caption"
        style="max-width: 100px"
        dense
        outlined
        hide-details
        :items="itemsPerPageOptions"
        :value="paginateBy"
        :menu-props="{ bottom: true, offsetY: true, zIndex: 4 }"
        @change="changeRowsPerPage"
      />
    </div>
    <div class="justify-end my-1 d-inline-flex align-center">
      <v-btn :disabled="page === 1" icon @click="first">
        <v-icon>fas fa-step-backward</v-icon>
      </v-btn>
      <v-btn :disabled="page === 1" icon @click="previous">
        <v-icon>fas fa-chevron-left</v-icon>
      </v-btn>
      <!-- NOTE: Template activator based menu is not visible on page load. For more info look at note in BaseDataTableHeaderMenu.vue -->
      <v-menu offset-y :close-on-content-click="false" z-index="4">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            small
            text
            class="text-no-wrap text-caption"
            v-on="on"
          >
            {{ pageText }}
          </v-btn>
        </template>
        <v-card class="px-2 py-2 d-flex align-center">
          <div class="mr-2 text-no-wrap text-caption">{{ goToText }}</div>
          <v-text-field
            ref="go-to-field"
            class="mt-0 text-caption"
            style="width: 64px"
            dense
            hide-details
            :value="goToValue"
            type="number"
            :rules="[pageLimitRule]"
            @keyup.enter="selectPage"
            @input="setGoToValue"
          >
          </v-text-field>
          <v-btn
            :disabled="!pageLimitRule(goToValue)"
            class="px-2 ml-2"
            small
            text
            @click="selectPage"
          >
            {{ goToButtonText }}
            <v-icon small>fas fa-chevron-right</v-icon>
          </v-btn>
        </v-card>
      </v-menu>
      <v-btn :disabled="page === pageCount" icon @click="next">
        <v-icon>fas fa-chevron-right</v-icon>
      </v-btn>
      <v-btn :disabled="page === pageCount" icon @click="last">
        <v-icon>fas fa-step-forward</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: "DataTablePagination",
  props: {
    count: {
      type: Number,
      default: 0,
    },
    paginateBy: {
      type: Number,
      default: 25,
    },
    page: {
      type: Number,
      default: 0,
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [],
    },
    itemsPerPageText: {
      type: String,
      default: "Items per page",
    },
    pageSelectText: {
      type: String,
      default: `Page 0 / 0`,
    },
    goToText: {
      type: String,
      default: "Go to page",
    },
    goToButtonText: {
      type: String,
      default: "Go",
    },
    selectPageId: {
      type: String,
      default: "page-select-btn",
    },
  },
  data() {
    return {
      goToValue: NaN,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.count / this.paginateBy);
    },
    pageText() {
      return this.$t("common.pageSelect", {
        current: this.page,
        count: this.pageCount,
      }).toString();
    },
  },
  methods: {
    setGoToValue(e) {
      if (isNaN(e)) this.goToValue = e;
      else this.goToValue = parseInt(e);
    },
    selectPage() {
      if (this.$refs["go-to-field"].validate(true)) {
        this.$emit("update:page", this.goToValue);
        this.goToValue = NaN;
      }
    },
    next() {
      this.$emit("update:page", this.page + 1);
    },
    previous() {
      this.$emit("update:page", this.page - 1);
    },
    first() {
      this.$emit("update:page", 1);
    },
    last() {
      this.$emit("update:page", this.pageCount);
    },
    changeRowsPerPage(e) {
      this.$emit("update:paginateBy", e);
    },
    pageLimitRule(value) {
      if (isNaN(value)) return false;
      if (parseInt(value) < 1) return false;
      if (parseInt(value) > this.pageCount) return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
// Removes arrows from number input
/* Chrome, Safari, Edge, Opera */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
</style>
