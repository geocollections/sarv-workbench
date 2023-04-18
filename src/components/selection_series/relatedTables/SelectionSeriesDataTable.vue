<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="headers"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
    :disable-sort="!$route.meta.isEdit || response.results.length === 0"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-center">
          <router-link
            :to="{ path: `/${object}/${item[object]}` }"
            class="sarv-link"
            :title="
              $t(
                `edit${
                  object.charAt(0).toUpperCase() + object.slice(1)
                }.editMessage`
              )
            "
            :class="`${bodyActiveColor}--text`"
            >{{ item[object] }}</router-link
          >
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SelectionSeriesDataTable",

  props: {
    response: {
      type: Object,
    },
    headers: {
      type: Array,
    },
    object: {
      type: String,
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
};
</script>

<style scoped />
