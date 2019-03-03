<template>
  <div class="recent-activity">

    <div class="row recent">

      <!-- RECENTLY ADDED -->
      <div class="col-lg-6">

        <p class="h4">Recently Added:</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>Time</th>

            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in recentlyInserted">
              <td>
                <router-link :to="{ path: '/' + entity.table_name + '/' + entity.row_id }">
                  <b>{{ entity.row_id }} ({{ entity.table_name }})</b>
                </router-link>
              </td>
              <td>{{ entity.time | moment('DD.MM.YYYY | HH:mm:ss')}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>


      <!-- RECENTLY CHANGED -->
      <div class="col-lg-6">

        <p class="h4">Recently Updated:</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Muutused</th>

            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in recentlyUpdated">
              <td>
                <router-link :to="{ path: '/' + entity.table_name + '/' + entity.row_id }">
                  <b>{{ entity.row_id }} ({{ entity.table_name }})</b>
                </router-link>
              </td>
              <td>{{ entity.time | moment('DD.MM.YYYY | HH:mm:ss')}}</td>
              <td style="max-width: 25rem; padding:0.3rem; margin: 0;">
                <div style="height: 3rem !important; overflow: auto;">
                  {{ entity.changes }}
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import { fetchLatestLogs } from "@/assets/js/api/apiCalls";

  export default {
    props: ['user'],
    name: "recentActivity",
    data() {
      return {
        recentlyInserted: [],
        recentlyUpdated: [],
      }
    },

    created: function () {
      this.getRecentlyInsertedActivities()
      this.getRecentlyUpdatedActivities()
    },
    methods: {
      getRecentlyInsertedActivities() {
        fetchLatestLogs({
          user: this.user,
          command: 'INSERT'
        }).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.recentlyInserted = response.body.results;
            } else {
              this.recentlyInserted = []
            }
          }
        }, errResponse => {})
      },

      getRecentlyUpdatedActivities() {
        fetchLatestLogs({
          user: this.user,
          command: 'UPDATE'
        }).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.recentlyUpdated = response.body.results;
            } else {
              this.recentlyUpdated = []
            }
          }
        }, errResponse => {})
      },
    }
  }
</script>

<style scoped>
.recent {
  font-size: 0.8em;
}
</style>
