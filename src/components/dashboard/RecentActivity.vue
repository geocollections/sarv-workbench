<template>
  <v-row class="recent-activity">
    <!-- RECENTLY ADDED -->
    <v-col cols="12" md="6" class="mb-6">
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
                      path: '/' + entity.table_name + '/' + entity.row_id
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
    <v-col cols="12" md="6">
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
                      path: '/' + entity.table_name + '/' + entity.row_id
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
import { fetchLatestLogs } from "@/assets/js/api/apiCalls";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  props: ["user", "bodyColor", "bodyActiveColor"],
  name: "recentActivity",
  data() {
    return {
      recentlyInserted: [],
      recentlyUpdated: []
    };
  },

  computed: {
    ...mapGetters("user", ["isUserAllowedTo"])
  },

  created: function() {
    this.getRecentlyInsertedActivities();
    this.getRecentlyUpdatedActivities();
  },
  methods: {
    getRecentlyInsertedActivities() {
      fetchLatestLogs({
        user: this.user,
        command: "INSERT"
      }).then(response => {
        if (response.status === 200) {
          if (response.data.count > 0) {
            this.recentlyInserted = response.data.results;
          } else {
            this.recentlyInserted = [];
          }
        }
      });
    },

    getRecentlyUpdatedActivities() {
      fetchLatestLogs({
        user: this.user,
        command: "UPDATE"
      }).then(response => {
        if (response.status === 200) {
          if (response.data.count > 0) {
            this.recentlyUpdated = response.data.results;
          } else {
            this.recentlyUpdated = [];
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.recent-activity td {
  height: 38px;
}
</style>
