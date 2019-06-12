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
      <confirm-tab-close title="TAB"/>
      <confirm-page-close :title="$t($route.meta.heading) + ': '  + $route.params.id"/>

      <!-- LOGS -->
      <log v-if="data !== null" :table="$route.meta.table" :data="data" :formatted-data="formattedData" :key="logComponentKey"></log>
    </div>

</template>

<script>
  import BottomOptions from "@/components/partial/BottomOptions";
  import Log from '@/components/partial/Log.vue'
  import SaveAsNewModal from "../components/partial/SaveAsNewModal";
  import ConfirmTabClose from "../components/partial/modals/ConfirmTabClose";
  import ConfirmPageClose from "../components/partial/modals/ConfirmPageClose";

  export default {
    name: "EditForm",
    components: {
      ConfirmPageClose,
      ConfirmTabClose,
      BottomOptions,
      SaveAsNewModal,
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
    // TODO: Trigger modal here only if user has unsaved data
    beforeRouteUpdate(to, from, next) {
      // console.log(this.$bvModal.show('confirm-page-close'))
      next()
    },
    // TODO: Trigger modal also here only if user has unsaved data
    beforeRouteLeave(to, from, next) {
      this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', null)
      next()
    },
  }
</script>
<style scoped>

</style>
