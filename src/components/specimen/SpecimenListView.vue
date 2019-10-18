<template>
  <div class="row list-row" v-if="data.length > 0">
    <div class="label2" v-for="(entity, index) in data" :key="index">
      <div class="label2_head">
        <div
          style="float: left; font-size: 84%"
          v-translate="{
            et: entity.database__name,
            en: entity.database__name_en
          }"
        ></div>

        <div style="float: right; text-align: right; font-size: 95%">
          {{ entity.database__acronym }} {{ entity.specimen_id }}
        </div>
      </div>

      <div
        class="label2_row_name"
        style="font-weight: bold;text-align: right; line-height: 1.1;"
      >
        <span
          :style="{
            'font-size': getFontSizeUsingLength(
              names.find(item => item.id === entity.id)
            )
          }"
          v-if="
            names &&
              names.length > 0 &&
              names.find(item => item.id === entity.id)
          "
        >
          <span
            v-translate="{
              et: names.find(item => item.id === entity.id).name,
              en: names.find(item => item.id === entity.id).name_en
            }"
          ></span>
        </span>
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
          <span style="font-size: 1em;">{{
            entity.agent_collected__agent
          }}</span>
        </div>

        <div style="float: right; font-size: 0.9em">{{ entity.date_collected }}</div>

        <div
          class="small-image"
          style="background-color: #fff; border-top: solid 0.25pt #000; border-left: solid 0.25pt #000; position:absolute; bottom: 0mm; right:0mm; padding: 1mm;"
        >
          <vue-q-r-code-component
            :text="'http://geocollections.info/specimen/' + entity.id"
            error-level="L"
          ></vue-q-r-code-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
import {
  fetchSpecimenIdentificationGeologies,
  fetchSpecimenIdentifications
} from "../../assets/js/api/apiCalls";

export default {
  name: "SpecimenListView",
  props: {
    data: {
      type: Array
    }
  },
  components: {
    VueQRCodeComponent
  },
  data: () => ({
    names: []
  }),
  watch: {
    data: {
      handler(newVal) {
        this.getNames(newVal);
      },
      immediate: true
    }
  },
  methods: {
    getNames(listOfSpecimens) {
      if (listOfSpecimens && listOfSpecimens.length > 0) {
        listOfSpecimens.forEach(specimen => {
          let specimenObject = {
            id: specimen.id,
            name: "",
            name_en: ""
          };

          fetchSpecimenIdentifications(specimen.id).then(response => {
            if (response.status === 200) {
              if (
                response.body &&
                response.body.results &&
                response.body.results.length > 0
              ) {
                let taxon = response.body.results[0].taxon__taxon;
                let name = response.body.results[0].name;

                if (taxon) {
                  specimenObject.name = taxon;
                  specimenObject.name_en = taxon;
                } else if (name) {
                  specimenObject.name = name;
                  specimenObject.name_en = name;
                }
              } else {
                // Try fetching name from identification geologies
                fetchSpecimenIdentificationGeologies(specimen.id).then(
                  response => {
                    if (response.status === 200) {
                      if (
                        response.body &&
                        response.body.results &&
                        response.body.results.length > 0
                      ) {
                        let rock_name = response.body.results[0].rock__name;
                        let rock_name_en =
                          response.body.results[0].rock__name_en;
                        let rock_formula =
                          response.body.results[0].rock__formula_html;
                        let name = response.body.results[0].name;
                        let name_en = response.body.results[0].name_en;

                        // EST
                        if (rock_name && !name) specimenObject.name = rock_name;
                        else if (rock_name && name && rock_name !== name)
                          specimenObject.name = name + " | " + rock_name;
                        else specimenObject.name = name;

                        // ENG
                        if (rock_name_en && !name_en)
                          specimenObject.name_en = rock_name_en;
                        else if (
                          rock_name_en &&
                          name_en &&
                          rock_name_en !== name_en
                        )
                          specimenObject.name_en =
                            name_en + " | " + rock_name_en;
                        else specimenObject.name_en = name_en;

                        if (rock_formula) {
                          specimenObject.name += " | " + rock_formula;
                          specimenObject.name_en += " | " + rock_formula;
                        }
                      }
                    }
                  }
                );
              }
            }
          });

          this.names.push(specimenObject);
        });
      }
    },

    getFontSizeUsingLength(specimenName) {
      if (specimenName) {
        let nameLength = specimenName.name.length;
        let nameLengthEn = specimenName.name_en.length;

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
    }
  }
};
</script>

<style scoped>
.list-row {
  margin: 0 15px 15px;
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
  font-size: 8pt;
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
  width: 40px !important;
}
</style>
