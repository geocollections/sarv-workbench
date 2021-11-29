<template>
  <div class="list-row" v-if="data.length > 0">
    <router-link
      class="label m-1"
      v-for="entity in data"
      :key="entity.id"
      :to="{ path: '/location/' + entity.id }"
      :title="$t('editLocation.editMessage')"
    >
      <div class="p-2 pl-3 h-100">
        <div class="float-left pr-1" style="width: 64% !important">
          <div
            class="mb-2"
            style="font-size: 90%"
            v-translate="{
              et: entity.database__name,
              en: entity.database__name_en,
            }"
          ></div>
          <div>
            <h6 class="mb-1">
              <b>{{ labelType(entity.location) }}</b>
            </h6>
          </div>
          <div>
            <h5>
              <b>{{ entity.location }}</b>
            </h5>
          </div>
          <div>
            {{ entity.contents }}
          </div>
        </div>
        <div
          class="float-left fill-height d-flex"
          style="width: 36% !important"
        >
          <div class="qr-code align-self-center">
            <vue-q-r-code-component
              :text="'https://edit.geocollections.info/location/' + entity.id"
              error-level="L"
            />
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";

export default {
  name: "LocationListView",
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    VueQRCodeComponent,
  },
  data: () => ({
    names: [],
  }),
  watch: {
    data: {
      immediate: true,
    },
  },
  methods: {
    labelType(code) {
      if (code[0] === "k") return "Kast nr.";
      else if (code[0] === "s") return "Sahtel nr.";
      else if (code[0] === "l") return "Laen nr.";
      else if (code[0] === "r") return "Ruum nr.";
      else if (code[0] === "h") return "Hoidla nr.";
      else if (code[0] === "a") return "Alus nr.";
      else if (code[0] === "e") return "Vitriin nr.";
      return "";
    },
  },
};
</script>

<style scoped>
.label:hover {
  cursor: pointer;
  /*opacity: 0.7;*/
  background-color: rgba(255, 87, 34, 0.1);
}

/* STYLES FROM OLD APP */
.label {
  position: relative;
  float: left;
  height: 43mm;
  width: 80mm;
  border: solid 1pt #000;
  /*padding: 1mm;*/
  /*margin: 0.5mm;*/
  font-size: 9pt;
  font-family: "open sans", arial, sans-serif;
  background-color: #fff;
  page-break-inside: avoid;
  color: #000;
}

.qr-code >>> img {
  max-width: 100% !important;
}
</style>
