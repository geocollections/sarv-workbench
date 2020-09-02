<template>
  <div class="site-icons d-flex justify-center">
    <!--  Buttons for screens larger than xs  -->
    <v-btn
      v-for="site in sites"
      :key="site.key"
      class="align-self-center pa-2 d-none d-sm-block"
      tile
      depressed
      :ripple="false"
      color="transparent"
      height="fit-content"
      width="fit-content"
      :href="site.url"
      target="window"
    >
      <v-img
        :max-height="100"
        :max-width="100"
        contain
        :src="site.icon"
      ></v-img>
    </v-btn>

    <!--  Buttons for screens size xs  -->
    <v-btn
      v-for="site in sites"
      :key="site.key"
      class="d-block d-sm-none align-self-center pa-2"
      tile
      depressed
      :ripple="false"
      color="transparent"
      height="fit-content"
      width="fit-content"
      :href="site.url"
      target="window"
    >
      <v-img :max-height="45" :max-width="100" contain :src="site.icon"></v-img>
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
  }
};
</script>

<style scoped>
.site-icons {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.v-btn::before {
  background-color: transparent;
}
</style>
