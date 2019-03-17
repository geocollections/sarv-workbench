<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- NUMBER AND NUMBER ADDITIONAL  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`number`">{{ $t('sample.number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number" v-model="sample.number" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`number_additional`">{{ $t('sample.number_additional') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number_additional" v-model="sample.number_additional" type="text"></b-form-input>
      </div>
    </div>

    <!-- FIELD NUMBER AND SERIES  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`number_field`">{{ $t('sample.number_field') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number_field" v-model="sample.number_field" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`series`">{{ $t('sample.series') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.series" deselect-label="Can't remove this value"
                         label="name" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.series"
                         :options="autocomplete.series" :searchable="true" @search-change="autcompleteSampleSeriesSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- SAMPLE PURPOSE AND TYPE  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`sample_purpose`">{{ $t('sample.sample_purpose') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="sample.sample_purpose" v-if="isDefinedAndNotEmpty(autocomplete.purpose)"
                         id="type"
                         :options="autocomplete.purpose"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`sample_type`">{{ $t('sample.sample_type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="sample_type" v-model="sample.sample_type" type="text"></b-form-input>
      </div>
    </div>
    <!-- SAMPLE PARENT AND SPECIMEN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`parent_sample`">{{ $t('sample.parent_sample') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.parent_sample" deselect-label="Can't remove this value"
                         label="number" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.sample"
                         :options="autocomplete.sample" :searchable="true" @search-change="autcompleteSampleSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.number}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`parent_specimen`">{{ $t('sample.parent_specimen') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.parent_specimen" deselect-label="Can't remove this value"
                         label="specimen_id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.specimen"
                         :options="autocomplete.specimen" :searchable="true" @search-change="autcompleteSpecimenSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.specimen_id}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- LOCALITY AND LOCALITY FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('sample.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.locality" deselect-label="Can't remove this value"
                         :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.locality"
                         :options="autocomplete.locality" :searchable="true" @search-change="autcompleteLocalitySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`locality_free`">{{ $t('sample.locality_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality_free" v-model="sample.locality_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- DEPTH AND DEPTH INTERVAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('sample.depth') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth" v-model="sample.depth" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`depth_interval`">{{ $t('sample.depth_interval') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth_interval" v-model="sample.depth_interval" type="number"></b-form-input>
      </div>
    </div>

    <!-- LATITUDE AND LONGITUDE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`latitude`">{{ $t('sample.latitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="latitude" v-model="sample.latitude" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`longitude`">{{ $t('sample.longitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="longitude" v-model="sample.longitude" type="number"></b-form-input>
      </div>
    </div>

    <!-- STRATIGRAPHY AND LITHOSTRATIGRAPHY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy`">{{ $t('sample.stratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.stratigraphy" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.stratigraphy"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.stratigraphy" :searchable="true" @search-change="autcompleteStratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`lithostratigraphy`">{{ $t('sample.lithostratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.lithostratigraphy" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.lithostratigraphy"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.lithostratigraphy" :searchable="true" @search-change="autcompleteLithostratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- STRATIGRAPHY FREE AND STRATIGRAPHY_BED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_free`">{{ $t('sample.stratigraphy_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_free" v-model="sample.stratigraphy_free" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_bed`">{{ $t('sample.stratigraphy_bed') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_bed" v-model="sample.stratigraphy_bed" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT COLLECTED AND AGENT COLLECTED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_collected`">{{ $t('sample.agent_collected') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.agent_collected" deselect-label="Can't remove this value"
                         label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.agent"
                         :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`agent_collected_free`">{{ $t('sample.agent_collected_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="agent_collected_free" v-model="sample.agent_collected_free" type="text"></b-form-input>
      </div>
    </div>
    <!-- DATE COLLECTED AND DATE COLLECTED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_collected`">{{ $t('sample.date_collected') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_collected"
                    v-model="sample.date_collected"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_collected_free`">{{ $t('sample.date_collected_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_collected_free" v-model="sample.date_collected_free" type="text"></b-form-input>
      </div>
    </div>
    <!-- CLASSIFICATION ROCK AND ROCK -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`classification_rock`">{{ $t('sample.classification_rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.classification_rock" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.rock"
                         :label="rockLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.rock" :searchable="true" @search-change="autcompleteRockSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`rock`">{{ $t('sample.rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock" v-model="sample.rock" type="text"></b-form-input>
      </div>
    </div>
    <!-- ROCK EN AND FOSSILS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`rock_en`">{{ $t('sample.rock_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock_en" v-model="sample.rock_en" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`fossils`">{{ $t('sample.fossils') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="fossils" v-model="sample.fossils" type="text"></b-form-input>
      </div>
    </div>
    <!-- STORAGE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`mass`">{{ $t('sample.mass') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="mass" v-model="sample.mass" type="number"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`storage`">{{ $t('sample.storage') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.storage" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.storage" id="storage"
                         label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.storage" :searchable="true" @search-change="autcompleteStorageSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>
    <!-- OWNER-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`storage_additional`">{{ $t('sample.storage_additional') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.storage_additional" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.additional_storage" id="storage_additional"
                         label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.storage_additional" :searchable="true" @search-change="autcompleteAdditionalStorageSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>

      <div class="col-sm-2">
        <label :for="`owner`">{{ $t('sample.owner') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.owner" deselect-label="Can't remove this value"
                         label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.owner"
                         :options="autocomplete.agent" :searchable="true" @search-change="autcompleteOwnerSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>
    <!-- IS PRIVATE AND MASS-->
    <div class="row mb-3 mt-3">
      <div class="col">
        <b-form-checkbox id="rock_palaeontology" v-model="sample.rock_palaeontology" :value="true" :unchecked-value="false">
          {{ $t('sample.palaeontology') }}
        </b-form-checkbox>

        <b-form-checkbox id="analysis" v-model="sample.analysis" :value="true" :unchecked-value="false">
          {{ $t('sample.analysis') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_private" v-model="sample.is_private" :value="true" :unchecked-value="false">
          {{ $t('sample.is_private') }}
        </b-form-checkbox>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
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
    fetchSample,
    fetchSamplePurpose
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import Datepicker from 'vue2-datepicker'
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
    export default {
      name: "Sample",
      components: {
        BFormInput,
        FontAwesomeIcon,
        Datepicker,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,autocompleteFieldManipulation],
      data() {
        return {
          activeTab: 'analyses',
          copyFields : ['id','number','number_additional','number_field','series','sample_purpose','sample_type',
            'parent_sample','parent_specimen','depth','depth_interval','latitude','longitude','stratigraphy','lithostratigraphy',
            'stratigraphy_free','stratigraphy_bed','agent_collected','agent_collected_free','date_collected','date_collected_free',
            'classification_rock','rock','rock_en','fossils','mass','storage','storage_additional','owner',
            'rock_palaeontology','analysis','locality','locality_free','remarks','is_private'],
          autocomplete: {
            loaders: { series:false, sample:false,specimen:false, locality:false, stratigraphy:false,
              lithostratigraphy:false, agent:false, rock:false, storage:false, additional_storage:false, owner:false   },
            series: [],purpose: [],sample:[],specimen:[],locality:[],stratigraphy:[],lithostratigraphy:[],agent:[],
            rock:[],storage:[],storage_additional:[],owner:[]
          },
          requiredFields: ['number'],
          sample: {}
        }
      },
      created() {
        fetchSamplePurpose().then(response => {
          this.autocomplete.purpose = this.handleResponse(response);
        });

        if(this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchSample(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if(handledResponse.length > 0) {
              this.sample = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.sample)
              this.removeUnnecessaryFields('sample', this.copyFields);
              this.$emit('data-loaded',this.sample)
              this.sendingData = false;
            } else {
              this.sendingData = false;
            }
          });
        }
      },

      methods: {
        formatDataForUpload(objectToUpload) {
          let uploadableObject = cloneDeep(objectToUpload)

          if (objectToUpload.latitude === '')
            uploadableObject.latitude = this.isDefinedAndNotNull(objectToUpload.latitude) ? objectToUpload.latitude.toFixed(6) : null
          if (objectToUpload.longitude === '')
            uploadableObject.longitude = this.isDefinedAndNotNull(objectToUpload.longitude) ? objectToUpload.longitude.toFixed(6) : null
          if (this.isDefinedAndNotNull(objectToUpload.rock_palaeontology)) uploadableObject.rock_palaeontology = objectToUpload.rock_palaeontology === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.analysis)) uploadableObject.analysis = objectToUpload.analysis === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
          //autocomplete fields

          if (this.isDefinedAndNotNull(objectToUpload.series)) uploadableObject.series = objectToUpload.series.id
          if (this.isDefinedAndNotNull(objectToUpload.sample_purpose)) uploadableObject.sample_purpose = objectToUpload.sample_purpose.id
          if (this.isDefinedAndNotNull(objectToUpload.parent_sample)) uploadableObject.parent_sample = objectToUpload.parent_sample.id
          if (this.isDefinedAndNotNull(objectToUpload.parent_specimen)) uploadableObject.parent_specimen = objectToUpload.parent_specimen.id
          if (this.isDefinedAndNotNull(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id
          if (this.isDefinedAndNotNull(objectToUpload.stratigraphy)) uploadableObject.stratigraphy = objectToUpload.stratigraphy.id
          if (this.isDefinedAndNotNull(objectToUpload.lithostratigraphy)) uploadableObject.lithostratigraphy = objectToUpload.lithostratigraphy.id
          if (this.isDefinedAndNotNull(objectToUpload.agent_collected)) uploadableObject.agent_collected = objectToUpload.agent_collected.id
          if (this.isDefinedAndNotNull(objectToUpload.classification_rock)) uploadableObject.classification_rock = objectToUpload.classification_rock.id
          if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id
          // console.log('This object is sent in string format:\n'+JSON.stringify(uploadableObject))
          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.sample.series = {name:obj.series__name,id:obj.series_id}
          this.sample.sample_purpose = {value:obj.sample_purpose__value,value_en:obj.sample_purpose__value_en,id:obj.sample_purpose__id}
          this.sample.parent_sample = {number:obj.parent_sample__number,id:obj.parent_sample}
          this.sample.parent_specimen = {specimen_id:obj.parent_specimen__specimen_id,id:obj.parent_specimen}
          this.sample.locality = {locality:obj.locality__locality,locality_en:obj.locality__locality_en,id:obj.locality__locality__id}
          this.sample.stratigraphy = {stratigraphy:obj.stratigraphy__stratigraphy,stratigraphy_en:obj.stratigraphy__stratigraphy_en,id:obj.stratigraphy__stratigraphy__id}
          this.sample.lithostratigraphy = {stratigraphy:obj.lithostratigraphy__stratigraphy,stratigraphy_en:obj.lithostratigraphy__stratigraphy_en,id:obj.lithostratigraphy_id}
          this.sample.agent_collected = {agent:obj.agent_collected__agent,id:obj.agent_collected__id}
          this.sample.classification_rock = {locality:obj.classification_rock__name,locality_en:obj.classification_rock__name_en,id:obj.classification_rock__id}
          this.sample.owner = {agent:obj.owner__agent,id:obj.owner__id}
        },

        setActiveTab(type){
          this.activeTab = type;
        }

      },
      watch: {
        'relatedData.page': {
          handler: function (newVal) {
            this.setActiveTab(this.activeTab)
          },
          deep: true
        }
      }

    }
</script>

<style scoped>

</style>
