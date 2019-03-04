<template>
  <div>

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- LOCALITY AND LOCALITY ENG -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality_en`">{{ $t('locality.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" v-model="locality.locality" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`locality_en`">{{ $t('locality.locality_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality_en" v-model="locality.locality_en" type="text"></b-form-input>
      </div>
    </div>

    <!-- NUMBER AND OTHER NUMBER -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`number`">{{ $t('locality.number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number" v-model="locality.number" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`other_number`">{{ $t('locality.other_number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="other_number" v-model="locality.other_number" type="text"></b-form-input>
      </div>
    </div>

    <!-- LOCALITY TYPE, LOCALITY BELONGS  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`type`">{{ $t('locality.type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.type" v-if="isDefinedAndNotEmpty(autocomplete.localityTypes)"
                         id="type"
                         :options="autocomplete.localityTypes"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`belongs`">{{ $t('locality.belongs') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.belongs" :disabled="true"
                         id="belongs"
                         :options="autocomplete.belongs"
                         track-by="id"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- LATITUDE AND LONGITUDE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`latitude`">{{ $t('locality.latitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="latitude" v-model="locality.latitude" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`longitude`">{{ $t('locality.longitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="longitude" v-model="locality.longitude" type="number"></b-form-input>
      </div>
    </div>

    <!-- ALTITUDE AND VERTICAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`altitude`">{{ $t('locality.altitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="altitude" v-model="locality.altitude" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`vertical`">{{ $t('locality.vertical') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="vertical" v-model="locality.vertical" type="number"></b-form-input>
      </div>
    </div>

    <!-- COORDINATE X AND EXTENT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`extent`">{{ $t('locality.extent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.extent"
                         id="extent"
                         :options="autocomplete.extent"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>

      <div class="col-sm-2">
        <label :for="`coordX`">{{ $t('locality.coordX') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordX" v-model="locality.coordX" type="number"></b-form-input>
      </div>
    </div>

    <!-- COORDINATE Y AND COORD SYSTEM -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coordY`">{{ $t('locality.coordY') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordY" v-model="locality.coordY" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`coordSystem`">{{ $t('locality.coordSystem') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordSystem" v-model="locality.coordSystem" type="text"></b-form-input>
      </div>
    </div>

    <!-- COORD PRECISION AND  COORD METHOD  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coordPrecision`">{{ $t('locality.coordPrecision') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.type"
                         id="coordPrecision"
                         :options="autocomplete.coordPrecision"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`coordMethod`">{{ $t('locality.coordMethod') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.coordMethod"
                         id="coordMethod"
                         :options="autocomplete.coordMethod"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- ASSIGNER AND COUNTRY  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coordAssigner`">{{ $t('locality.coordAssigner') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.coordAssigner" :disabled="true"
                         id="coordAssigner"
                         :options="autocomplete.coordAssigner"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`coordMethod`">{{ $t('locality.country') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.country"
                         id="country"
                         :options="autocomplete.country"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- COUNTY AND PARISH  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`county`">{{ $t('locality.county') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.county"
                         id="county"
                         :options="autocomplete.county"
                         track-by="id"
                         :label="countyLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`parish`">{{ $t('locality.parish') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.parish" :disabled="true"
                         id="parish"
                         :options="autocomplete.parish"
                         track-by="id"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- STRAT TOP AND STRAT TOP FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`strat_top`">{{ $t('locality.strat_top') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.strat_top" :disabled="true"
                         id="strat_top"
                         :options="autocomplete.strat_top"
                         track-by="id"
                         label="countyLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`strat_top_free`">{{ $t('locality.strat_top_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="strat_top_free" v-model="locality.strat_top_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- STRAT LOWER AND STRAT LOWER FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`strat_lower`">{{ $t('locality.strat_lower') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.strat_lower" :disabled="true"
                         id="strat_lower"
                         :options="autocomplete.strat_lower"
                         track-by="id"
                         label="countyLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`strat_lower_free`">{{ $t('locality.strat_lower_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="strat_lower_free" v-model="locality.strat_lower_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- MAAAMET PA AND EELIS ID -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`maaamaet_pa`">{{ $t('locality.maaamaet_pa') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="maaamaet_pa" v-model="locality.maaamaet_pa" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`eelis_id`">{{ $t('locality.eelis_id') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="eelis_id" v-model="locality.eelis_id" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`description`">{{ $t('locality.description') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="description" v-model="locality.description" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- ADDITIONAL INFO -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`additionalInfo`">{{ $t('locality.additionalInfo') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="additionalInfo" v-model="locality.additionalInfo" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
  import {
    fetchListLocalityTypes,
    fetchListLocalityExtent,
    fetchListCoordinateMethod,
    fetchListCoordinatePrecision,
    fetchListCountry,
    fetchListCounty,
    fetchListParish
  } from "@/assets/js/api/apiCalls";

  let mixin = {
    data(){
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
      }
    },
    methods: {
      isDefinedAndNotNull(value) { return !!value && value !== null },
      isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
      cancelRequest() {this.previousRequest.abort()},
      handleResponse(response){
        if (response.status === 200) {
          return (response.body.count > 0) ? response.body.results : this.autocomplete.localityTypes = []
        }
      }
    }
  };

  export default {
    name: "Locality",
    components: {
      BFormInput,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [mixin],
    data(){
        return {
          autocomplete: {
            localityTypes: [], belongs: [], extent: [], coordPrecision: [], coordMethod:[],
            coordAssigner: [], country:[], county: [], parish:[], strat_top: [],strat_lower: []
          },
          locality: {},
          fields:[
            {id:"locality",title:"locality.locality",type:"text", required: true},
            {id:"locality_en",title:"locality.locality_en",type:"text", required: true},
            {id:"number",title:"locality.number",type:"text", customFieldClass:"col-sm-6", customLabelClass:"col-sm-4", customInputClass:"col-sm-8"},
            {id:"other_number",title:"locality.other_number",type:"text",customFieldClass:"col-sm-6",customLabelClass:"col-sm-4", customInputClass:"col-sm-8"},
            {id:"type",title:"locality.type",type:"text", fieldType:"autocomplete", options: [] },
            {id:"belongs",title:"locality.belongs",type:"text"},
            {id:"latitude",title:"locality.latitude",type:"number"},
            {id:"longitude",title:"locality.longitude",type:"number"},
            {id:"altitude",title:"locality.altitude",type:"number"},
            {id:"vertical",title:"locality.vertical",type:"number"},

            {id:"extent",title:"locality.extent",type:"text", fieldType:"autocomplete",options: [] },
            {id:"coordX",title:"locality.coordX",type:"number"},
            {id:"coordY",title:"locality.coordY",type:"number"},
            {id:"coordSystem",title:"locality.coordSystem",type:"text"},
            {id:"coordPrecision",title:"locality.coordPrecision",type:"text",fieldType:"autocomplete",options: []},
            {id:"coordMethod",title:"locality.coordMethod",type:"text",fieldType:"autocomplete",options: []},
            {id:"coordAssigner",title:"locality.coordAssigner",type:"text"},
            {id:"country",title:"locality.country",type:"text",fieldType:"autocomplete",options: []},
            {id:"county",title:"locality.county",type:"text"},
            {id:"parish",title:"locality.parish",type:"text"},
            {id:"area",title:"locality.area",type:"text"},
            {id:"strat_top",title:"locality.strat_top",type:"text"},
            {id:"strat_top_free",title:"locality.strat_top_free",type:"text"},
            {id:"strat_lower",title:"locality.strat_lower",type:"text"},
            {id:"strat_lower_free",title:"locality.strat_lower_free",type:"text"},
            {id:"maaamaet_pa",title:"locality.maaamaet_pa",type:"number"},
            {id:"eelis_id",title:"locality.eelis_id",type:"text"},
            {id:"description",title:"locality.description",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
            {id:"additionalInfo",title:"locality.additionalInfo",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
          ]
        }
    },
    computed: {
      commonLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },
      countyLabel() {
        return this.$i18n.locale === 'ee' ? 'maakond' : 'maakond_en'
      },
    },
    created() {
      fetchListLocalityTypes().then(response => {
        this.autocomplete.localityTypes = this.handleResponse(response);
      })
      fetchListLocalityExtent().then(response => {
        this.autocomplete.extent = this.handleResponse(response);
      })
      fetchListCoordinateMethod().then(response => {
        this.autocomplete.coordMethod = this.handleResponse(response);
      })
      fetchListCoordinatePrecision().then(response => {
        this.autocomplete.coordPrecision = this.handleResponse(response);
      })
      fetchListCountry().then(response => {
        this.autocomplete.country = this.handleResponse(response);
      })

      fetchListCounty().then(response => {
        this.autocomplete.county = this.handleResponse(response);
      })
    },
    methods: {

    }
  }

</script>

<style scoped>

</style>
