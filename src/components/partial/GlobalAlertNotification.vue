<template>
  <v-alert
    v-if="showAlert"
    type="info"
    elevation="8"
    style="z-index: 3"
    dismissible
    close-icon="fas fa-times"
    >{{ alertText }}</v-alert
  >
</template>

<script>
export default {
  name: "GlobalAlertNotification",
  data: () => ({
    showAlert: true,
    alertText:
      "Toimuvad serveri hooldustööd, rakenduse kasutamine on häiritud 10.01.2021 ajavahemikus 21:00 - 23:00."
  }),
  methods: {
    //  Todo: Get info from web_pages or web_news table
  }
};
</script>

<style scoped></style>
