<template>
  <div class="save-as-new-modal">
    <spinner v-show="modalSendingData" class="loading-overlay" size="massive" :message="$t('add.overlay')"></spinner>

    <b-modal id="saveAsNewForm"
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             lazy
             scrollable
             ref="saveAsNewForm"
             :title="titleExtra ? titleExtra : $t(title)">
      <p class="my-2 h5">{{ $t('saveAsNewModal.text') }}</p>

      <div class="row">
        <div class="col">
          <label :for="`rock_en`">{{ $t('saveAsNewModal.fieldLabel') }}:</label>
          <span class="col-md-4 pr-0 float-right"><b-form-input id="rock_en" v-model="numberOfCopies" type="number" :max="1"></b-form-input></span>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label :for="`rock_en`">{{ $t('saveAsNewModal.text2') }}:</label>
          <div class="col-md-4 pr-0 float-right">
            <span  v-for="data in relatedData">
              <b-form-checkbox v-model="relatedDataChoice[data]" :value="true" :unchecked-value="false">{{$t('sample.relatedTables.'+data)}}</b-form-checkbox>
            </span>

          </div>
        </div>
      </div>

      <template slot="modal-footer">
        <b-button variant="outline-danger" @click="hideModal">{{ this.$t('saveAsNewModal.cancel') }}</b-button>
        <b-button variant="outline-success"
                  @click="$root.$emit('save-object-as-new', { 'numberOfCopies': numberOfCopies, 'relatedData':relatedDataChoice }); modalSendingData = true"
        >{{ this.$t('saveAsNewModal.save') }}</b-button>
      </template>

    </b-modal>

  </div>
</template>

<script>

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
        modalSendingData:false
      }
    },
    mounted(){
      this.$root.$on('show-save-as-new-modal', this.showModal);
      this.$root.$on('close-save-as-new-modal', this.hideModal);
      this.$root.$on('copied-data-saved', this.hideModalAfterSaving);
    },
    methods: {
      showModal(){
        this.$refs.saveAsNewForm.show()
      },
      hideModal(){
        this.$refs.saveAsNewForm.hide()
      },
      hideModalAfterSaving(status){
        this.modalSendingData = false;
        if(status === 'SAVED') {
          this.hideModal();
        } else if(status === 'PROBLEM') {
          console.log("SOME DATA WAS NOT SAVED")
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
