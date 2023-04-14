<template>
  <v-main>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col class="text-center">
          <div class="d-inline-block text-center">
            <v-progress-circular
              indeterminate
              :size="128"
              color="#ff5722"
              :width="6"
            />
            <div class="mt-4 text-h6">{{ $t("login.progressOrcid") }}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";
import authenticationMixin from "../mixins/authenticationMixin";
export default {
  name: "OrcidCallback",
  mixins: [authenticationMixin],
  mounted() {
    if (!this.$route.query.code) {
      this.$router.replace("/");
    }
    this.authenticate("orcid", this.$route.query.code);
  },
};
</script>
