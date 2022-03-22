<template>
  <div class="list-row" v-if="data.length > 0">
    <router-link
      class="label2"
      v-for="entity in data"
      :key="entity.id"
      :to="{ path: '/sample/' + entity.id }"
      :title="$t('editSample.editMessage')"
    >
      <div class="label2_head">
        <div style="float: left; font-size: 84%" v-if="entity.database">
          {{ entity.database.name_label }}
        </div>

        <div style="float: right; text-align: right; font-size: 95%">
          ID: {{ entity.id }}
        </div>
      </div>

      <div
        class="label2_row_name"
        style="font-size: 1.4em; font-weight: bold; text-align: right"
      >
        <span v-if="entity.number">{{ entity.number }}</span>
        <span v-else-if="entity.number_additional">{{
          entity.number_additional
        }}</span>
        <span v-else>{{ entity.number_field }}</span>
      </div>

      <div class="label2_row2">
        <div
          :class="getFontSizeUsingLength(entity) !== '1.1em' ? 'd-inline' : ''"
        >
          <b>Loc. </b>
          <span
            v-if="entity.locality"
            :style="{ 'font-size': getFontSizeUsingLength(entity) }"
            v-translate="{
              et: entity.locality.locality,
              en: entity.locality.locality_en,
            }"
          />
          <span
            v-else-if="entity.locality_free"
            :style="{ 'font-size': getFontSizeUsingLength(entity) }"
            >{{ entity.locality_free }}</span
          >
          <span
            v-if="entity.site"
            v-translate="{
              et: entity.site.name,
              en: entity.site.name_en,
            }"
          />
        </div>

        <div
          :class="getFontSizeUsingLength(entity) !== '1.1em' ? 'd-inline' : ''"
        >
          <span
            :style="{
              'font-size': getFontSizeUsingLength(entity),
              'font-weight': 'normal',
            }"
          >
            <span v-if="entity.depth && entity.depth_interval">
              {{ entity.depth }} - {{ entity.depth_interval }} m</span
            >
            <span v-else-if="entity.depth"> {{ entity.depth }} m</span>
          </span>
        </div>
      </div>

      <div class="label2_row">
        <b>Strat. </b>
        <span
          v-if="entity.stratigraphy"
          style="font-size: 1.1em"
          v-translate="{
            et: entity.stratigraphy.stratigraphy,
            en: entity.stratigraphy.stratigraphy_en,
          }"
        ></span>
        <span
          v-else-if="entity.lithostratigraphy"
          style="font-size: 1.1em"
          v-translate="{
            et: entity.lithostratigraphy.stratigraphy,
            en: entity.lithostratigraphy.stratigraphy_en,
          }"
        ></span>
        <span v-else style="font-size: 1.1em">{{
          entity.stratigraphy_free
        }}</span>
      </div>

      <div class="label2_row3" style="margin-right: 13mm">
        <span style="float: left">
          <b>Coll. </b>
          <span style="font-size: 1.1em" v-if="entity.agent_collected">{{
            entity.agent_collected.agent
          }}</span>

          <span style="float: right">
            <span v-if="entity.date_collected">{{
              entity.date_collected
            }}</span>
            <span v-else>{{ entity.date_collected_free }}</span>
          </span>
        </span>

        <div
          class="small-image"
          style="
            background-color: #fff;
            border-top: solid 0.25pt #000;
            border-left: solid 0.25pt #000;
            position: absolute;
            bottom: 0mm;
            right: 0mm;
            padding: 0.5mm;
          "
        >
          <vue-q-r-code-component
            :text="'http://geocollections.info/sample/' + entity.id"
            error-level="L"
          ></vue-q-r-code-component>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";

export default {
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    VueQRCodeComponent,
  },
  name: "SampleListView",
  methods: {
    getFontSizeUsingLength(item) {
      if (item) {
        let nameLength = item?.locality?.locality?.length ?? 0;
        let nameLengthEn = item?.locality?.locality_en?.length ?? 0;

        if (this.$i18n.locale === "ee") {
          if (nameLength > 75) return "0.9em";
          else if (nameLength > 50) return "0.95em";
          else if (nameLength > 25) return "1em";
          else return "1.1em";
        } else {
          if (nameLengthEn > 75) return "0.9em";
          else if (nameLengthEn > 50) return "0.95em";
          else if (nameLengthEn > 25) return "1em";
          else return "1.1em";
        }
      } else return "1em";
    },
  },
};
</script>

<style scoped>
.label2:hover {
  cursor: pointer;
  /*opacity: 0.7;*/
  background-color: rgba(255, 87, 34, 0.1);
}
/* STYLES FROM OLD APP */
.label2 {
  position: relative;
  float: left;
  height: 45mm;
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
  font-size: 10pt;
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
  width: 10.5mm !important;
}
</style>
