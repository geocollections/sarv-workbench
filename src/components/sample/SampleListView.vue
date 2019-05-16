<template>
  <div class="row" v-if="data.length > 0">


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

</style>
