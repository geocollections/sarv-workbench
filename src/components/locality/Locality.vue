<template>
  <div class="reference">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <div class="d-flex flex-row flex-wrap">
      <div class="col-sm-6" v-for="field,idx in fields">
        <label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }}:</label>
        <b-form-input style="display: inline !important; " class="col-sm-8 mb-2"
                      v-model="locality[field.id]" :id="field.id" :type="field.type" :state="isDefinedAndNotEmpty(locality[field.id])">
        </b-form-input>
      </div>
    </div>
    <!-- LOCALITY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('locality.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" v-model="locality.locality" :state="isDefinedAndNotEmpty(locality.locality)" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">

      </div>

      <div class="col-sm-4 mb-2">

      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [mixin],
    data(){
        return {
          fields:[
            {id:"locality",title:"locality.locality",type:"text"},
            {id:"country",title:"locality.country",type:"text"},
            {id:"county",title:"locality.county",type:"text"},
            {id:"parish",title:"locality.county",type:"text"},
            {id:"area",title:"locality.area",type:"text"}
          ],
          locality: {}
        }
    }
  }

</script>

<style scoped>

</style>
