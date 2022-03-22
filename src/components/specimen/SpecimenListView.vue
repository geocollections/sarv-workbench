<template>
  <div class="list-row" v-if="data.length > 0">
    <router-link
      class="label2"
      v-for="entity in data"
      :key="entity.id"
      :to="{ path: '/specimen/' + entity.id }"
      :title="$t('editSpecimen.editMessage')"
    >
      <div class="label2_head">
        <div style="float: left; font-size: 84%" v-if="entity.database">
          {{ entity.database.name_label }}
        </div>

        <div style="float: right; text-align: right; font-size: 95%">
          {{ entity.database.acronym }} {{ entity.specimen_id }}
        </div>
      </div>

      <div
        class="label2_row_name"
        style="font-weight: bold; text-align: right; line-height: 1.1"
      >
        <span
          :style="{
            'font-size': getFontSizeUsingLength(
              entity.specimen_identification[0]
            ),
          }"
          v-if="
            entity.specimen_identification &&
            entity.specimen_identification.length > 0
          "
        >
          <span
            v-for="(item, key) in entity.specimen_identification"
            :key="key"
            v-translate="{
              et: item.name,
              en: item.name_en,
            }"
          ></span>
        </span>
        <span
          :style="{
            'font-size': getFontSizeUsingLength(
              entity.specimen_identification_geology[0]
            ),
          }"
          v-else-if="
            entity.specimen_identification_geology &&
            entity.specimen_identification_geology.length > 0
          "
        >
          <span
            v-for="(item, key) in entity.specimen_identification_geology"
            :key="key"
            v-translate="{
              et: item.rock.name,
              en: item.rock.name_en,
            }"
          ></span>
        </span>
      </div>

      <div class="label2_row2">
        <div>
          <b>Loc. </b>
          <span
            v-if="entity.locality"
            style="font-size: 1.1em"
            v-translate="{
              et: entity.locality.locality,
              en: entity.locality.locality_en,
            }"
          ></span>
          <span v-else style="font-size: 1.1em">{{
            entity.locality_free
          }}</span>
        </div>

        <div>
          <span style="font-size: 1.1em; font-weight: normal">
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
        <div style="float: left">
          <b>Coll. </b>
          <span style="font-size: 1em" v-if="entity.agent_collected">{{
            entity.agent_collected.agent
          }}</span>
        </div>

        <div style="float: right; font-size: 0.9em">
          {{ entity.date_collected }}
        </div>

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
            :text="'http://geocollections.info/specimen/' + entity.id"
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
  name: "SpecimenListView",
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    VueQRCodeComponent,
  },
  methods: {
    getFontSizeUsingLength(specimenName) {
      if (specimenName) {
        let nameLength = specimenName.name ? specimenName.name.length : 0;
        let nameLengthEn = specimenName.name_en
          ? specimenName.name_en.length
          : 0;

        if (this.$i18n.locale === "ee") {
          if (nameLength > 75) return "1em";
          else if (nameLength > 50) return "1.15em";
          else if (nameLength > 25) return "1.25em";
          else return "1.4em";
        } else {
          if (nameLengthEn > 75) return "1em";
          else if (nameLengthEn > 50) return "1.15em";
          else if (nameLengthEn > 25) return "1.25em";
          else return "1.4em";
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
  height: 43mm;
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
  height: 9mm;
  border-bottom: dotted 0.5pt #000;
}

.label2_row {
  height: 10mm;
  border-bottom: dotted 0.5pt #000;
  margin-right: 13mm;
}

.label2_row2 {
  height: 10mm;
  border-bottom: dotted 0.5pt #000;
}

.label2_row3 {
  height: 7mm;
}

.small-image >>> img {
  max-width: 10.5mm !important;
}
</style>
