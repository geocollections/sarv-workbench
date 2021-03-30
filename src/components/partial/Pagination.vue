<template>
  <div
    v-if="count > 0"
    class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none"
  >
    <div class="mr-3 mb-md-0 mb-3 align-self-center">
      <v-select
        :value="paginateBy"
        :color="bodyActiveColor"
        dense
        :items="options"
        :item-color="bodyActiveColor"
        label="Paginate by"
        hide-details
        @change="$emit('update:paginateBy', $event)"
      />
    </div>

    <div>
      <v-pagination
        :value="page"
        :color="bodyActiveColor"
        circle
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :length="Math.ceil(count / paginateBy)"
        :total-visible="5"
        @input="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    count: {
      type: Number
    },
    paginateBy: {
      type: Number
    },
    bodyActiveColor: {
      type: String
    },
    options: {
      type: Array
    },
    page: {
      type: Number
    }
  }
};
</script>

<style scoped></style>
