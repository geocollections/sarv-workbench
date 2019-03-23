<template>
  <div class="edit-form">

    <div class="row mt-4 page-title">
      <div class="col">
        <p class="h2 float-left">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
        <span class="float-right"><button class="btn btn-primary mb-2" @click="saveAsNew">{{ $t('add.saveAsNew') }}</button></span>
      </div>
    </div>
    <router-view v-on:data-loaded="setData" v-on:related-data-info="setRelatedData"/>

    <save-as-new-modal :title-extra="'Some title'" :related-data="relatedData"/>
    <confirmation-box :title-extra="'SOME TITLE'"
                      custom-question="confirmation.relatedDataQuestion"
                      :table="$route.meta.table"/>
    
    <!-- LOGS -->
    <log v-if="data !== null" :table="$route.meta.table" :data="data" :formatted-data="formattedData"></log>
  </div>
</template>

<script>
  import Log from '@/components/partial/Log.vue'
  import ConfirmationBox from "../components/partial/ConfirmationBoxOlesja";
  import SaveAsNewModal from "../components/partial/SaveAsNewModal";
  export default {
    name: "EditForm",
    components: {
      SaveAsNewModal,
      ConfirmationBox,
      Log
    },
    data(){
      return {
        data : null,
        relatedData:[],
        formattedData:null,
        isConfirmation: false
      }
    },
    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
      }
    },
    methods: {
      saveAsNew(){
        this.$root.$emit('show-save-as-new-modal',true)
      },
      setData(data) {
        this.data = data
        if(this.data !== null) this.formattedData = data;
      },
      setRelatedData(data){
        this.relatedData = data
      }
    }
  }
</script>
<style scoped>

</style>