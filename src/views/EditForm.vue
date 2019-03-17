<template>
  <div class="edit-form">

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
      </div>
    </div>

    <router-view v-on:data-loaded="setData"/>

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
  export default {
    name: "EditForm",
    components: {
      ConfirmationBox,
      Log
    },
    data(){
      return {
        data : null,
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
      setData(data) {
        this.data = data
        if(this.data !== null) this.formattedData = data;
      }
    }
  }
</script>
