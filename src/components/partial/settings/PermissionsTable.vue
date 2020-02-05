<template>
  <v-card flat :class="bodyColor.split('n-')[0] + 'n-5'">
    <v-card-title class="pt-0">
      <v-text-field
        v-model="search"
        append-icon="fas fa-search"
        :label="$t('settings.search')"
        single-line
        hide-details
        :color="bodyActiveColor"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="translatedHeaders"
      :items="computedPerms"
      :sort-by="['table']"
      :sort-desc="[false]"
      multi-sort
      :class="bodyColor.split('n-')[0] + 'n-5'"
      :search="search"
    >
      <template v-slot:item.table="{ item }">
        <b>{{ item.table }}</b>
      </template>

      <template v-slot:item.add_perms="{ item }">
        <v-icon v-if="item.add_perms" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.change_perms="{ item }">
        <v-icon v-if="item.change_perms" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.delete_perms="{ item }">
        <v-icon v-if="item.delete_perms" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.view_perms="{ item }">
        <v-icon v-if="item.view_perms" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "PermissionsTable",

  props: {
    perms: {
      type: Object,
      required: true
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
    headers: [
      { text: "settings.table", value: "table" },
      { text: "settings.add_perms", value: "add_perms", align: "center" },
      { text: "settings.change_perms", value: "change_perms", align: "center" },
      { text: "settings.delete_perms", value: "delete_perms", align: "center" },
      { text: "settings.view_perms", value: "view_perms", align: "center" }
    ],
    search: ""
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    },

    computedPerms() {
      if (typeof this.perms !== "undefined" && this.perms !== null) {
        return Object.entries(this.perms).map(perm => {
          return {
            table: perm[0],
            add_perms: !!perm[1][0],
            change_perms: !!perm[1][1],
            delete_perms: !!perm[1][2],
            view_perms: !!perm[1][3]
          };
        });
      } else return [];
    }
  }
};
</script>

<style scoped></style>
