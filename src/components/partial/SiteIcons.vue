<template>
  <div class="site-icons d-flex justify-center">
    <v-btn
      v-for="site in sites"
      :key="site.key"
      :class="classObject"
      tile
      depressed
      :ripple="false"
      color="transparent"
      height="max-content"
      width="max-content"
      :href="site.url"
      target="window"
    >
      <v-img
        :height="site.height"
        :width="site.width"
        contain
        :src="site.icon"
      ></v-img>
    </v-btn>
  </div>
</template>

<script>
import NATARCLogo from "../../assets/img/NATARC_transparent.png";
import sarvLogo from "../../assets/img/sarv_logo.svg";
export default {
  name: "SiteIcons",
  computed: {
    classObject() {
      return {
        "align-self-center": true,
        "pa-2": true,
        "d-block": this.$vuetify.breakpoint.xsOnly,
        "d-sm-none": this.$vuetify.breakpoint.xsOnly,
      };
    },
    getHeight() {
      return this.$vuetify.breakpoint.smAndUp ? 100 : 45;
    },
    sites() {
      return [
        {
          key: "natarc",
          url: "https://natarc.ut.ee",
          icon: NATARCLogo,
          height: this.$vuetify.breakpoint.smAndUp ? 100 : 45,
          width: 40,
        },
        {
          key: "sarv",
          url: "https://geoloogia.info",
          icon: sarvLogo,
          height: this.$vuetify.breakpoint.smAndUp ? 100 : 45,
          width: 180,
        },
      ];
    },
  },
};
</script>

<style scoped>
.site-icons {
  /* position: absolute; */
  bottom: 0;
  width: 100%;
  height: max-content;
}
.v-btn::before {
  background-color: transparent;
}
</style>
