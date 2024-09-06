<template>
  <div class="admin">
    <div class="row mt-4">
      <div class="col">
        <p class="table-title mb-2">{{ $t("header.admin") }}</p>
      </div>
    </div>

    <!-- ACTIVE USERS -->
    <v-card
      v-if="activeUsers"
      class="mt-2"
      id="block-colors"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.activeUsers = !block.activeUsers"
        >
          <span
            >{{ $t("admin.activeUsers") }}: <b>{{ activeUsers.count }}</b></span
          >
          <v-icon right>fas fa-paint-roller</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.activeUsers = !block.activeUsers"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.colors ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.activeUsers" class="px-1 pt-1 pb-2">
          <v-simple-table dense fixed-header height="300px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">{{ $t("admin.user") }}</th>
                  <th class="text-left">{{ $t("admin.session_start") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entity in activeUsers.results" :key="entity.id">
                  <td class="font-weight-bold">{{ entity.user }}</td>
                  <td>
                    {{ entity.session_start | dayjs("MMMM Do YYYY HH:mm") }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import formSectionsMixin from "../mixins/formSectionsMixin";

export default {
  name: "Admin",

  mixins: [formSectionsMixin],

  data() {
    return {
      block: {
        activeUsers: true,
      },
    };
  },

  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),

    ...mapState("admin", ["activeUsers"]),
  },

  created() {
    this.fetchActiveUsers();
  },

  methods: {
    ...mapActions("admin", ["fetchActiveUsers"]),
  },
};
</script>

<style scoped>
.table-title {
  font-size: 2rem;
  font-weight: 600;
}
</style>
