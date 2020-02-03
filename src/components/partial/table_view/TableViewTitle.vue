<template>
  <v-row class="d-print-none">
    <v-col>
      <span class="table-title">
        {{ $t(title) }}
      </span>
    </v-col>
    <v-col class="text-right" align-self="center">
      <v-btn
        :to="{ path: buttonPath }"
        :color="appSettings.bodyActiveColor"
        :dark="appSettings.bodyActiveColorDark"
      >
        {{ $t("add.new") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TableViewTitle",
  props: {
    title: {
      type: String,
      required: true
    },
    buttonPath: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["appSettings"])
  }
};
</script>

<style scoped>
.table-title {
  font-size: 2rem;
  font-weight: 500;
}
</style>
