<template>
  <div class="row" v-if="data.length > 0">


<!--    SHOULD USE THIS (from the old app)-->
<!--    <div class="label2" v-for="(entity, index) in data">-->
<!--      <div class="label2_head">-->
<!--        <div style="float: left;" v-translate="{et: entity.database__name, en: entity.database__name_en}"></div>-->
<!--        <div style="float: right; text-align: right; padding-right: 1mm; margin-top: -0.5mm; font-size: 1.0em">ID: {{ entity.id }}</div>-->
<!--      </div>-->
<!--      <div class="label2_row_name" style="font-size: 1.4em; font-weight: bold;text-align: right; ">TEST proov</div>-->
<!--      <div class="label2_row2">-->
<!--        <div style="position: absolute; top: 0; left: 0;"><b>Loc.</b><span style="font-size: 1.1em;">  </span></div>-->
<!--        <div style="position: absolute; bottom: 0; right: 0;"><span style="font-size: 1.1em; font-weight: normal;"></span></div>-->
<!--      </div>-->
<!--      <div class="label2_row"><b>Strat.</b><span style="font-size: 1.1em;">   </span></div>-->
<!--      <div class="label2_row3" style="margin-right: 11mm;">-->
<!--        <div style="float: left;"><b>Coll.</b><span style="font-size: 1.1em;"> </span></div>-->
<!--        <div style="float: right;"> </div>-->
<!--        <div style="background-color: #fff; border-top: solid 0.25pt #000; border-left: solid 0.25pt #000;position:absolute; bottom: 0mm; right:0mm; padding: 1mm;"><img style="width: 8mm;" src="tmp/sample_145235.png"></div>-->
<!--      </div>-->
<!--    </div>-->




    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 pl-0 pr-1 mb-1" v-for="(entity, index) in data">

      <b-card
        header-tag="header"
      >
        <div class="row ml-0 mr-0" slot="header">
          <span class="col-8 pl-0 pr-0" style="font-size: 12px;" v-translate="{et: entity.database__name, en: entity.database__name_en}"></span>
          <span class="col-4 pl-0 pr-0 text-right" style="font-size: 12px">ID: {{ entity.id }}</span>
        </div>

        <div class="row ml-0 mr-0 sample-card-body">
          <div class="col-12 pl-1 pr-1 text-right" style="font-size: 18px; font-weight: bold; border-bottom: 1px dashed">{{ entity.number }} </div>
          <div class="col-12 pl-1 pr-1" style="border-bottom: 1px dashed"><b>Loc.</b> <span v-translate="{et: entity.locality__locality, en: entity.locality__locality_en}"></span></div>
          <div class="col-12 pl-1 pr-1" style="border-bottom: 1px dashed"><b>Strat.</b> <span v-translate="{et: entity.stratigraphy__stratigraphy, en: entity.stratigraphy__stratigraphy_en}"></span></div>
          <div class="col-12 pl-1">
            <div class="row">
              <div class="col"><b>Coll.</b> {{ entity.agent_collected__agent }}</div>
              <div class="col text-right">{{ entity.date_collected }}</div>
              <div class="col p-1" style="border-top: 1px solid black; border-left: 1px solid black; max-width: 50px">
                <vue-q-r-code-component :text="'http://geocollections.info/sample/' + entity.id"
                                        :size="40"
                                        error-level="L"></vue-q-r-code-component>
              </div>
            </div>
          </div>
        </div>
      </b-card>

    </div>

  </div>
</template>

<script>
  import VueQRCodeComponent from 'vue-qrcode-component'

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
  }
</script>

<style scoped>
  .card {
    border-color: black;
    border-radius: unset;
    max-width: 300px;
    min-width: 265px;
    margin: auto;
  }

  .card-header {
    background-color: white;
    border-bottom: 1px solid black;
    padding: 0.25rem 0.5rem;
    color: #000;
  }

  .card-body {
    padding: 0;
    /*padding: 0 0.5rem;*/
  }

  .sample-card-body {
    font-size: 12px;
  }

  /* STYLES FROM OLD APP */
  .label2 {
    position: relative;
    float: left;
    height: 38mm;
    width: 58mm;
    border: solid 1pt #000;
    padding: 1mm;
    margin: 0.5mm;
    font-size: 9pt;
    font-family: "open sans", arial, sans-serif;
    background-color: #fff;
    page-break-inside: avoid;
  }

  .label2_head {
    position: relative;
    float: left;
    height: 5mm;
    width: 59mm;
    left: -1mm;
    padding-left: 1mm;
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


</style>
