<template>
  <div>

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- LOCALITY AND LOCALITY ENG -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('locality.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" :state="isDefinedAndNotNull(locality.locality)" v-model="locality.locality" type="text"></b-form-input>
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

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="locality.is_private" value="1" unchecked-value="0">
          {{ $t('locality.private') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'locality')">{{ $t('add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'locality')">{{ $t('add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('locality')">{{ $t('add.buttons.clearFields') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
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
      isDefinedAndNotNull(value) { return !!value && value !== null && value.trim().length > 0},
      isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
      cancelRequest() {this.previousRequest.abort()},
      handleResponse(response){
        if (response.status === 200) {
          return (response.body.count > 0) ? response.body.results : []
        }
      },
      formatDataForUpload(objectToUpload) {

      },

      validate(object){
        let vm = this, isValid = true;
        this.requiredFields.forEach(function (el) {
          isValid &= vm.isDefinedAndNotNull(vm[object][el])
        })
        return isValid
      },

      add(addAnother, object) {
        if (this.validate(object) && !this.sendingData) {

          this.sendingData = true;
          this.loadingPercent = 0;

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload();
          formData.append('data', dataToUpload)

          // this.$http.post(this.apiUrl + 'add/reference/', formData, {
          //   before(request) {
          //     this.previousRequest = request
          //   },
          //   progress: (e) => {
          //     if (e.lengthComputable) {
          //       // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
          //       this.loadingPercent = Math.round((e.loaded / e.total) * 100)
          //     }
          //   }
          // }).then(response => {
          //   console.log(response)
          //   this.sendingData = false
          //   if (response.status === 200) {
          //     if (typeof response.body.message !== 'undefined') {
          //
          //       if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
          //         toastSuccess({text: response.body.message_et});
          //       } else {
          //         toastSuccess({text: response.body.message});
          //       }
          //
          //       if (!addAnother) {
          //         this.$router.push({ path: '/reference' })
          //       }
          //     }
          //     if (typeof response.body.error !== 'undefined') {
          //
          //       if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
          //         toastError({text: response.body.error_et});
          //       } else {
          //         toastError({text: response.body.error});
          //       }
          //
          //     }
          //   }
          // }, errResponse => {
          //   console.log('ERROR: ' + JSON.stringify(errResponse))
          //   this.sendingData = false
          //   toastError({text: this.$t('messages.uploadError')})
          // })

        } else if (this.sendingData) {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }

      },
      reset(object) {
        this[object] = {}
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
    data() {
      return {
        autocomplete: {
          localityTypes: [], belongs: [], extent: [], coordPrecision: [], coordMethod: [],
          coordAssigner: [], country: [], county: [], parish: [], strat_top: [], strat_lower: []
        },
        requiredFields: ['locality'],
        locality: {}
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
      });
      fetchListLocalityExtent().then(response => {
        this.autocomplete.extent = this.handleResponse(response);
      });
      fetchListCoordinateMethod().then(response => {
        this.autocomplete.coordMethod = this.handleResponse(response);
      });
      fetchListCoordinatePrecision().then(response => {
        this.autocomplete.coordPrecision = this.handleResponse(response);
      });
      fetchListCountry().then(response => {
        this.autocomplete.country = this.handleResponse(response);
      });
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
