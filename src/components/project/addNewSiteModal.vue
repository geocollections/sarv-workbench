<template>
  <b-modal id="newSiteForm"
           header-bg-variant="dark"
           header-text-variant="light"
           centered
           size="xl"
           lazy
           scrollable
           ref="newSiteForm"
           :title="title">
    <site :edit-site="site"></site>

    <template slot="modal-footer">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="$root.$emit('add-new-site-from-modal','LEAVE')">
          <font-awesome-icon icon="door-open"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="$root.$emit('add-new-site-from-modal','SAVE')">
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
    import Site from "../site/Site";
    export default {
        name: "addNewSite",
      components: {Site},
      mixins: [fontAwesomeLib],
      props: ['sendingData','site'],
      mounted(){
        this.$parent.$on('show-new-site-modal', this.showModal);
        this.$root.$on('close-new-site-modal', this.hideModal);
      },
      computed: {
          title() {
            console.log(this.site)
            if(this.site === null || typeof this.site === 'undefined' ) return this.$t('header.sites');
            return this.$t('header.sites') + ' id:' + this.site.id
          }
      },
      methods: {
        showModal(){
          this.$refs.newSiteForm.show()
        },
        hideModal(){
          this.$refs.newSiteForm.hide()
          this.$parent.loadRelatedData('site')
        },
        // setTitle() {
        //   console.log(this.site || typeof this.site === 'undefined')
        //   if(this.site === null || typeof this.site === 'undefined' ) return this.$t('header.sites')
        //   return this.$t('header.sites') + ' id:' + this.site.id
        // }
      }
    }
</script>

<style scoped>

</style>
