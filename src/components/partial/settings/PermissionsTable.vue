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

      <template v-slot:item.add="{ item }">
        <v-icon v-if="item.add" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.change="{ item }">
        <v-icon v-if="item.change" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.delete="{ item }">
        <v-icon v-if="item.delete" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.view="{ item }">
        <v-icon v-if="item.view" color="green" small>fas fa-check</v-icon>
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
      type: Array,
      required: true,
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

  data: () => ({
    headers: [
      { text: "settings.table", value: "table" },
      { text: "settings.add_perms", value: "add", align: "center" },
      { text: "settings.change_perms", value: "change", align: "center" },
      { text: "settings.delete_perms", value: "delete", align: "center" },
      { text: "settings.view_perms", value: "view", align: "center" },
    ],
    search: "",
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },

    computedPerms() {
      return this.perms.reduce((prev, curr) => {
        const action = curr.codename.split("_")[0];
        const table = curr.codename.split("_")[1];

        const tablePerms = prev.find((item) => item.table === table);

        if (tablePerms) tablePerms[action] = true;
        else
          prev.push({
            table,
            [action]: true,
          });
        return prev;
      }, []);
    },
  },
};
</script>

<style scoped></style>
