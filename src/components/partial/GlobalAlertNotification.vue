<template>
  <div v-if="page && page.public" style="z-index: 3">
    <v-alert
      v-if="globalNotificationState"
      type="info"
      elevation="8"
      style="z-index: 3"
      dismissible
      close-icon="fas fa-times"
      @input="toggleGlobalNotification"
    >
      <div v-html="pageTranslated" />
    </v-alert>

    <div
      v-else
      class="d-flex justify-end mb-1"
      :class="{ 'mb-2': $route.meta.isLogin }"
    >
      <div
        style="z-index: 3"
        class="align-self-center mr-3 text-link"
        :class="{ 'login-view-text': $route.meta.isLogin }"
        @click="toggleGlobalNotification"
      >
        {{ $t("messages.globalNotificationIsAvailable") }}
      </div>

      <v-btn
        style="z-index: 3"
        color="white"
        class="info"
        icon
        @click="toggleGlobalNotification"
        elevation="4"
      >
        <v-icon>fas fa-info</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import StaticPageService from "@/middleware/StaticPageService";
import { mapActions, mapState } from "vuex";

export default {
  name: "GlobalAlertNotification",
  data: () => ({
    pageId: 77,
    page: null,
  }),
  computed: {
    ...mapState("settings", ["globalNotificationState"]),

    pageTranslated() {
      return this.$i18n.locale === "ee"
        ? this.page.content_et
        : this.page.content_en;
    },
  },
  created() {
    this.getNotificationData();
  },
  watch: {
    "$route.path"() {
      this.getNotificationData();
    },
  },
  methods: {
    ...mapActions("settings", ["toggleGlobalNotification"]),

    async getNotificationData() {
      let response = await StaticPageService.getPage(this.pageId);
      if (response && response?.results?.[0]) this.page = response.results[0];
    },
  },
};
</script>

<style scoped>
.text-link {
  transition: color 100ms ease-out;
}

.text-link:hover {
  transition: color 100ms ease-in;
  color: #2196f3;
  cursor: pointer;
}

.login-view-text {
  font-weight: 600;
  color: #fff;
}
</style>
