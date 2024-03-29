<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.print="{ item }">
      <v-btn
        @click="openLoanPrintView(item.id)"
        :title="$t('editLoan.printMessage')"
        :class="`${bodyActiveColor}--text`"
        icon
        small
      >
        <v-icon small>fas fa-print</v-icon>
      </v-btn>
    </template>

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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "LoanTable",
  mixins: [tableHeaderMixin],
  props: {
    response: {
      type: Object,
    },
    filter: {
      type: String,
      required: false,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          paginateBy: 25,
        };
      },
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },
  methods: {
    openLoanPrintView(id) {
      let routeData = this.$router.resolve({
        path: "/loan_print/" + id,
      });
      window.open(routeData.href, "LoanPrintWindow", "width=800,height=750");
    },
  },
};
</script>
