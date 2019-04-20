<template>
  <b-modal id="newSampleForm"
           header-bg-variant="dark"
           header-text-variant="light"
           centered
           size="xl"
           lazy
           scrollable
           ref="newSampleForm"
           :title="$t('header.addSample')">
    <sample></sample>

    <template slot="modal-footer">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="$root.$emit('add-new-sample-from-modal','LEAVE')">
          <font-awesome-icon icon="door-open"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="$root.$emit('add-new-sample-from-modal','SAVE')">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="hideModal">
          <font-awesome-icon icon="ban"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>

      </div>
    </template>

  </b-modal>
</template>

<script>
  import fontAwesomeLib from './../mixins/fontAwasomeLib'
    import Sample from "../sample/Sample";
    export default {
        name: "addNewSample",
      components: {Sample},
      mixins: [fontAwesomeLib],
      props: {
        sendingData: {
          type: Boolean
        }
      },
      mounted(){
        this.$parent.$on('show-new-sample-modal', this.showModal);
        this.$root.$on('close-new-sample-modal', this.hideModal);
      },
      methods: {
        showModal(){
          this.$refs.newSampleForm.show()
        },
        hideModal(){
          this.$refs.newSampleForm.hide()
          this.$parent.loadRelatedData('sample')
        },
      }
    }
</script>

<style scoped>

</style>
