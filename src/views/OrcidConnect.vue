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
            <div class="mt-4 text-h6">
              {{ $t("login.connectingOrcid") }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";
import toastMixin from "../mixins/toastMixin.js";
export default {
  name: "OrcidConnect",
  mixins: [toastMixin],
  async mounted() {
    if (!this.$route.query.code) {
      this.$router.replace("/");
    }
    const res = await axios.post(
      "https://rwapi.geoloogia.info/accounts/dj-rest-auth/orcid/connect/",
      { code: this.$route.query.code }
    );
    if (res.status !== 200) {
      this.toastError({ text: this.$t("messages.loginError") });
    } else {
      this.toastSuccess({ text: this.$t("messages.orcidConnectSuccess") });
      this.$router.replace("/");
    }
  },
};
</script>
