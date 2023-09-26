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
        <span style="float: left; font-size: 80%">{{
          entity.database__name_label
        }}</span>

        <div style="float: right; text-align: right; font-size: 91%">
          {{
            entity.database__acronym === "ELM"
              ? "TAM"
              : entity.database__acronym
          }}
          {{ entity.specimen_id }}
        </div>
      </div>

      <div
        class="label2_row_name"
        style="font-weight: bold; text-align: right; line-height: 1.1"
      >
        <span
          :style="{
            'font-size': getFontSizeUsingLength(
              names.find((item) => item.id === entity.id)
            ),
          }"
          v-if="
            names &&
            names.length > 0 &&
            names.find((item) => item.id === entity.id)
          "
        >
          <span
            v-translate="{
              et: names.find((item) => item.id === entity.id).name,
              en: names.find((item) => item.id === entity.id).name_en,
            }"
          ></span>
        </span>
      </div>

      <div class="label2_row2">
        <div>
          <b>Loc. </b>
          <span
            v-if="entity.locality__locality || entity.locality__locality_en"
            style="font-size: 1.1em"
            v-translate="{
              et: entity.locality__locality,
              en: entity.locality__locality_en,
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
          v-if="
            entity.stratigraphy__stratigraphy ||
            entity.stratigraphy__stratigraphy_en
          "
          style="font-size: 1.1em"
          v-translate="{
            et: entity.stratigraphy__stratigraphy,
            en: entity.stratigraphy__stratigraphy_en,
          }"
        ></span>
        <span
          v-else-if="
            entity.lithostratigraphy__stratigraphy ||
            entity.lithostratigraphy__stratigraphy_en
          "
          style="font-size: 1.1em"
          v-translate="{
            et: entity.lithostratigraphy__stratigraphy,
            en: entity.lithostratigraphy__stratigraphy_en,
          }"
        ></span>
        <span v-else style="font-size: 1.1em">{{
          entity.stratigraphy_free
        }}</span>
      </div>

      <div class="label2_row3" style="margin-right: 13mm">
        <div style="float: left">
          <b>Coll. </b>
          <span style="font-size: 1em">{{
            entity.agent_collected__agent
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
          <qrcode
            class="d-block"
            :value="'http://geocollections.info/specimen/' + entity.id"
            :options="{ errorCorrectionLevel: 'L', margin: 0 }"
            tag="img"
          ></qrcode>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import {
  fetchSpecimenIdentificationGeologiesList,
  fetchSpecimenIdentificationsList,
} from "../../assets/js/api/apiCalls.js";

export default {
  name: "SpecimenListView",
  props: {
    data: {
      type: Array,
    },
  },
  data: () => ({
    names: [],
  }),
  watch: {
    data: {
      handler(newVal) {
        this.getNames(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    async getNames(listOfSpecimens) {
      if (listOfSpecimens && listOfSpecimens.length > 0) {
        let listOfIds = listOfSpecimens.map((specimen) => specimen.id);

        const taxonResponse = await fetchSpecimenIdentificationsList(listOfIds);
        const rockResponse = await fetchSpecimenIdentificationGeologiesList(
          listOfIds
        );

        if (taxonResponse.status === 200 && rockResponse.status === 200) {
          let taxonList = [];
          let rockList = [];

          if (taxonResponse.data.count > 0) {
            taxonList = taxonResponse.data.results.map((entity) => {
              return {
                id: entity.specimen_id,
                name: entity.taxon__taxon ? entity.taxon__taxon : entity.name,
                name_en: entity.taxon__taxon
                  ? entity.taxon__taxon
                  : entity.name,
                taxonId: entity.taxon_id,
              };
            });
          }

          if (rockResponse.data.count > 0) {
            rockList = rockResponse.data.results.map((entity) => {
              let name = "";
              let name_en = "";

              if (entity.rock__name && !entity.name) name = entity.rock__name;
              else if (
                entity.rock__name &&
                entity.name &&
                entity.rock__name !== entity.name
              )
                name = entity.name + " | " + entity.rock__name;
              else name = entity.name;

              if (entity.rock__name_en && !entity.name_en)
                name_en = entity.rock__name_en;
              else if (
                entity.rock__name_en &&
                entity.name_en &&
                entity.rock__name_en !== entity.name_en
              )
                name_en = entity.name_en + " | " + entity.rock__name_en;
              else name_en = entity.name_en;

              if (entity.rock__formula_html) {
                name += " | " + entity.rock__formula_html;
                name_en += " | " + entity.rock__formula_html;
              }

              return {
                id: entity.specimen_id,
                name: name,
                name_en: name_en,
                rockId: entity.rock_id,
              };
            });
          }

          if (taxonList.length > 0 && rockList.length > 0) {
            rockList.forEach((rock) => {
              let item = taxonList.find((taxon) => rock.id === taxon.id);
              item ? this.names.push(item) : this.names.push(rock);
            });

            taxonList.forEach((taxonItem) => {
              let secondItem = rockList.find(
                (rockItem) => taxonItem.id === rockItem.id
              );
              secondItem
                ? this.names.push(secondItem)
                : this.names.push(taxonItem);
            });
          } else if (taxonList.length > 0) this.names = taxonList;
          else if (rockList.length > 0) this.names = rockList;
        }
      }
    },

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
