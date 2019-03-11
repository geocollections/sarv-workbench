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
        <b-form-input id="series" v-model="sample.series" type="text" disabled="true"></b-form-input>
      </div>
    </div>

    <!-- SAMPLE PURPOSE AND TYPE  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`sample_purpose`">{{ $t('sample.sample_purpose') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="sample_purpose" v-model="sample.sample_purpose" type="text" disabled="true"></b-form-input>
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
        <b-form-input id="parent_sample" v-model="sample.parent_sample" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`parent_specimen`">{{ $t('sample.parent_specimen') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="parent_specimen" v-model="sample.parent_specimen" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- LOCALITY AND LOCALITY FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('sample.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" v-model="sample.locality" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`locality_free`">{{ $t('sample.locality_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality_free" v-model="sample.locality_free" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- DEPTH AND DEPTH INTERVAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('sample.depth') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth" v-model="sample.depth" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`depth_interval`">{{ $t('sample.depth_interval') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth_interval" v-model="sample.depth_interval" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- LATITUDE AND LONGITUDE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`latitude`">{{ $t('sample.latitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="latitude" v-model="sample.latitude" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`longitude`">{{ $t('sample.longitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="longitude" v-model="sample.longitude" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- STRATIGRAPHY AND LITHOSTRATIGRAPHY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy`">{{ $t('sample.stratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy" v-model="sample.stratigraphy" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`lithostratigraphy`">{{ $t('sample.lithostratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="lithostratigraphy" v-model="sample.lithostratigraphy" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- STRATIGRAPHY FREE AND STRATIGRAPHY_BED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_free`">{{ $t('sample.stratigraphy_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_free" v-model="sample.stratigraphy_free" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_bed`">{{ $t('sample.stratigraphy_bed') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_bed" v-model="sample.stratigraphy_bed" type="text"  disabled="true"></b-form-input>
      </div>
    </div>

    <!-- AGENT COLLECTED AND STRATIGRAPHY_BED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_collected`">{{ $t('sample.agent_collected') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="agent_collected" v-model="sample.agent_collected" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`agent_collected_free`">{{ $t('sample.agent_collected_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="agent_collected_free" v-model="sample.agent_collected_free" type="text"  disabled="true"></b-form-input>
      </div>
    </div>
    <!-- DATE COLLECTED AND DATE COLLECTED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_collected`">{{ $t('sample.date_collected') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_collected" v-model="sample.date_collected" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`date_collected_free`">{{ $t('sample.date_collected_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_collected_free" v-model="sample.date_collected_free" type="text"  disabled="true"></b-form-input>
      </div>
    </div>
    <!-- CLASSIFICATION ROCK AND ROCK -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`classification_rock`">{{ $t('sample.classification_rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="classification_rock" v-model="sample.classification_rock" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`rock`">{{ $t('sample.rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock" v-model="sample.rock" type="text"  disabled="true"></b-form-input>
      </div>
    </div>
    <!-- ROCK EN AND FOSSILS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`rock_en`">{{ $t('sample.rock_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock_en" v-model="sample.rock_en" type="text" disabled="true"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`fossils`">{{ $t('sample.fossils') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="fossils" v-model="sample.fossils" type="text"  disabled="true"></b-form-input>
      </div>
    </div>
    <!-- STORAGE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`mass`">{{ $t('sample.mass') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="mass" v-model="sample.mass" type="text"  disabled="true"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`storage`">{{ $t('sample.storage') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="storage" v-model="sample.storage" type="text" disabled="true"></b-form-input>
      </div>
    </div>
    <!-- OWNER-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`storage_additional`">{{ $t('sample.storage_additional') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="storage_additional" v-model="sample.storage_additional" type="text"  disabled="true"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`owner`">{{ $t('sample.owner') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="owner" v-model="sample.owner" type="text" disabled="true"></b-form-input>
      </div>
    </div>
    <!-- IS PRIVATE AND MASS-->
    <div class="row mb-3 mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="sample.rock_palaeontology" :value="true" :unchecked-value="false">
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
    fetchSample
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'

  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
    export default {
      name: "Sample",
      components: {
        BFormInput,
        FontAwesomeIcon,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,autocompleteFieldManipulation],
      data() {
        return {
          activeTab: 'analyses',
          requiredFields: ['sample'],
          sample: {}
        }
      },

      computed: {
        commonLabel() {
          return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
        }
      },
      created() {
        if(this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchSample(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if(handledResponse.length > 0) {
              this.sample = this.handleResponse(response)[0];
              this.$emit('data-loaded',this.sample)
              this.sendingData = false;
            } else {
              this.sendingData = false;
            }
          });
        }
      },

      methods: {
        fillAutocompleteFields(obj){
          // this.locality.type = {value:obj.type__value,value_en:obj.type__value_en,id:obj.type__id}
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
