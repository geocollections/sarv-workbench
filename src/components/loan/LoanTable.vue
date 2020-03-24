<template>
  <v-data-table
    class="loan-table"
    :headers="translatedHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/loan/' + item.id }"
        :title="$t('editLoan.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.loan_number="{ item }">
      <router-link
        :to="{ path: '/loan/' + item.id }"
        :title="$t('editLoan.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.loan_number }}
      </router-link>
    </template>

    <template v-slot:item.borrower="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.borrower }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.borrower__agent }}
      </router-link>
    </template>

    <template v-slot:item.returned="{ item }">
      <v-icon v-if="item.returned" small color="green">fas fa-check</v-icon>
      <v-icon v-else small color="red">fas fa-minus</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "LoanTable",
  props: {
    response: {
      type: Object
    },
    filter: {
      type: String,
      required: false
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25
        };
      }
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "common.id", value: "id" },
      { text: "loan.loan_number", value: "loan_number" },
      { text: "loan.borrower", value: "borrower" },
      { text: "loan.project", value: "project" },
      { text: "loan.date_start", value: "date_start" },
      { text: "loan.date_end", value: "date_end" },
      { text: "loan.returned", value: "returned", align: "center" },
      { text: "loan.database", value: "database", align: "center" }
    ],
    names: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  }
};
</script>

<style scoped>
.loan-table.v-data-table td,
.loan-table.v-data-table th {
  padding: 0 8px;
}
</style>
