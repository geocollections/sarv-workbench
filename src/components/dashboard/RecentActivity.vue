<template>
  <v-row class="recent-activity">
    <!-- RECENTLY ADDED -->
    <v-col cols="12" md="6" class="mb-6">
      <v-card :color="bodyColor.split('-')[0] + '-5'" elevation="4">
        <v-card-title>
          <span>
            {{ $t("logs.recentlyAdded") }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="green">far fa-plus-square</v-icon>
        </v-card-title>

        <v-simple-table>
          <template v-slot:default>
            <thead :class="bodyColor.split('-')[0] + '-5'">
              <tr>
                <th>ID</th>
                <th>{{ $t("logs.time") }}</th>
              </tr>
            </thead>

            <tbody :class="bodyColor.split('-')[0] + '-5'">
              <tr v-for="(entity, index) in recentlyInserted" :key="index">
                <td>
                  <v-btn
                    text
                    :color="bodyActiveColor"
                    :to="{
                      path: '/' + entity.table_name + '/' + entity.row_id
                    }"
                  >
                    {{ entity.table_name }}: {{ entity.row_id }}
                  </v-btn>
                </td>
                <td>{{ entity.time | moment("DD.MM.YYYY | HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>

    <!-- RECENTLY UPDATED -->
    <v-col cols="12" md="6">
      <v-card :color="bodyColor.split('-')[0] + '-5'" elevation="4">
        <v-card-title>
          <span>
            {{ $t("logs.recentlyUpdated") }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="orange">far fa-edit</v-icon>
        </v-card-title>

        <v-simple-table>
          <template v-slot:default>
            <thead :class="bodyColor.split('-')[0] + '-5'">
              <tr>
                <th>ID</th>
                <th>{{ $t("logs.time") }}</th>
              </tr>
            </thead>

            <tbody :class="bodyColor.split('-')[0] + '-5'">
              <tr v-for="(entity, index) in recentlyUpdated" :key="index">
                <td>
                  <v-btn
                    text
                    :color="bodyActiveColor"
                    :to="{
                      path: '/' + entity.table_name + '/' + entity.row_id
                    }"
                  >
                    {{ entity.table_name }}: {{ entity.row_id }}
                  </v-btn>
                </td>
                <td>{{ entity.time | moment("DD.MM.YYYY | HH:mm:ss") }}</td>
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

export default {
  props: ["user", "bodyColor", "bodyActiveColor"],
  name: "recentActivity",
  data() {
    return {
      recentlyInserted: [],
      recentlyUpdated: []
    };
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
          if (response.body.count > 0) {
            this.recentlyInserted = response.body.results;
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
          if (response.body.count > 0) {
            this.recentlyUpdated = response.body.results;
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
