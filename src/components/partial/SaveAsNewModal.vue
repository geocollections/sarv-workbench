<template>
  <div class="save-as-new-modal">
    <spinner v-if="modalSendingData" class="loading-overlay" size="massive" :message="$t('add.overlay')"></spinner>

    <b-modal id="saveAsNewForm"
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             size="lg"
             lazy
             scrollable
             ref="saveAsNewForm"
             :title="titleExtra ? titleExtra : $t(title)">
      <p class="my-2 h5">{{ $t('saveAsNewModal.text') }}</p>

      <div class="row">
        <div class="col">
          <label :for="`rock_en`">{{ $t('saveAsNewModal.fieldLabel') }}:</label>
          <span class="col-md-4 pr-0 float-right"><b-form-input id="rock_en" v-model="numberOfCopies" type="number" :max="100"></b-form-input></span>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label :for="`rock_en`">{{ $t('saveAsNewModal.text2') }}:</label>
          <div class="col-md-4 pr-0 float-right">
            <span  v-for="data in relatedData">
              <b-form-checkbox v-model="relatedDataChoice[data]" :value="true" :unchecked-value="false">{{$t(object+'.relatedTables.'+data)}}</b-form-checkbox>
            </span>
          </div>
        </div>
      </div>
      <div class="row" v-if="relatedDataChoice['preparation'] === true && preparations.length > 0">
        <!--BEST would be to implement checking if number is unique-->
        <div class="col-12"><label>{{ $t('saveAsNewModal.text3') }}</label></div>
        <div class="col-12">
          <div class="table-responsive-sm">
            <table class="table table-hover table-bordered  related-table">
              <thead class="thead-light">
              <tr>
                <th>ID</th>
                <th>{{ $t('preparation.preparation_number') }}</th>
                <th>{{ $t('preparation.fossil_group') }}</th>
                <th>{{ $t('preparation.storage') }}</th>
                <th>{{ $t('preparation.remarks') }}</th>
                <th>{{ $t('preparation.method_id') }}</th>
                <th>{{$t('taxon.is_private')}}</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(entity, index) in preparations">
                <td>{{entity.id}}</td>
                <td><b-form-input v-model="entity.preparation_number" type="text"/></td>
                <td>{{entity.taxon__taxon}}</td>
                <td>{{entity.storage__location}}</td>
                <td>{{entity.remarks}}</td>
                <td>{{entity.analysis}}</td>
                <td class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <template slot="modal-footer">
        <b-button variant="outline-danger" @click="hideModal">{{ this.$t('saveAsNewModal.cancel') }}</b-button>
        <b-button variant="outline-success"
                  @click="$root.$emit('save-object-as-new', { object: object, numberOfCopies: numberOfCopies, relatedData:relatedDataChoice, preparations:preparations })"
        >{{ $t('saveAsNewModal.save') }}</b-button>
      </template>

    </b-modal>

  </div>
</template>

<script>
  import {
    fetchSamplePreparation,
  } from "../../assets/js/api/apiCalls";
  import Spinner from 'vue-simple-spinner'
  export default {
    props: {
      title: {
        type: String,
        default: null
      },
      titleExtra: {
        type: String,
        default: null
      },
      customText: {
        type: String,
        default: null
      },
      object: {
        type: String,
        default: null
      },
      objectId: {
        type: Number,
        default: null
      },
      relatedData: {
        type: Array,
        default: []
      }
    },
    components:{Spinner},
    name: "SaveAsNewModal",
    data() {
      return {
        numberOfCopies:1,
        relatedDataChoice:[],
        show: true,
        modalSendingData:false,
        preparations:[]
      }
    },
    mounted(){
      this.$parent.$on('show-save-as-new-modal', this.showModal);
      this.$root.$on('close-save-as-new-modal', this.hideModal);
      this.$root.$on('copied-data-saved', this.hideModalAfterSaving);
    },
    methods: {
      showModal(){
        this.$refs.saveAsNewForm.show()
        if(this.object === 'sample') this.handleSpecialCase()
      },
      hideModal(){
        this.$refs.saveAsNewForm.hide()
        this.$root.$off('copied-data-saved');
      },
      hideModalAfterSaving(status){
        this.modalSendingData = false;

        if(status === 'SAVED') {
          this.hideModal();
        } else if(status === 'PROBLEM') {
          console.log("SOME DATA WAS NOT SAVED")
        } else {
          console.log("SOMETHING ELSE")
        }
      },
      //BETTER to USER $store... but here I need full list of preparations not ex. page 1
      handleSpecialCase(){
        if(this.relatedData.indexOf('preparation') > -1){
          //WHAT IF there is more than one page of
          let query = fetchSamplePreparation(this.objectId,1,true);

          query.then(response => {
            if (response.status === 200) {
              this.preparations = (response.body.count > 0) ? response.body.results : [];
              console.log(this.preparations);
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
.loading-overlay {
  z-index: 10000;
}
</style>
