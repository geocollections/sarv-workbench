<template>
  <v-alert
    class="DevNotification"
    type="info"
    color="secondary"
    elevation="8"
    style="z-index: 3"
    close-icon="fas fa-times"
    border="right"
    dense
    :outlined="!$route.meta.isLogin"
    :dismissible="!$route.meta.isLogin"
  >
    <div v-if="$route.meta.isLogin && isProductionUrl">
      <span v-html="$t('messages.prodNotification')" />
      <a
        href="https://edit2.geocollections.info"
        :class="{ [`${bodyActiveColor}--text`]: !$route.meta.isLogin }"
        class="font-weight-bold"
        title="https://edit2.geocollections.info"
        >edit2.geocollections.info</a
      >
    </div>

    <div v-else-if="!isProductionUrl">
      <span v-html="$t('messages.devNotification')" />
      <a
        href="https://edit.geocollections.info"
        :class="{ [`${bodyActiveColor}--text`]: !$route.meta.isLogin }"
        class="font-weight-bold"
        title="https://edit.geocollections.info"
        >edit.geocollections.info</a
      >
    </div>
  </v-alert>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DevNotification",
  computed: {
    ...mapState("settings", ["bodyActiveColor"]),

    isProductionUrl() {
      return document.location.hostname.startsWith("edit.");
    }
  }
};
</script>

<style scoped>
.DevNotification >>> .v-icon {
  align-self: center;
}

a {
  transition: opacity 200ms ease-out;
  opacity: 1;
}

a:hover {
  transition: opacity 200ms ease-in;
  opacity: 0.7;
}
</style>
