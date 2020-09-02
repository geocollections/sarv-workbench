<template>
  <div class="site-icons d-flex justify-center">
    <v-btn
      class="align-self-center pa-2"
      tile
      depressed
      :ripple="false"
      color="transparent"
      height="fit-content"
      width="fit-content"
      href="https://natarc.ut.ee"
      target="window"
    >
      <v-img
        :max-height="100"
        :max-width="100"
        contains
        src="../../assets/img/NATARC_transparent.png"
      ></v-img>
    </v-btn>
    <v-btn
      class="align-self-center pa-2"
      tile
      depressed
      :ripple="false"
      color="transparent"
      height="fit-content"
      width="fit-content"
      href="https://geocollections.info"
      target="window"
    >
      <v-img
        :max-height="100"
        :max-width="100"
        contains
        src="../../assets/img/sarv_logo.svg"
      ></v-img>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "SiteIcons"
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
