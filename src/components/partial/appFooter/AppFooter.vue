<template>
  <v-footer
    class="footer"
    :class="{ 'bottom-options-margin': isEditOrAddView }"
    color="blue darken-4"
    dark
  >
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" class="text-center pb-1">
        <v-img
          alt="SARV logo"
          :src="require('../../../assets/img/sarv_logo.png')"
          max-height="60"
          max-width="175"
          style="margin: 0 auto"
        ></v-img>
      </v-col>
      <v-col cols="12">
        <a
          href="https://natarc.ut.ee"
          title="https://natarc.ut.ee"
          target="FooterWindow"
          class="footer-link"
          >NATARC</a
        >
        <span> 2018-2019. {{ $t("footer.info") }}, </span>
        <a
          href="mailto:olle.hints@taltech.ee"
          title="Send mail"
          class="footer-link"
          >olle.hints@taltech.ee</a
        >
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
  computed: {
    isEditOrAddView() {
      return typeof this.$route.meta.isEdit !== "undefined";
    }
  }
};
</script>

<style scoped>
.footer {
  font-size: 0.7rem;
  text-align: center;
}

.bottom-options-margin {
  margin-bottom: 56px;
}

.footer-link {
  color: #ff5722;
}

.footer-link:hover {
  opacity: 0.8;
}
</style>
