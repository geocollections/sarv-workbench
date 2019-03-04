<template>
  <div>
    
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <div class="d-flex flex-row flex-wrap row">
      <div :class="field.customFieldClass === undefined ? 'col-sm-6' : field.customFieldClass" v-for="field,idx in fields">
        <label class="p-0" :class="field.customLabelClass === undefined ? 'col-sm-4 ' : field.customLabelClass"  :for="field.id">{{ $t(field.title) }}:</label>
        <b-form-input v-if="field.fieldType === undefined" style="display: inline !important; " class="mb-2"
                      :class="field.customInputClass === undefined ? 'col-sm-8' : field.customInputClass"
                      v-model="locality[field.id]" :id="field.id" :type="field.type"
                      :state="field.required === undefined ? null : isDefinedAndNotEmpty(locality[field.id])"></b-form-input>

        <b-form-textarea v-if="field.fieldType && field.fieldType === 'textarea'"
                         style="display: inline !important; " class="mb-2"
                         :class="field.customInputClass === undefined ? 'col-sm-8' : field.customInputClass"
                         v-model="locality[field.id]" :id="field.id" :type="field.type" size="sm" :rows="1" :max-rows="20"
                         :state="field.required === undefined ? null : isDefinedAndNotEmpty(locality[field.id])"></b-form-textarea>
        <!--MULTISELECT FIELD TYPE-->
        <!--<vue-multiselect></vue-multiselect>-->
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";

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
      cancelRequest() {this.previousRequest.abort()}
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
          fields:[
            {id:"locality",title:"locality.locality",type:"text", required: true},
            {id:"locality_en",title:"locality.locality_en",type:"text", required: true},
            {id:"number",title:"locality.number",type:"number", customFieldClass:"col-sm-6", customLabelClass:"col-sm-4", customInputClass:"col-sm-8"},
            {id:"other_number",title:"locality.other_number",type:"number",customFieldClass:"col-sm-6",customLabelClass:"col-sm-4", customInputClass:"col-sm-8"},
            {id:"type",title:"locality.type",type:"text"},
            {id:"belongs",title:"locality.belongs",type:"text"},
            {id:"latitude",title:"locality.latitude",type:"text"},
            {id:"longitude",title:"locality.longitude",type:"text"},
            {id:"altitude",title:"locality.altitude",type:"text"},
            {id:"vertical",title:"locality.vertical",type:"text"},
            {id:"range",title:"locality.range",type:"text"},
            {id:"coordX",title:"locality.coordX",type:"number"},
            {id:"coordY",title:"locality.coordY",type:"number"},
            {id:"coordSystem",title:"locality.coordSystem",type:"text"},
            {id:"coordAccuracy",title:"locality.coordAccuracy",type:"text"},
            {id:"coordMethod",title:"locality.coordMethod",type:"text"},
            {id:"coordAssigner",title:"locality.coordAssigner",type:"text"},
            {id:"country",title:"locality.country",type:"text"},
            {id:"county",title:"locality.county",type:"text"},
            {id:"parish",title:"locality.county",type:"text"},
            {id:"area",title:"locality.area",type:"text"},
            {id:"stat_top",title:"locality.stat_top",type:"text"},
            {id:"stat_top_free",title:"locality.stat_top_free",type:"text"},
            {id:"stat_lower",title:"locality.stat_lower",type:"text"},
            {id:"stat_lower_free",title:"locality.stat_lower_free",type:"text"},
            {id:"maaamaet_pa",title:"locality.maaamaet_pa",type:"text"},
            {id:"eelis_id",title:"locality.eelis_id",type:"text"},
            {id:"description",title:"locality.description",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
            {id:"additionalInfo",title:"locality.additionalInfo",fieldType: "textarea", type:"text",customFieldClass:"col-sm-12", customLabelClass:"col-sm-2", customInputClass:"col-sm-10"},
          ],
          locality: {}
        }
    }
  }

</script>

<style scoped>

</style>
