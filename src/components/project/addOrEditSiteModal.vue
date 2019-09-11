<template>
  <b-modal id="newSiteForm"
           header-bg-variant="dark"
           header-text-variant="light"
           centered
           size="xl"
           lazy
           scrollable
           ref="newSiteForm"
           :title="title" @hide="hideModal">

    <site :editSite='site'></site>

    <template slot="modal-footer">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData"
                @click="$root.$emit('add-or-edit-site-from-modal','SAVE_AND_LEAVE')">
          <i class="fas fa-door-open"></i>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData"
                @click="$root.$emit('add-or-edit-site-from-modal','SAVE')">
          <i class="fas fa-save"></i>
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}
        </button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="hideModal">
          <i class="fas fa-ban"></i>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>

      </div>
    </template>

  </b-modal>
</template>

<script>
  import Site from "../site/Site";

  export default {
    name: "addNewSite",
    components: {Site},
    props: ['sendingData', 'site'],
    mounted() {
      this.$parent.$on('show-new-site-modal', this.showModal);
      this.$root.$on('close-new-site-modal', this.hideModal);

    },
    computed: {
      title() {
        if (this.$store.state['createRelationWith'].edit === null || typeof this.$store.state['createRelationWith'].edit === 'undefined') return this.$t('header.sites');
        return this.$t('header.sites') + ' id:' + this.$store.state['createRelationWith'].edit.id
      }
    },
    methods: {
      showModal() {
        this.$refs.newSiteForm.show()
      },
      hideModal() {
        if (this.$refs.newSiteForm) this.$refs.newSiteForm.hide()
        this.$root.$off('add-or-edit-site-from-modal')
        this.$parent.loadRelatedData('site')
        this.$parent.watchedSite = null
      },
    }
  }
</script>

<style scoped>

</style>
