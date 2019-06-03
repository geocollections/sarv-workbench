<template>

    <div class="edit-form">

      <div class="row mt-4 page-title">
        <div class="col">
          <p class="h2 float-left">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
        </div>
      </div>

      <router-view v-on:data-loaded="setData" v-on:set-object="setObject" v-on:related-data-info="setRelatedData"/>

      <bottom-options :object="object" :is-navigation-shown="$route.meta.isNavigationShow" v-if="$route.meta.isBottomOptionShown"/>

      <save-as-new-modal v-if="data !== null" :title-extra="'Some title'"
                         :related-data="relatedData" :object="object" :object-id="data.id"/>
      <confirmation-box :title-extra="'SOME TITLE'"
                        custom-question="confirmation.relatedDataQuestion"
                        :table="$route.meta.table"/>

      <!-- LOGS -->
      <log v-if="data !== null" :table="$route.meta.table" :data="data" :formatted-data="formattedData" :key="logComponentKey"></log>
    </div>

</template>

<script>
  import BottomOptions from "@/components/partial/BottomOptions";
  import Log from '@/components/partial/Log.vue'
  import ConfirmationBox from "../components/partial/ConfirmationBoxOlesja";
  import SaveAsNewModal from "../components/partial/SaveAsNewModal";
  import Sidebar from "../components/partial/Sidebar";
  export default {
    name: "EditForm",
    components: {
      Sidebar,
      BottomOptions,
      SaveAsNewModal,
      ConfirmationBox,
      Log
    },
    data(){
      return {
        data : null,
        agent: null,
        object : null,
        relatedData:[],
        formattedData:null,
        isConfirmation: false,
        logComponentKey: 0,
      }
    },

    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
      }
    },

    created: function () {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.agent = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null,
          user: user.user,
        }
        //console.log(this.agent);
      }
    },

    methods: {
      saveAsNew(){
        this.$emit('show-save-as-new-modal',true)
      },

      setData(data) {
        this.data = data
        if(this.data !== null) this.formattedData = data;
        this.forceRerender()
      },
      setObject(object) {
        this.object = object
      },

      setRelatedData(data){
        this.relatedData = data
      },
      forceRerender() { this.logComponentKey += 1; },
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', null)
      console.log()
      if(from.meta.table && from.meta.table !== 'site')
        this.$root.$emit('show-sidebar', false);
      next()
    },
  }
</script>
<style scoped>

</style>
