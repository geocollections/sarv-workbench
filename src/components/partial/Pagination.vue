<template>
  <div
    class="
      d-flex
      flex-column
      justify-space-around
      flex-md-row
      justify-md-space-between
      px-4
      pt-2
      pb-1
      d-print-none
    "
  >
    <div class="my-1 my-md-0">
      <v-select
        :value="itemsPerPage"
        :color="bodyActiveColor"
        dense
        :items="paginateByOptionsTranslated"
        :item-color="bodyActiveColor"
        label="Items per page"
        hide-details
        @change="
          $emit('update:options', { value: $event, key: 'itemsPerPage' })
        "
      />
    </div>

    <div class="my-1 my-md-0">
      <v-pagination
        :value="page"
        :color="bodyActiveColor"
        circle
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :length="paginationLength"
        total-visible="5"
        @input="$emit('update:options', { value: $event, key: 'page' })"
      />
    </div>
  </div>
</template>

<script>
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Pagination",
  mixins: [globalUtilsMixin],
  props: {
    count: {
      type: Number,
    },
    itemsPerPage: {
      type: Number,
    },
    page: {
      type: Number,
    },
    bodyActiveColor: {
      type: String,
    },
  },
  computed: {
    paginationLength() {
      return Math.ceil(this.count / this.itemsPerPage);
    },
  },
};
</script>
