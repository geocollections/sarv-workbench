<template>
  <div>

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <div class="d-flex flex-row flex-wrap">
      <div :class="field.customFieldClass === undefined ? 'col-sm-6' : field.customFieldClass" v-for="field,idx in fields">
        <label class="p-0" :class="field.customLabelClass === undefined ? 'col-sm-4 ' : field.customLabelClass"  :for="field.id">{{ $t(field.title) }}:</label>
        <!--INPUT FIELD TYPE-->
        <b-form-input v-if="field.fieldType === undefined" style="display: inline !important; " class="mb-2"
                      :class="field.customInputClass === undefined ? 'col-sm-8' : field.customInputClass"
                      v-model="locality[field.id]" :id="field.id" :type="field.type"
                      :state="field.required === undefined ? null : isDefinedAndNotEmpty(locality[field.id])"></b-form-input>

        <!--TEXTAREA FIELD TYPE-->
        <b-form-textarea v-if="field.fieldType && field.fieldType === 'textarea'"
                         style="display: inline !important; "
                         :class="field.customInputClass === undefined ? 'col-sm-8' : field.customInputClass"
                         v-model="locality[field.id]" :id="field.id" :type="field.type" size="sm" :rows="1" :max-rows="20"
                         :state="field.required === undefined ? null : isDefinedAndNotEmpty(locality[field.id])"></b-form-textarea>

        <!--MULTISELECT FIELD TYPE-->
        <div class="col-sm-8" v-if="field.fieldType && field.fieldType === 'autocomplete'" >
          <vue-multiselect v-model="locality[field.id]"
                           :id="field.id"
                           :options="field.options"
                           :track-by="field.id"
                           :loading="field.searching"
                           :placeholder="$t('add.inputs.autocomplete')"
                           :show-labels="false" :label="typeLabel">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
  import {fetchListLocalityTypes,fetchListLocalityExtent,fetchListCoordinateMethod,fetchListCoordinatePrecision} from "@/assets/js/api/apiCalls";

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
            localityTypes: []
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
            {id:"country",title:"locality.country",type:"text"},
            {id:"county",title:"locality.county",type:"text"},
            {id:"parish",title:"locality.county",type:"text"},
            {id:"area",title:"locality.area",type:"text"},
            {id:"stat_top",title:"locality.stat_top",type:"text"},
            {id:"stat_top_free",title:"locality.stat_top_free",type:"text"},
            {id:"stat_lower",title:"locality.stat_lower",type:"text"},
            {id:"stat_lower_free",title:"locality.stat_lower_free",type:"text"},
            {id:"maaamaet_pa",title:"locality.maaamaet_pa",type:"number"},
            {id:"eelis_id",title:"locality.eelis_id",type:"text"},
            {id:"description",title:"locality.description",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
            {id:"additionalInfo",title:"locality.additionalInfo",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
          ]
        }
    },
    computed: {
      typeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },
    },
    created() {
      fetchListLocalityTypes().then(response => {
        this.getField('type')[0].options = this.handleResponse(response);
      })
      fetchListLocalityExtent().then(response => {
        this.getField('extent')[0].options = this.handleResponse(response);
      })
      fetchListCoordinateMethod().then(response => {
        this.getField('coordMethod')[0].options = this.handleResponse(response);
      })
      fetchListCoordinatePrecision().then(response => {
        this.getField('coordPrecision')[0].options = this.handleResponse(response);
      })
    },
    methods: {
      getField(field) {
        return this.fields.filter(function (val, i) {
          return val.id === field;
        }, this);
      }
    }
  }

</script>

<style scoped>

</style>
