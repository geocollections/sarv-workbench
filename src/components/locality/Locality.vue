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
        <label :for="`code`">{{ $t('locality.code') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="code" v-model="locality.code" type="text"></b-form-input>
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
        <label :for="`parent`">{{ $t('locality.parent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.parent" deselect-label="Can't remove this value"
                         :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.parent" :searchable="true" @search-change="autcompleteLocalitySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong> </template>
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
        <label :for="`elevation`">{{ $t('locality.elevation') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="elevation" v-model="locality.elevation" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('locality.depth') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth" v-model="locality.depth" type="number"></b-form-input>
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
        <label :for="`coordx`">{{ $t('locality.coordx') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordx" v-model="locality.coordx" type="number"></b-form-input>
      </div>
    </div>

    <!-- COORDINATE Y AND COORD SYSTEM -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coordy`">{{ $t('locality.coordy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordy" v-model="locality.coordy" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`coord_system`">{{ $t('locality.coord_system') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coord_system" v-model="locality.coord_system" type="text"></b-form-input>
      </div>
    </div>

    <!-- COORD PRECISION AND  COORD METHOD  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coord_det_precision`">{{ $t('locality.coord_det_precision') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.coord_det_precision"
                         id="coord_det_precision"
                         :options="autocomplete.coordPrecision"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`coord_det_method`">{{ $t('locality.coord_det_method') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.coord_det_method"
                         id="coord_det_method"
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
        <label :for="`coord_det_agent`">{{ $t('locality.coord_det_agent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="locality.coord_det_agent" :disabled="true"
                         id="coord_det_agent"
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

    <!-- STRAT TOP AND STRAT TOP FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_top`">{{ $t('locality.stratigraphy_top') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.stratigraphy_top" deselect-label="Can't remove this value"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.stratigraphy_top" :searchable="true" @search-change="autcompleteStratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_top_free`">{{ $t('locality.stratigraphy_top_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_top_free" v-model="locality.stratigraphy_top_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- STRAT LOWER AND STRAT LOWER FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_base`">{{ $t('locality.stratigraphy_base') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.stratigraphy_base" deselect-label="Can't remove this value"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.stratigraphy_top" :searchable="true" @search-change="autcompleteStratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_base_free`">{{ $t('locality.stratigraphy_base_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_base_free" v-model="locality.stratigraphy_base_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- MAAAMET PA AND EELIS ID -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`maaamet_pa_id`">{{ $t('locality.maaamet_pa_id') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="maaamet_pa_id" v-model="locality.maaamet_pa_id" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`eelis`">{{ $t('locality.eelis') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="eelis" v-model="locality.eelis" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks_location`">{{ $t('locality.remarks_location') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks_location" v-model="locality.remarks_location" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- ADDITIONAL INFO -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks`">{{ $t('locality.remarks') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks" v-model="locality.remarks" type="text" size="sm"
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
    fetchLocality
  } from "@/assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {autocompleSearch} from "../../assets/js/api/apiCalls";
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
        let uploadableObject = cloneDeep(objectToUpload)
        console.log('This object is sent in string format:\n'+uploadableObject)
        return JSON.stringify(uploadableObject)
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

          const dataToUpload = this.formatDataForUpload(this[object]);
          console.log(dataToUpload)
          formData.append('data', dataToUpload)

          this.$http.post(this.apiUrl + 'add/'+object+'/', formData, {
            before(request) {
              this.previousRequest = request
            },
            progress: (e) => {
              if (e.lengthComputable) {
                // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
                this.loadingPercent = Math.round((e.loaded / e.total) * 100)
              }
            }
          }).then(response => {
            console.log(response)
            this.sendingData = false
            if (response.status === 200) {
              if (typeof response.body.message !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et});
                } else {
                  toastSuccess({text: response.body.message});
                }

                if (!addAnother) {
                  this.$router.push({ path: '/'+object })
                }
              }
              if (typeof response.body.error !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
                  toastError({text: response.body.error_et});
                } else {
                  toastError({text: response.body.error});
                }

              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.sendingData = false
            toastError({text: this.$t('messages.uploadError')})
          })

        } else if (this.sendingData) {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }

      },
      reset(object) {
        this[object] = {}
      },
      getAutocompleteQueryParameters(type,val) {
        let query = '';
        switch (type) {
          case 'locality': query = `locality/?multi_search=value:${val};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`; break;
          case 'stratigraphy': query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&fields=id,stratigraphy,stratigraphy_en`; break;
          default:
            break;
        }
        return query
      },

      autcompleteLocalitySearch(value){
        this.autocompliteSearch(value,this.autocomplete.loaders.locality,'locality','parent')
      },
      autcompleteStratigraphySearch(value){
        this.autocompliteSearch(value,this.autocomplete.loaders.stratigraphy,'stratigraphy','stratigraphy_top')
      },
      autocompliteSearch(value,isLoading, type, options) {
        if(value.length < 3)  this.autocomplete[options] = [];
        if(value.length > 2) {
          let query = this.getAutocompleteQueryParameters(type,value)
          if(query.length === 0) return
          isLoading = true;
          autocompleSearch(query).then((response) => {
            isLoading = false;
            this.autocomplete[options] = this.handleResponse(response)
          });
        }
      },
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
          loaders: { locality:false, stratigraphy:false },
          localityTypes: [], parent: [], extent: [], coordPrecision: [], coordMethod: [],
          coordAssigner: [], country: [], county: [], parish: [], stratigraphy_top: [], stratigraphy_base: []
        },
        requiredFields: ['locality'],
        locality: {}
      }
    },

    computed: {
      commonLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },
      localityLabel() {
        return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
      },
      stratigraphyLabel() {
        return this.$i18n.locale === 'ee' ? 'stratigraphy' : 'stratigraphy_en'
      }
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
    },
    methods: {

    }
  }

</script>

<style scoped>

</style>
