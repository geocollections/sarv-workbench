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
        :max-height="getHeight"
        :max-width="100"
        contain
        :src="site.icon"
      ></v-img>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "SiteIcons",
  data() {
    return {
      sites: [
        {
          key: "natarc",
          url: "https://natarc.ut.ee",
          icon: require("../../assets/img/NATARC_transparent.png")
        },
        {
          key: "sarv",
          url: "https://geocollections.info",
          icon: require("../../assets/img/sarv_logo.svg")
        }
      ]
    };
  },
  computed: {
    classObject() {
      return {
        "align-self-center": true,
        "pa-2": true,
        "d-block": this.$vuetify.breakpoint.xsOnly,
        "d-sm-none": this.$vuetify.breakpoint.xsOnly
      };
    },
    getHeight() {
      return this.$vuetify.breakpoint.smAndUp ? 100 : 45;
    }
  }
};
</script>

<style scoped>
.site-icons {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: max-content;
}
.v-btn::before {
  background-color: transparent;
}
</style>
