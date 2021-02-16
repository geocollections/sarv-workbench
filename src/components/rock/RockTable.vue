<template>
  <v-data-table
    class="rock-table"
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
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/rock/' + item.id }"
        :title="$t('editRock.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.formula_html="{ item }">
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else-if="item.formula">{{ item.formula }}</div>
    </template>

    <template v-slot:item.rock_type="{ item }">
      <div
        v-translate="{ et: item.rock_type__name, et: item.rock_type__name_en }"
      />
    </template>

    <template v-slot:item.rock_rank="{ item }">
      <div
        v-translate="{ et: item.rock_rank__name, et: item.rock_rank__name_en }"
      />
    </template>

    <template v-slot:item.in_estonia="{ item }">
      <v-icon v-if="item.in_estonia" color="green" small>fas fa-check</v-icon>
      <v-icon v-else color="red" small>fas fa-times</v-icon>
    </template>

    <template v-slot:item.in_portal="{ item }">
      <v-icon v-if="item.in_portal" color="green" small>fas fa-check</v-icon>
      <v-icon v-else color="red" small>fas fa-times</v-icon>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        :href="getRockUrl(item.id)"
        :title="getRockUrl(item.id)"
        :color="bodyActiveColor"
        target="RockWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.mindat_id="{ item }">
      <v-btn
        :href="getMindatUrl(item.mindat_id)"
        :title="getMindatUrl(item.mindat_id)"
        :color="bodyActiveColor"
        target="RockWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "RockTable",
  mixins: [tableHeaderMixin],
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
      { text: "rock.name", value: "name" },
      { text: "rock.name_en", value: "name_en" },
      { text: "rock.formula_html", value: "formula_html" },
      { text: "rock.rock_type", value: "rock_type" },
      { text: "rock.rock_rank", value: "rock_rank" },
      { text: "rock.in_estonia", value: "in_estonia" },
      { text: "rock.in_portal", value: "in_portal" },
      { text: "rock.kivid_info", value: "link", sortable: false },
      { text: "rock.mindat", value: "mindat_id" }
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
  },
  methods: {
    getRockUrl(id) {
      if (id) return `https://kivid.info/${id}`;
      else return null;
    },

    getMindatUrl(mindatId) {
      if (mindatId) return `https://www.mindat.org/min-${mindatId}.html`;
      else return null;
    }
  }
};
</script>

<style scoped>
.rock-table.v-data-table td,
.rock-table.v-data-table th {
  padding: 0 8px;
}
</style>
