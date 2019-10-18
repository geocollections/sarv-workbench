<template>
  <div class="row list-row" v-if="data.length > 0">
    <div class="label2" v-for="(entity, index) in data" :key="index">
      <div class="label2_head">
        <div
          style="float: left; font-size: 90%"
          v-translate="{
            et: entity.database__name,
            en: entity.database__name_en
          }"
        ></div>

        <div
          style="float: right; text-align: right; padding-right: 1mm; margin-top: -0.5mm; font-size: 1.0em"
        >
          ID: {{ entity.id }}
        </div>
      </div>

      <div
        class="label2_row_name"
        style="font-size: 1.4em; font-weight: bold;text-align: right; "
      >
        {{ entity.number }}
      </div>

      <div class="label2_row2">
        <div>
          <b>Loc. </b>
          <span
            v-if="entity.locality__locality || entity.locality__locality_en"
            style="font-size: 1.1em;"
            v-translate="{
              et: entity.locality__locality,
              en: entity.locality__locality_en
            }"
          ></span>
          <span v-else style="font-size: 1.1em;">{{
            entity.locality_free
          }}</span>
        </div>

        <div>
          <span style="font-size: 1.1em; font-weight: normal;">
            <span v-if="entity.depth && entity.depth_interval"
              >{{ entity.depth }} - {{ entity.depth_interval }} m</span
            >
            <span v-else-if="entity.depth">{{ entity.depth }} m</span>
          </span>
        </div>
      </div>

      <div class="label2_row">
        <b>Strat. </b>
        <span
          v-if="
            entity.stratigraphy__stratigraphy ||
              entity.stratigraphy__stratigraphy_en
          "
          style="font-size: 1.1em;"
          v-translate="{
            et: entity.stratigraphy__stratigraphy,
            en: entity.stratigraphy__stratigraphy_en
          }"
        ></span>
        <span
          v-else-if="
            entity.lithostratigraphy__stratigraphy ||
              entity.lithostratigraphy__stratigraphy_en
          "
          style="font-size: 1.1em;"
          v-translate="{
            et: entity.lithostratigraphy__stratigraphy,
            en: entity.lithostratigraphy__stratigraphy_en
          }"
        ></span>
        <span v-else style="font-size: 1.1em;">{{
          entity.stratigraphy_free
        }}</span>
      </div>

      <div class="label2_row3" style="margin-right: 13mm;">
        <div style="float: left;">
          <b>Coll. </b>
          <span style="font-size: 1.1em;">{{
            entity.agent_collected__agent
          }}</span>
        </div>

        <div style="float: right;">
          <span v-if="entity.date_collected">{{ entity.date_collected }}</span>
          <span v-else>{{ entity.date_collected_free }}</span>
        </div>

        <div
          class="small-image"
          style="background-color: #fff; border-top: solid 0.25pt #000; border-left: solid 0.25pt #000; position:absolute; bottom: 0mm; right:0mm; padding: 1mm;"
        >
          <vue-q-r-code-component
            :text="'http://geocollections.info/sample/' + entity.id"
            error-level="L"
            :size="40"
          ></vue-q-r-code-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";

export default {
  props: {
    data: {
      type: Array
    }
  },
  components: {
    VueQRCodeComponent
  },
  name: "SampleListView"
};
</script>

<style scoped>
.list-row {
  margin: 0 15px;
}
/* STYLES FROM OLD APP */
.label2 {
  position: relative;
  float: left;
  height: 40mm;
  width: 58mm;
  border: solid 1pt #000;
  padding: 1mm;
  margin: 0.5mm;
  font-size: 9pt;
  font-family: "open sans", arial, sans-serif;
  background-color: #fff;
  page-break-inside: avoid;
  color: #000;
}

.label2_head {
  position: relative;
  float: left;
  height: 5mm;
  width: 58mm;
  /*left: -1mm;*/
  margin-left: -5px;
  margin-right: -5px;
  padding-left: 1mm;
  padding-right: 1mm;
  border-bottom: solid 0.5pt #000;
  margin-bottom: 0.5mm;
  font-size: 8pt;
  font-weight: bold;
}

.label2_row_name {
  font-size: 8pt;
  clear: both;
  height: 7mm;
  border-bottom: dotted 0.5pt #000;
}

.label2_row {
  height: 10mm;
  border-bottom: dotted 0.5pt #000;
}

.label2_row2 {
  height: 10mm;
  border-bottom: dotted 0.5pt #000;
}

.label2_row3 {
  height: 7mm;
}

.small-image >>> img {
  /*width: 40px !important;*/
}
</style>
