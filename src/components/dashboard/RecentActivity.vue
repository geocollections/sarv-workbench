<template>
  <v-row class="recent-activity">
    <!-- RECENTLY ADDED -->
    <v-col
      cols="12"
      md="6"
      v-if="recentlyInserted && recentlyInserted.length > 0"
    >
      <v-card :color="bodyColor.split('n-')[0] + 'n-5'" elevation="4">
        <v-card-title>
          <span>
            {{ $t("logs.recentlyAdded") }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="green">far fa-plus-square</v-icon>
        </v-card-title>

        <v-simple-table>
          <template v-slot:default>
            <thead :class="bodyColor.split('n-')[0] + 'n-5'">
              <tr>
                <th>ID</th>
                <th>{{ $t("logs.time") }}</th>
              </tr>
            </thead>

            <tbody :class="bodyColor.split('n-')[0] + 'n-5'">
              <tr v-for="(entity, index) in recentlyInserted" :key="index">
                <td>
                  <router-link
                    v-if="isUserAllowedTo('change', entity.table_name)"
                    class="sarv-link text-capitalize"
                    :class="bodyActiveColor + '--text'"
                    :to="{
                      path: '/' + entity.table_name + '/' + entity.row_id,
                    }"
                  >
                    {{ entity.table_name }}: {{ entity.row_id }}
                  </router-link>
                  <div v-else>{{ entity.table_name }}: {{ entity.row_id }}</div>
                </td>
                <td>
                  {{ entity.time | moment("YYYY-MM-DD HH:mm") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>

    <!-- RECENTLY UPDATED -->
    <v-col
      cols="12"
      md="6"
      v-if="recentlyUpdated && recentlyUpdated.length > 0"
    >
      <v-card :color="bodyColor.split('n-')[0] + 'n-5'" elevation="4">
        <v-card-title>
          <span>
            {{ $t("logs.recentlyUpdated") }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="orange">far fa-edit</v-icon>
        </v-card-title>

        <v-simple-table>
          <template v-slot:default>
            <thead :class="bodyColor.split('n-')[0] + 'n-5'">
              <tr>
                <th>ID</th>
                <th>{{ $t("logs.time") }}</th>
              </tr>
            </thead>

            <tbody :class="bodyColor.split('n-')[0] + 'n-5'">
              <tr v-for="(entity, index) in recentlyUpdated" :key="index">
                <td>
                  <router-link
                    v-if="isUserAllowedTo('change', entity.table_name)"
                    class="sarv-link text-capitalize"
                    :class="bodyActiveColor + '--text'"
                    :to="{
                      path: '/' + entity.table_name + '/' + entity.row_id,
                    }"
                  >
                    {{ entity.table_name }}: {{ entity.row_id }}
                  </router-link>
                  <div v-else>{{ entity.table_name }}: {{ entity.row_id }}</div>
                </td>
                <td>
                  {{ entity.time | moment("YYYY-MM-DD HH:mm") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  props: ["user", "bodyColor", "bodyActiveColor"],
  name: "recentActivity",
  data() {
    return {
      recentlyInserted: [],
      recentlyUpdated: [],
    };
  },

  computed: {
    ...mapGetters("user", ["isUserAllowedTo"]),
  },

  created: function () {
    this.getRecentlyInsertedActivities();
    this.getRecentlyUpdatedActivities();
  },
  methods: {
    async getRecentlyInsertedActivities() {
      const response = await this.$api.rw.get("log", {
        defaultParams: {
          user: this.user,
          command: "INSERT",
        },
        options: {
          sortBy: ["id"],
          sortDesc: [true],
          itemsPerPage: 10,
        },
      });
      this.recentlyInserted = response?.results ?? [];
    },

    async getRecentlyUpdatedActivities() {
      const response = await this.$api.rw.get("log", {
        defaultParams: {
          user: this.user,
          command: "UPDATE",
        },
        options: {
          sortBy: ["id"],
          sortDesc: [true],
          itemsPerPage: 10,
        },
      });
      this.recentlyUpdated = response?.results ?? [];
    },
  },
};
</script>

<style scoped>
.recent-activity td {
  height: 38px;
}
</style>
