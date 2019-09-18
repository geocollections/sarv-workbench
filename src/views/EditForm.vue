<template>

    <div class="edit-form">

      <div class="row mt-4 page-title">
        <div class="col">
          <p class="h2 float-left">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
        </div>
      </div>

      <scroll-to-links v-show="objectExists" v-if="object !== 'attachment'"/>

      <router-view v-show="objectExists"
                   v-on:data-loaded="setData"
                   v-on:set-object="setObject"
                   v-on:related-data-info="setRelatedData"
                   v-on:save-as-new="saveAsNew"
                   v-on:object-exists="toggleObjectState"/>

      <object-does-not-exist v-if="!objectExists" />

      <bottom-options :object="object" :is-navigation-shown="$route.meta.isNavigationShown" v-if="$route.meta.isBottomOptionShown"/>

      <save-as-new-modal v-if="data !== null" :title-extra="'Some title'"
                         :related-data="relatedData" :object="object" :object-id="data.id"/>
<!--      commented on 04.09.2019-->
<!--      <confirm-tab-close title="TAB"/>-->
      <confirm-page-close :title="$t($route.meta.heading) + ': '  + $route.params.id"/>

      <!-- LOGS -->
      <log v-if="data != null && objectExists" :table="$route.meta.table" :data="data" :formatted-data="formattedData" :key="logComponentKey"></log>
    </div>

</template>

<script>
  import BottomOptions from "../components/partial/BottomOptions";
  import Log from '@/components/partial/Log.vue'
  import SaveAsNewModal from "../components/partial/SaveAsNewModal";
  import ConfirmTabClose from "../components/partial/modals/ConfirmTabClose";
  import ConfirmPageClose from "../components/partial/modals/ConfirmPageClose";
  import ScrollToLinks from "../components/partial/ScrollToLinks";
  import ObjectDoesNotExist from "../components/partial/errors/ObjectDoesNotExist";

  export default {
    name: "EditForm",
    components: {
      ObjectDoesNotExist,
      ScrollToLinks,
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
        objectExists: true
      }
    },

    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
      }
    },

    methods: {
      saveAsNew(){
        this.$emit('show-save-as-new-modal',true)
      },

      setData(data) {
        console.log(data)
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

      toggleObjectState(state) {
        this.objectExists = state
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
