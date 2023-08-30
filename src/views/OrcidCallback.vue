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
import authenticationMixin from "../mixins/authenticationMixin";
export default {
  name: "OrcidCallback",
  mixins: [authenticationMixin],
  async mounted() {
    if (!this.$route.query.code) {
      this.$router.replace("/");
    }
    const res = await this.authenticate("orcid", this.$route.query.code);

    if (res.status === 400) {
      if (
        res.data.non_field_errors.includes(
          "User is already registered with this e-mail address."
        )
      ) {
        this.toastError({
          text: "User with this e-mail address already exists. Login using another method and connect the Orcid account using the settings menu.",
        });
        this.$router.replace("/");
        return;
      }
      this.toastError({
        text: "Something went wrong",
      });
      this.$router.replace("/");
    } else if (res.status !== 200) {
      this.toastError({
        text: "Something went wrong",
      });
      this.$router.replace("/");
    }
  },
};
</script>
