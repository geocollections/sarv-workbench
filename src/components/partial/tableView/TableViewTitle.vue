<template>
  <v-row class="table-view-title d-print-none">
    <v-col>
      <span class="table-title">
        {{ $t(title) }}
      </span>
    </v-col>
    <v-col class="text-right" align-self="center">
      <v-btn :to="{ path: buttonPath }" color="deep-orange" dark>
        {{ $t("add.new") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
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
  }
};
</script>

<style scoped>
.table-view-title {
  border-bottom: 1px solid #607d8b;
}
.table-title {
  font-size: 2rem;
  font-weight: 500;
}
</style>
