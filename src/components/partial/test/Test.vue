<template>
  <div class="test mt-1">
    <v-card elevation="4" :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-card-title class="pt-2 pb-1">Test interface</v-card-title>

      <v-card-text
        >You can find me from
        <code>src/components/partial/test/Test.vue</code></v-card-text
      >
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Test",
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"])
  }
};
</script>

<style scoped></style>
